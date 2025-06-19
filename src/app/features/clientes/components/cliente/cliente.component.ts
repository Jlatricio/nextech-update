import { Component, OnInit, inject, DestroyRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators, FormControl,} from '@angular/forms';
import { RouterModule } from '@angular/router';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

import {BehaviorSubject,combineLatest,finalize,map,Observable,switchMap,} from 'rxjs';

import { ClienteService } from '../../service/cliente.service';
import { Cliente } from '../../interface/cliente';

import Swal from 'sweetalert2';
import Modal from 'bootstrap/js/dist/modal';
import { BsDropdownModule } from 'ngx-bootstrap/dropdown';

@Component({
  selector: 'app-cliente',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    RouterModule,
    BsDropdownModule,
    FormsModule,
  ],
  templateUrl: './cliente.component.html',
  styleUrl: './cliente.component.scss',
})
export class ClienteComponent implements OnInit {
  clienteOriginal: Cliente | null = null;
  editando = false;
  clienteIdEditando: number | null = null;
  loading: boolean = false;

  private refreshClientes$ = new BehaviorSubject<void>(undefined);

  searchTerm$ = new BehaviorSubject<string>('');
  selectedTipo$ = new BehaviorSubject<string>('');

  clientes$: Observable<Cliente[]>;
  clientesFiltrados$!: Observable<Cliente[]>;

  form: FormGroup;
  private destroyRef = inject(DestroyRef);

  tipos = [
    { value: 'PESSOA_FISICA', label: 'Pessoa Física' },
    { value: 'PESSOA_JURIDICA', label: 'Pessoa Jurídica' },
    { value: 'EMPRESA_PUBLICA', label: 'Empresa Pública' },
    { value: 'EMPRESA_PRIVADA', label: 'Empresa Privada' },
    { value: 'ONG', label: 'ONG' },
  ];

  constructor(
    private formBuilder: FormBuilder,
    private clienteService: ClienteService
  ) {
    this.form = this.createForm();

    // clientes$ recarrega via refreshClientes$
    this.clientes$ = this.refreshClientes$.pipe(
      switchMap(() => this.clienteService.getCliente()),
      takeUntilDestroyed(this.destroyRef)
    );

    // combinamos para filtragem
    this.clientesFiltrados$ = combineLatest([
      this.clientes$,
      this.searchTerm$,
      this.selectedTipo$,
    ]).pipe(
      map(([clientes, termo, tipo]) => {
        termo = termo.toLowerCase().trim();
        return clientes.filter((c) => {
          const correspondeNome = termo
            ? c.nome.toLowerCase().includes(termo)
            : true;
          const correspondeTipo = tipo ? c.tipo === tipo : true;
          return correspondeNome && correspondeTipo;
        });
      })
    );
  }

  ngOnInit(): void {
    this.loadClientes();
  }

  private createForm(): FormGroup {
    return this.formBuilder.group({
      nome: ['', [Validators.required, Validators.minLength(3)]],
      tipo: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      telefone: ['', [Validators.required, Validators.minLength(9)]],
      endereco: ['', Validators.required],
    });
  }

  // Getters para template
  get nome(): FormControl { return this.form.get('nome') as FormControl;}
  get email(): FormControl {return this.form.get('email') as FormControl;}
  get telefone(): FormControl { return this.form.get('telefone') as FormControl;}
  get endereco(): FormControl {return this.form.get('endereco') as FormControl;}
  get tipoCtrl(): FormControl {return this.form.get('tipo') as FormControl;}

  private loadClientes(): void {
    this.refreshClientes$.next();
  }

  onSearchChange(valor: string): void {
    this.searchTerm$.next(valor);
  }

  onTipoChange(tipo: string): void {
    this.selectedTipo$.next(tipo);
  }

  abrirModalParaCriar(): void {
    this.resetForm();
    this.editando = false;
    this.clienteIdEditando = null;
    this.clienteOriginal = null;
    setTimeout(() => {
      const modalEl = document.getElementById('modalCliente');
      if (modalEl) {
        const modalRef = Modal.getInstance(modalEl) || new Modal(modalEl);
        modalRef.show();
      }
    }, 0);
  }

  editarCliente(cliente: Cliente): void {
    this.populateForm(cliente);
    this.editando = true;
    this.clienteIdEditando = cliente.id!;
    this.clienteOriginal = { ...cliente };
    const modalEl = document.getElementById('modalCliente');
    if (modalEl) {
      const modalRef = Modal.getInstance(modalEl) || new Modal(modalEl);
      modalRef.show();
    }
  }

  populateForm(cliente: Cliente): void {
    this.form.patchValue({
      nome: cliente.nome,
      email: cliente.email,
      telefone: cliente.telefone,
      endereco: cliente.endereco,
      tipo: cliente.tipo,
    });
    this.form.markAsPristine();
    this.form.markAsUntouched();
    this.form.updateValueAndValidity();
    this.editando = true;
    this.clienteIdEditando = cliente.id!;
    this.clienteOriginal = { ...cliente };
  }

  resetForm(): void {
    this.form.reset();
    this.editando = false;
    this.clienteIdEditando = null;
    this.clienteOriginal = null;
    this.form.markAsPristine();
    this.form.markAsUntouched();
    this.form.updateValueAndValidity();
    Object.keys(this.form.controls).forEach((key) => {
      const ctrl = this.form.get(key);
      if (ctrl) ctrl.setErrors(null);
    });
  }

