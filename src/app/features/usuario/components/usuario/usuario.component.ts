import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Usuario } from '../../interface/usuario';
import { usuarioServices } from '../../service/usuario.service';
import { TitleService } from '../../../../core/services/title.service';
import { RouterModule } from '@angular/router';
import { ToastrModule, ToastrService } from 'ngx-toastr';

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
    private usuarioService: usuarioServices,
    private titleService: TitleService
  ) {
   this.form = this.formBuilder.group({
  id: [''],
  nome: ['', Validators.required],
  perfil: ['', Validators.required],
  telefone: ['', [Validators.required, Validators.minLength(9), Validators.maxLength(11)]],
  email: ['', [Validators.required, Validators.email]],
  senhaAtual: [''],
  novaSenha: ['']
}, { validators: this.senhaValidator });

  }
senhaValidator(group: FormGroup) {
  const senhaAtual = group.get('senhaAtual')?.value;
  const novaSenha = group.get('novaSenha')?.value;

  if (senhaAtual && !novaSenha) {
    return { novaSenhaObrigatoria: true };
  }

  return null;
}

  ngOnInit(): void {
    this.titleService.setTitle('Usuários');
     this.form = this.formBuilder.group({
    id: [''],
    nome: ['', Validators.required],
    perfil: ['', Validators.required],
    telefone: ['', [Validators.required, Validators.minLength(9), Validators.maxLength(11)]],
    email: ['', [Validators.required, Validators.email]],
    senha: ['', [Validators.required, Validators.maxLength(10)]]
  });

    this.listarUsuarios();


  }

  listarUsuarios(): void {
    this.usuarioService.listaUsuario().subscribe({
      next: (res) => this.usuarios = res,
      error: (err) => console.error('Erro ao listar usuários', err)
    });
  }

criarOuAtualizarUsuario(): void {
  if (this.form.invalid) {
    alert('Preencha todos os campos obrigatórios.');
    return;
  }

  this.loading = true;

  const usuario = { ...this.form.value };

  // Se senhaAtual estiver vazia, remova os campos de senha do objeto
  if (!usuario.senhaAtual) {
    delete usuario.senhaAtual;
    delete usuario.novaSenha;
  }

  if (this.editando && this.usuarioEditandoId !== null) {
    this.usuarioService.atualizarUsuario(this.usuarioEditandoId, usuario).subscribe({
      next: () => {
        alert('Usuário atualizado com sucesso!');
        this.cancelarEdicao();
        this.listarUsuarios();
        this.fecharModal();
        this.loading = false;
      },
      error: (error) => {
        console.error('Erro ao atualizar usuário:', error);
        this.loading = false;
      }
    });
  } else {
    this.usuarioService.criarUsuario(usuario).subscribe({
      next: () => {
        this.toastr.success('Usuário criado com sucesso!', 'Sucesso', {
          timeOut: 3000,
          positionClass: 'toast-top-right',
          progressBar: true,
          closeButton: true,
          tapToDismiss: true,
        });
        this.form.reset();
        this.listarUsuarios();
        this.fecharModal();
        this.loading = false;
      },
      error: (error) => {
        this.toastr.error(error.error?.message || 'Erro ao criar usuário.', 'Erro', {
          timeOut: 4000,
          positionClass: 'toast-top-right',
          progressBar: true,
          closeButton: true,
          tapToDismiss: true,
        });
        console.error('Erro ao criar usuário:', error);
        this.loading = false;
      }
    });
  }
}

fecharModal(): void {
  const modalElement = document.getElementById('exampleModal');
  if (modalElement) {
    const modalInstance = (window as any).bootstrap.Modal.getInstance(modalElement);
    if (modalInstance) {
      modalInstance.hide();
    }
  }
}



  editarUsuario(usuario: Usuario): void {
    this.form.patchValue({
      ...usuario
    });
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
    if (confirm('Tem certeza que deseja excluir este usuário?')) {
      this.usuarioService.deletarUsuario(id).subscribe({
        next: () => {
          alert('Usuário deletado com sucesso!');
          this.listarUsuarios();
        },
        error: (error) => console.error('Erro ao deletar usuário:', error)
      });
    }
  }

  get usuariosFiltrados(): Usuario[] {
    const termo = this.filtro.toLowerCase();
    return this.usuarios.filter(usuario =>
      usuario.nome.toLowerCase().includes(termo) ||
      usuario.email.toLowerCase().includes(termo) ||
      usuario.perfil.toLowerCase().includes(termo)
    );
  }
}
