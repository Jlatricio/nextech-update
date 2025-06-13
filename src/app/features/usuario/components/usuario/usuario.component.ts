import { Component, Inject, OnInit, PLATFORM_ID } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  Validators,
  AbstractControl,
  ValidationErrors,
  ReactiveFormsModule,
  FormsModule
} from '@angular/forms';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { Usuario } from '../interface/usuario';
import { TitleService } from '../../../../core/services/title.service';
import { RouterModule } from '@angular/router';
import { ToastrModule, ToastrService } from 'ngx-toastr';
import { UsuarioService } from '../../service/usuario.service';
import Swal from 'sweetalert2';
import { Modal } from 'bootstrap';
import { jwtDecode } from 'jwt-decode';

@Component({
  selector: 'app-usuarios',
  standalone: true,
  imports: [CommonModule, RouterModule, ReactiveFormsModule, FormsModule, ToastrModule],
  templateUrl: './usuario.component.html',
  styleUrls: ['./usuario.component.scss'],
})
export class UsuariosComponent implements OnInit {
  usuarios: Usuario[] = [];
  filtro: string = '';
  form: FormGroup;
  formSenha: FormGroup;
  editando = false;
  usuarioEditandoId: number | null = null;
  usuarioOriginal: Usuario | null = null;
  loading = false;
  usuarioLogado: Usuario | null = null;
  usuarioAlterarSenhaId: number | null = null;
  nomeUsuarioParaSenha: string | null = null;
  loadingSenha = false;
  perfilUsuario = '';
  carregouUsuarioLogado = false; // para condicionar template

  constructor(
    @Inject(PLATFORM_ID) private platformId: Object,
    private toastr: ToastrService,
    private formBuilder: FormBuilder,
    private usuarioService: UsuarioService,
    private titleService: TitleService
  ) {
    // Apenas inicializa formulários aqui
    this.form = this.formBuilder.group({
      id: [''],
      nome: ['', Validators.required],
      perfil: ['', Validators.required],
      telefone: ['', [Validators.required, Validators.minLength(9), Validators.maxLength(11)]],
      email: ['', [Validators.required, Validators.email]],
      senha: ['']
    });

    this.formSenha = this.formBuilder.group({
      senha: ['', Validators.required],
      novaSenha: ['', [Validators.required, Validators.minLength(8)]],
      confirmarSenha: ['', Validators.required]
    }, {
      validators: [this.senhasIguaisValidator]
    });
  }

ngOnInit(): void {
  this.titleService.setTitle('Usuários');

  if (isPlatformBrowser(this.platformId)) {
    const userData = localStorage.getItem('usuario');
    const token = localStorage.getItem('token'); // << apenas aqui!

    if (token) {
      try {
        const decoded: any = jwtDecode(token);
        if (decoded && decoded.id && decoded.perfil) {
          const id = Number(decoded.id);
          const perfil = decoded.perfil as string;
          const isOwner = decoded.isOwner === true || decoded.isOwner === 'true';
          const nome = decoded.nome || '';
          const email = decoded.email || '';
          const telefone = decoded.telefone || '';

          this.usuarioLogado = {
            id,
            nome,
            email,
            telefone,
            perfil,
            isActive: true,
            isOwner
          };

          localStorage.setItem('usuario', JSON.stringify(this.usuarioLogado));
        } else {
          console.warn('Token inválido ou incompleto.', decoded);
        }
      } catch (e) {
        console.warn('Erro ao decodificar token JWT:', e);
      }
    }

    if (!this.usuarioLogado && token) {
      try {
        const decoded: any = jwtDecode(token);
        if (decoded && decoded.id && decoded.perfil) {
          const id = typeof decoded.id === 'number' ? decoded.id : Number(decoded.id);
          const perfil = decoded.perfil as string;
          const isOwner = decoded.isOwner === true || decoded.isOwner === 'true';
          const nome = decoded.nome || '';
          const email = decoded.email || '';
          const telefone = decoded.telefone || '';
          this.usuarioLogado = {
            id,
            nome,
            email,
            telefone,
            perfil,
            isActive: true,
            isOwner
          };
          localStorage.setItem('usuario', JSON.stringify(this.usuarioLogado));
          console.log('Preenchido usuarioLogado a partir do token:', this.usuarioLogado);
        } else {
          console.warn('Token JWT não contém claims id/perfil/isOwner adequados', decoded);
        }
      } catch (e) {
        console.warn('Erro ao decodificar token JWT:', e);
      }
    }

    console.log('Usuario logado carregado em ngOnInit:', this.usuarioLogado);

    if (token) {
      try {
        const decoded2: any = jwtDecode(token);
        if (decoded2 && decoded2.perfil) {
          this.perfilUsuario = decoded2.perfil;
        }
        console.log('Perfil de usuário (token):', this.perfilUsuario);
      } catch (e) {
        console.warn('Falha ao decodificar token JWT para perfil:', e);
      }
    }
  } else {
    this.usuarioLogado = null;
  }

  this.carregouUsuarioLogado = true;
  this.listarUsuarios();
}


listarUsuarios(): void {
  this.usuarioService.listaUsuario().subscribe(usuarios => {
    const logado = this.usuarioLogado;
    if (logado && logado.perfil === 'ADMIN' && !logado.isOwner) {
      this.usuarios = usuarios.filter(u => u.id === logado.id);
    } else {
      this.usuarios = usuarios;
    }
  });
}



