import { Component, OnInit } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Usuario } from '../../interface/usuario';
import { TitleService } from '../../../../core/services/title.service';
import { RouterModule } from '@angular/router';
import { ToastrModule, ToastrService } from 'ngx-toastr';
import { UsuarioService } from '../../service/usuario.service';
import Swal from 'sweetalert2';
import { Modal } from 'bootstrap';

@Component({
  selector: 'app-usuarios',
  standalone: true,
  imports: [CommonModule, RouterModule, ReactiveFormsModule, ToastrModule],
  templateUrl: './usuario.component.html',
  styleUrls: ['./usuario.component.scss'],
})
export class UsuariosComponent implements OnInit {
  usuarios: Usuario[] = [];
  filtro: string = '';
  form: FormGroup;
  editando = false;
  usuarioEditandoId: number | null = null;
  usuarioOriginal: Usuario | null = null;
  loading: boolean = false;

  constructor(
    private toastr: ToastrService,
    private formBuilder: FormBuilder,
    private usuarioService: UsuarioService,
    private titleService: TitleService
  ) {
    this.form = this.formBuilder.group({
      id: [''],
      nome: ['', Validators.required],
      perfil: ['', Validators.required],
      telefone: [
        '',
        [
          Validators.required,
          Validators.minLength(9),
          Validators.maxLength(11),
        ],
      ],
      email: ['', [Validators.required, Validators.email]],
      senha: [''],
    });
  }

  getPerfilNome(perfil: string): string {
    if (perfil === 'ADMIN') return 'Administrador';
    if (perfil === 'VENDEDOR') return 'Vendedor';
    return perfil;
  }

  ngOnInit(): void {
    this.titleService.setTitle('Usuários');
    this.listarUsuarios();
  }

  listarUsuarios(): void {
    this.usuarioService.listaUsuario().subscribe({
      next: (res) => (this.usuarios = res),
      error: (err) => console.error('Erro ao listar usuários', err),
    });
  }

  criarOuAtualizarUsuario(): void {
    if (this.editando) {
      this.form.get('senha')?.clearValidators();
    } else {
      this.form.get('senha')?.setValidators([Validators.required]);
    }
    this.form.get('senha')?.updateValueAndValidity();

    if (this.form.invalid) {
      Swal.fire({
        icon: 'warning',
        title: 'Atenção!',
        text: 'Preencha todos os campos obrigatórios.',
        timer: 2000,
        showConfirmButton: false,
      });
      return;
    }

    this.loading = true;

    const telefoneRaw: string = this.form.get('telefone')?.value || '';
    const telefoneLimpo = telefoneRaw.replace(/\s+/g, '');
    const telefoneCompleto = telefoneLimpo.startsWith('+244')
      ? telefoneLimpo
      : '+244' + telefoneLimpo;

    const formValues = this.form.value;

    const usuario: any = {
      nome: formValues.nome,
      perfil: formValues.perfil,
      telefone: telefoneCompleto,
      email: formValues.email,
    };

    if (!this.editando || (this.editando && formValues.senha)) {
      usuario.senha = formValues.senha;
    }

    if (this.editando && this.usuarioEditandoId !== null) {
      const original = {
        nome: this.usuarioOriginal?.nome,
        perfil: this.usuarioOriginal?.perfil,
        telefone: this.usuarioOriginal?.telefone?.replace(/\s+/g, ''),
        email: this.usuarioOriginal?.email,
      };

      // Remove senha da comparação
      const atualizado = { ...usuario };
      delete atualizado.senha;

      if (JSON.stringify(original) === JSON.stringify(atualizado)) {
        Swal.fire({
          icon: 'info',
          title: 'Sem alterações!',
          text: 'Nenhuma modificação foi detectada nos dados.',
          timer: 2000,
          showConfirmButton: false,
        });
        this.loading = false;
        return;
      }

      this.usuarioService
        .atualizarUsuario(this.usuarioEditandoId, usuario)
        .subscribe({
          next: () => {
            Swal.fire({
              icon: 'success',
              title: 'Sucesso!',
              text: 'Usuário atualizado com sucesso!',
              timer: 3000,
              showConfirmButton: false,
            });
            this.cancelarEdicao();
            this.listarUsuarios();
            this.fecharModal();
            this.loading = false;
          },
          error: (error) => {
            Swal.fire({
              icon: 'error',
              title: 'Erro!',
              text: error.error?.message || 'Erro ao atualizar usuário.',
              timer: 3000,
              showConfirmButton: false,
            });
            console.error('Erro ao atualizar usuário:', error);
            this.loading = false;
          },
        });
    } else {
      this.usuarioService.criarUsuario(usuario).subscribe({
        next: () => {
          Swal.fire({
            icon: 'success',
            title: 'Sucesso!',
            text: 'Usuário criado com sucesso!',
            timer: 2000,
            showConfirmButton: false,
          });
          this.form.reset();
          this.listarUsuarios();
          this.fecharModal();
          this.loading = false;
        },
        error: (error) => {
          Swal.fire({
            icon: 'error',
            title: 'Erro!',
            text: error.error?.message || 'Erro ao criar usuário.',
            timer: 3000,
            showConfirmButton: false,
          });
          console.error('Erro ao criar usuário:', error);
          this.loading = false;
        },
      });
    }
  }