  // Aqui implementamos onSubmit, que faltava
  onSubmit(): void {
   if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }
    const clienteData: Cliente = {
      id: this.editando ? this.clienteIdEditando! : 0,
      ...this.form.value,
    };
    if (this.editando) {
      this.updateCliente(clienteData);
    } else {
      this.createCliente(clienteData);
    }
  }

  private createCliente(cliente: Cliente): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }
    this.clienteService
      .createCliente(cliente)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: () => {
          Swal.fire({
            icon: 'success',
            title: 'Sucesso!',
            text: 'Cliente criado com sucesso!',
            timer: 2000,
            showConfirmButton: false,
          });
          const modalEl = document.getElementById('modalCliente');
          if (modalEl) {
            const modalRef = Modal.getInstance(modalEl) || new Modal(modalEl);
            modalRef.hide();
          }
          this.resetForm();
          this.loadClientes();
        },
        error: (error) => {
          let msg = 'Erro ao criar cliente.';
          if (error?.status === 400) {
            msg =
              error.error?.message ||
              'Dados inválidos. Verifique o formulário.';
          } else if (error?.status === 403) {
            msg =
              error.error?.message ||
              'E-mail ou telefone já estão cadastrados.';
          } else if (error?.status === 500) {
            msg = 'Erro interno no servidor. Tente novamente mais tarde.';
          } else if (error?.status === 0) {
            msg = 'Não foi possível conectar ao servidor.';
          }
          Swal.fire({
            icon: 'error',
            title: 'Verifique o formulário',
            text: msg,
            timer: 2000,
            showConfirmButton: false,
          });
        },
      });
  }

  private updateCliente(cliente: Cliente): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }
    if (!this.clienteIdEditando) {
      return;
    }
    const clienteAtualizado: Cliente = {
      id: this.clienteIdEditando,
      ...this.form.value,
    };
    // comparar com original
    const originalComparable = {
      nome: this.clienteOriginal?.nome,
      email: this.clienteOriginal?.email,
      telefone: this.clienteOriginal?.telefone,
      endereco: this.clienteOriginal?.endereco,
      tipo: this.clienteOriginal?.tipo,
    };
    const atualizadoComparable = {
      nome: clienteAtualizado.nome,
      email: clienteAtualizado.email,
      telefone: clienteAtualizado.telefone,
      endereco: clienteAtualizado.endereco,
      tipo: clienteAtualizado.tipo,
    };
    if (
      JSON.stringify(originalComparable) ===
      JSON.stringify(atualizadoComparable)
    ) {
      Swal.fire({
        icon: 'info',
        title: 'Sem alterações!',
        text: 'Nenhuma modificação foi detectada nos dados do cliente.',
        timer: 2000,
        showConfirmButton: false,
      });
      return;
    }
    this.loading = true;
    this.clienteService
      .editarCliente(clienteAtualizado)
      .pipe(
        takeUntilDestroyed(this.destroyRef),
        finalize(() => (this.loading = false))
      )
      .subscribe({
        next: () => {
          Swal.fire({
            icon: 'success',
            title: 'Sucesso!',
            text: 'Cliente atualizado com sucesso!',
            timer: 2000,
            showConfirmButton: false,
          });
          const modalEl = document.getElementById('modalCliente');
          if (modalEl) {
            const modalRef = Modal.getInstance(modalEl) || new Modal(modalEl);
            modalRef.hide();
          }
          this.resetForm();
          this.loadClientes();
        },
        error: (error) => {
          Swal.fire({
            icon: 'error',
            title: 'Erro!',
            text: error.error?.message || 'Erro ao atualizar cliente.',
            timer: 2000,
            showConfirmButton: false,
          });
          console.warn('Erro ao atualizar cliente:', error);
        },
      });
  }

  deleteCliente(cliente: Cliente): void {
    this.clienteService
      .deleteCliente(cliente)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: () => {
          Swal.fire({
            icon: 'success',
            title: 'Sucesso!',
            text: 'Cliente deletado com sucesso!',
            timer: 2000,
            showConfirmButton: false,
          });
          this.resetForm();
          this.editando = false;
          this.clienteIdEditando = null;
          this.loadClientes();
        },
        error: (err) => {
          Swal.fire({
            icon: 'error',
            title: 'Erro!',
            text: 'Erro ao deletar cliente.',
            timer: 2000,
            showConfirmButton: false,
          });
          console.error('Erro ao deletar cliente:', err);
          this.loadClientes();
        },
      });
  }

  cancelarEdicao(): void {
    this.resetForm();
    this.editando = false;
    this.clienteIdEditando = null;
    const modalEl = document.getElementById('modalCliente');
    if (modalEl) {
      (document.activeElement as HTMLElement)?.blur(); // remove foco antes de esconder
      const modalRef = Modal.getInstance(modalEl);
      modalRef?.hide();
    }
  }

  fecharModal(): void {
    this.resetForm();
    this.editando = false;
    this.clienteIdEditando = null;
    const modalEl = document.getElementById('modalCliente');
    if (modalEl) {
      (document.activeElement as HTMLElement)?.blur(); // remove foco antes de esconder
      const modalRef = Modal.getInstance(modalEl) || new Modal(modalEl);
      modalRef.hide();
    }
  }

  getTipoClienteNome(tipo: string): string {
    switch (tipo) {
      case 'PESSOA_FISICA':
        return 'Pessoa Física';
      case 'PESSOA_JURIDICA':
        return 'Pessoa Jurídica';
      case 'EMPRESA_PUBLICA':
        return 'Empresa Pública';
      case 'EMPRESA_PRIVADA':
        return 'Empresa Privada';
      case 'ONG':
        return 'ONG';
      default:
        return tipo;
    }
  }
}