  getPerfilNome(perfil: string): string {
    switch (perfil) {
      case 'ADMIN': return 'Administrador';
      case 'VENDEDOR': return 'Vendedor';
      default: return perfil;
    }
  }

  criarOuAtualizarUsuario(): void {
  const senhaCtrl = this.form.get('senha');

  // Definir validação da senha
  if (this.editando) {
    senhaCtrl?.clearValidators(); // Em edição, não é obrigatório
  } else {
    senhaCtrl?.setValidators([Validators.required]); // Na criação, é obrigatório
  }
  senhaCtrl?.updateValueAndValidity();

  // Verificação de validade
  if (this.form.invalid) {
    Swal.fire({
      icon: 'warning',
      title: 'Atenção!',
      text: 'Preencha todos os campos obrigatórios.',
      timer: 2000,
      showConfirmButton: false
    });
    return;
  }

  this.loading = true;

  const formValues = this.form.value;
  const telefoneCompleto = formValues.telefone
    .replace(/\s+/g, '')
    .replace(/^(\+244)?/, '+244');

  // Montar payload básico
  const usuarioPayload: any = {
    nome: formValues.nome,
    perfil: formValues.perfil,
    telefone: telefoneCompleto,
    email: formValues.email
  };

  // Incluir senha SOMENTE se:
  // - não estiver editando (criação)
  // - ou estiver editando E campo senha foi preenchido manualmente
  if (!this.editando || (this.editando && formValues.senha?.trim())) {
    usuarioPayload.senha = formValues.senha;
  }

  // Atualização
  if (this.editando && this.usuarioEditandoId !== null) {
    const original = {
      nome: this.usuarioOriginal?.nome,
      perfil: this.usuarioOriginal?.perfil,
      telefone: this.usuarioOriginal?.telefone?.replace(/\s+/g, ''),
      email: this.usuarioOriginal?.email
    };

    const atualizado = { ...usuarioPayload };
    delete atualizado.senha; // ignorar senha na verificação de alteração

    if (JSON.stringify(original) === JSON.stringify(atualizado)) {
      Swal.fire({
        icon: 'info',
        title: 'Sem alterações!',
        text: 'Nenhuma modificação foi detectada.',
        timer: 2000,
        showConfirmButton: false
      });
      this.loading = false;
      return;
    }

    this.usuarioService.atualizarUsuario(this.usuarioEditandoId, usuarioPayload).subscribe({
      next: () => this.afterSave('Usuário atualizado com sucesso!'),
      error: (error) => this.handleError('Erro ao atualizar usuário.', error)
    });

  } else {
    // Criação
    this.usuarioService.criarUsuario(usuarioPayload).subscribe({
      next: () => this.afterSave('Usuário criado com sucesso!'),
      error: (error) => this.handleError('Erro ao criar usuário.', error)
    });
  }
}

  private afterSave(msg: string): void {
    Swal.fire({ icon: 'success', title: 'Sucesso!', text: msg, timer: 2000, showConfirmButton: false });
    this.form.reset();
    this.cancelarEdicao();
    this.listarUsuarios();
    this.fecharModal();
    this.loading = false;
  }

  private handleError(defaultMsg: string, error: any): void {
    Swal.fire({
      icon: 'error',
      title: 'Erro!',
      text: error.error?.message || defaultMsg,
      timer: 3000,
      showConfirmButton: false
    });
    console.error(defaultMsg, error);
    this.loading = false;
  }