  fecharModal(): void {
    const modalElement = document.getElementById('exampleModal');

    if (modalElement) {
      let modal = Modal.getInstance(modalElement);
      if (!modal) {
        modal = new Modal(modalElement);
      }

      modal.hide();

      // Espera o modal terminar a animação e remove o backdrop manualmente
      setTimeout(() => {
        // Remove classe que trava o scroll da página
        document.body.classList.remove('modal-open');

        // Remove o backdrop (fundo escuro)
        const backdrops = document.querySelectorAll('.modal-backdrop');
        backdrops.forEach((b) => b.remove());
      }, 300); // 300ms é o tempo padrão do fade-out no Bootstrap
    }
  }

  editarUsuario(usuario: Usuario): void {
    const telefoneSemPrefixo =
      usuario.telefone?.replace('+244', '').replace(/\s+/g, '') || '';

    this.form.patchValue({
      ...usuario,
      telefone: telefoneSemPrefixo,
    });

    const isRestricted = usuario.isOwner || usuario.perfil === 'VENDEDOR';
    if (isRestricted) {
      this.form.get('perfil')?.disable();
    } else {
      this.form.get('perfil')?.enable();
    }

    this.editando = true;
    this.usuarioEditandoId = usuario.id!;
    this.usuarioOriginal = { ...usuario };
  }

  cancelarEdicao(): void {
    this.form.reset();
    this.editando = false;
    this.usuarioEditandoId = null;
    this.usuarioOriginal = null;
  }

  deletarUsuario(id: number): void {
    Swal.fire({
      title: 'Tem certeza?',
      text: 'Deseja realmente excluir este usuário?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Sim, excluir!',
      cancelButtonText: 'Cancelar',
    }).then((result) => {
      if (result.isConfirmed) {
        this.usuarioService.deletarUsuario(id).subscribe({
          next: () => {
            this.listarUsuarios();
            this.toastr.success('Usuário excluído com sucesso!');
          },
          error: (error) => {
            this.toastr.error('Erro ao deletar usuário.');
            console.error('Erro ao deletar usuário:', error);
          },
        });
      }
    });
  }

  get usuariosFiltrados(): Usuario[] {
    const termo = this.filtro.toLowerCase();
    return this.usuarios.filter(
      (usuario) =>
        usuario.nome.toLowerCase().includes(termo) ||
        usuario.email.toLowerCase().includes(termo) ||
        usuario.perfil.toLowerCase().includes(termo)
    );
  }

  ativarOuDesativarUsuario(usuario: Usuario): void {
    const novoStatus = !usuario.isActive;
    this.usuarioService.toggleAtivoUsuario(usuario.id!, novoStatus).subscribe({
      next: () => {
        usuario.isActive = novoStatus;
        Swal.fire({
          icon: 'success',
          title: 'Sucesso!',
          text: `Usuário ${novoStatus ? 'ativado' : 'desativado'} com sucesso!`,
          timer: 2000,
          showConfirmButton: false,
        });
      },
      error: (error) => {
        Swal.fire({
          icon: 'error',
          title: 'Erro!',
          text: 'Erro ao alterar status do usuário.',
          timer: 3000,
          showConfirmButton: false,
        });
        console.error('Erro ao ativar/desativar usuário:', error);
      },
    });
  }
}