  fecharModal(): void {
    const modalEl = document.getElementById('exampleModal');
    if (modalEl) {
      let modal = Modal.getInstance(modalEl);
      if (!modal) modal = new Modal(modalEl);
      modal.hide();
      setTimeout(() => {
        document.body.classList.remove('modal-open');
        document.querySelectorAll('.modal-backdrop').forEach(b => b.remove());
      }, 300);
    }
  }

editarUsuario(usuario: Usuario): void {
  this.form.patchValue({
    nome: usuario.nome,
    email: usuario.email,
    telefone: usuario.telefone?.replace('+244', '').replace(/\s+/g, ''),
    perfil: usuario.perfil,
    senha: '' 
  });

  this.editando = true;
  this.usuarioEditandoId = usuario.id!;
  this.usuarioOriginal = { ...usuario };

  // Remover validação de senha em modo edição
  const senhaCtrl = this.form.get('senha');
  senhaCtrl?.clearValidators();
  senhaCtrl?.updateValueAndValidity();
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
      cancelButtonText: 'Cancelar'
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
          }
        });
      }
    });
  }

  get usuariosFiltrados(): Usuario[] {
    const termo = this.filtro.toLowerCase();
    return this.usuarios.filter(usuario =>
      usuario.nome.toLowerCase().includes(termo) ||
      usuario.email.toLowerCase().includes(termo) ||
      usuario.perfil.toLowerCase().includes(termo)
    );
  }

  ativarOuDesativarUsuario(usuario: Usuario): void {
    if (!this.canDesativar(usuario)) {
      Swal.fire({
        icon: 'warning',
        title: 'Acesso negado',
        text: 'Você não tem permissão para ativar ou desativar este usuário.',
        timer: 2000,
        showConfirmButton: false
      });
      return;
    }

    const novoStatus = !usuario.isActive;
    this.usuarioService.toggleAtivoUsuario(usuario.id!, novoStatus).subscribe({
      next: () => {
        usuario.isActive = novoStatus;
        Swal.fire({
          icon: 'success',
          title: 'Sucesso!',
          text: `Usuário ${novoStatus ? 'ativado' : 'desativado'} com sucesso!`,
          timer: 2000,
          showConfirmButton: false
        });
      },
      error: (error) => {
        Swal.fire({
          icon: 'error',
          title: 'Erro!',
          text: 'Erro ao alterar status do usuário.',
          timer: 3000,
          showConfirmButton: false
        });
        console.error('Erro ao ativar/desativar usuário:', error);
      }
    });
  }

  senhasIguaisValidator(group: AbstractControl): ValidationErrors | null {
    const nova = group.get('novaSenha')?.value;
    const confirma = group.get('confirmarSenha')?.value;
    return nova && confirma && nova !== confirma ? { senhasDiferentes: true } : null;
  }

  abrirModalAlterarSenha(usuario: Usuario): void {
    this.usuarioAlterarSenhaId = usuario.id ?? null;
    this.nomeUsuarioParaSenha = usuario.nome;
    this.formSenha.reset();
  }

  onAlterarSenha(): void {
    if (this.formSenha.invalid) {
      if (this.formSenha.errors?.['senhasDiferentes']) {
        Swal.fire({ icon: 'warning', title: 'Atenção', text: 'A nova senha e a confirmação não coincidem.' });
        return;
      }
      Swal.fire({ icon: 'warning', title: 'Atenção', text: 'Verifique os campos obrigatórios.' });
      return;
    }

    const { senha, novaSenha } = this.formSenha.value;
    const userId = this.usuarioAlterarSenhaId ?? this.usuarioEditandoId ?? this.usuarioLogado?.id;
    if (!userId) {
      this.toastr.error('Usuário não encontrado.');
      return;
    }

    this.loadingSenha = true;
    this.usuarioService.changePassword(userId, senha, novaSenha).subscribe({
      next: () => {
        this.loadingSenha = false;
        Swal.fire({ icon: 'success', title: 'Sucesso', text: 'Senha alterada com sucesso!', timer: 2000, showConfirmButton: false });
        this.formSenha.reset();
        this.fecharModalSenha();
      },
      error: (err) => {
        this.loadingSenha = false;
        const msg = err.error?.message || err.error?.error || 'Erro ao alterar senha.';
        Swal.fire({ icon: 'error', title: 'Erro', text: msg });
      }
    });
  }

  fecharModalSenha(): void {
    const modalEl = document.getElementById('modalalterarsenha');
    if (modalEl) {
      const modalInstance = Modal.getInstance(modalEl) || new Modal(modalEl);
      modalInstance.hide();
      setTimeout(() => {
        document.body.classList.remove('modal-open');
        document.querySelectorAll('.modal-backdrop').forEach(b => b.remove());
      }, 300);
    }
    this.usuarioAlterarSenhaId = null;
    this.nomeUsuarioParaSenha = null;
  }

  // ====== LÓGICA DE PERMISSÕES ======

 canEditPerfil(usuario: Usuario): boolean {
  // Só o isOwner pode editar perfis (inclusive o próprio)
  return this.usuarioLogado?.isOwner ?? false;
}




 canSelectAdmin(): boolean {
  return !!this.usuarioLogado?.isOwner;
}

canEdit(usuario: Usuario): boolean {
  if (!this.usuarioLogado) return false;

  // Owner pode editar qualquer um
  if (this.usuarioLogado.isOwner) return true;

  // Admin que não é owner pode editar somente a si mesmo
  return this.usuarioLogado.perfil === 'ADMIN' && this.usuarioLogado.id === usuario.id;
}



  canDesativar(usuario: Usuario): boolean {
    if (!this.usuarioLogado) return false;
    // Somente isOwner pode desativar, exceto a si mesmo
    return this.usuarioLogado.isOwner && usuario.id !== this.usuarioLogado.id;
  }
}
