import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators,} from '@angular/forms';
import { RouterModule } from '@angular/router';

import {  Observable} from 'rxjs';

import { ClienteService } from '../../service/cliente.service';
import { Cliente } from '../../interface/cliente';
import Swal from 'sweetalert2';
import Modal from 'bootstrap/js/dist/modal';

@Component({
  selector: 'app-cliente',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterModule],
  templateUrl: './cliente.component.html',
  styleUrl: './cliente.component.scss',
})
export class ClienteComponent implements OnInit {
  clientes$: Observable<Cliente[]>;
  form: FormGroup;

  editando = false;
  clienteIdEditando: number | null = null;
  loading: boolean = false;

  constructor(
    private formBuilder: FormBuilder,
    private clienteService: ClienteService
  ) {
    this.form = this.createForm();
    this.clientes$ = this.clienteService.getCliente();
  }

  ngOnInit(): void {
    this.loadClientes();
  }

  private createForm(): FormGroup {
    return this.formBuilder.group({
      nome: ['', Validators.required],
      tipo: ['', Validators.required],
      email: [
        '',
        [Validators.required, Validators.email],
       
      ],
      telefone: ['', [Validators.required]],
      endereco: ['', Validators.required],
    });
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

  private loadClientes(): void {
    this.clientes$ = this.clienteService.getCliente();
  }

  // Variável para armazenar o valor selecionado
  selectedTipo: string = '';

  // Lista com valores formatados
  tipos = [
    { value: 'PESSOA_FISICA', label: 'Pessoa  Física' },
    { value: 'PESSOA_JURIDICA', label: 'Pessoa  Jurídica' },
    { value: 'EMPRESA_PUBLICA', label: 'Empresa Pública' },
    { value: 'EMPRESA_PRIVADA', label: 'Empresa Privada' },
    { value: 'ONG', label: 'ONG' },
  ];

  onSubmit(): void {
    if (this.form.invalid) {
      console.warn('Formulário inválido:', this.form.value);
      this.logValidationErrors();
      return;
    }

    const cliente: Cliente = {
      id: this.editando ? this.clienteIdEditando! : 0,
      ...this.form.value,
    };

    if (this.editando) {
      this.updateCliente(cliente);
    } else {
      this.createCliente(cliente); // Pass Cliente with id
    }
  }
  private createCliente(cliente: Cliente): void {
    this.clienteService.createCliente(cliente).subscribe({
      next: () => {
        Swal.fire({
          icon: 'success',
          title: 'Sucesso!',
          text: 'Cliente criado com sucesso!',
          timer: 2000,
          showConfirmButton: false,
        });
        // Limpa o formulário e reseta o estado de edição
        this.form.reset();

        this.editando = false;
        this.clienteIdEditando = null;
        // Reseta o formulário
        this.resetForm();
        this.loadClientes();
      },
      error: (error) => {
        let msg = 'Erro ao criar cliente.';

        if (error?.status === 400) {
          msg = error.error?.message || 'Dados inválidos. Verifique o formulário.';
        } else if (error?.status === 403) {
          msg = error.error?.message || 'E-mail ou telefone já estão cadastrados.';
        } else if (error?.status === 500) {
          msg = 'Erro interno no servidor. Tente novamente mais tarde.';
        } else if (error?.status === 0) {
          msg = 'Não foi possível conectar ao servidor.';
        }
        
        Swal.fire({
          icon: 'error',
          title:'Verifica o formulario ',
          text:  msg,
          timer: 2000,
          showConfirmButton: false,
        });

      },
    });

   


  }
  // emailExisteValidator(): AsyncValidatorFn {
  //   return (control: AbstractControl): Observable<ValidationErrors | null> => {
  //     if (!control.value) return of(null);
  //     return this.clienteService.checkEmail(control.value).pipe(
  //       map((emailExiste) => (emailExiste ? { emailExiste: true } : null)),
  //       catchError(() => of (null))
  //     );
  //   };
  // }

  // telefoneExisteValidator(): AsyncValidatorFn {
  //   return (control: AbstractControl): Observable<ValidationErrors | null> => {
  //     if (!control.value) return of(null);
  //     return this.clienteService.checkTelefone(control.value).pipe(
  //       map((telefoneExiste) =>
  //         telefoneExiste ? { telefoneExiste: true } : null
  //       ),
  //       catchError(() => of(null))
  //     );
  //   };
  // }

  

  private updateCliente(cliente: Cliente): void {
    this.clienteService
      .editarCliente({
        ...cliente,
        id: this.clienteIdEditando !== null ? this.clienteIdEditando : 0, // Certifique-se de que o ID está sendo passado corretamente
      })
      .subscribe({
        next: () => {
          this.loadClientes();
          this.resetForm();
          Swal.fire({
            icon: 'success',
            title: 'Sucesso!',
            text: 'Cliente atualizado com sucesso!',
            timer: 2000,
            showConfirmButton: false,
          });
          // Atualiza o formulário após salvar
          this.loadClientes();
          this.resetForm();

          this.form.reset();
          this.editando = false;
          this.clienteIdEditando = null;
          // Marca o formulário como limpo e não tocado
          this.form.markAsPristine();
          this.form.markAsUntouched();
          this.form.updateValueAndValidity();
        },
        error: (error) => {
          Swal.fire({
            icon: 'error',
            title: 'Erro!',
            text: 'Erro ao atualizar cliente.',
            timer: 2000,
            showConfirmButton: false,
          });
          // Loga os erros de validação
          console.warn('Erro ao atualizar cliente:', error);
          this.logValidationErrors();
          this.form.markAsPristine();
          this.form.markAsUntouched();
          this.form.updateValueAndValidity();
          // Define loading como false para indicar que a operação foi concluída
          this.loading = false;
        },
        complete: () => {
          this.loading = false;
        },
      });
  }

  populateForm(cliente: Cliente): void {
    // Preenche o formulário com os dados do cliente selecionado
    if (!cliente) {
      Swal.fire({
        icon: 'warning',
        title: 'Atenção!',
        text: 'Cliente não encontrado ou inválido.',
        timer: 2000,
        showConfirmButton: false,
      });

      return;
    }
    // Preenche o formulário com os dados do cliente
    this.form.markAsDirty();
    this.form.markAsTouched();
    this.form.markAsPristine();
    this.form.markAsUntouched();
    this.form.updateValueAndValidity();
    this.logValidationErrors();

    this.form.patchValue({
      nome: cliente.nome,
      email: cliente.email,
      telefone: cliente.telefone,
      endereco: cliente.endereco,
      tipo: cliente.tipo,
    });
    this.editando = true;
    this.clienteIdEditando = cliente.id;
  }

  resetForm(): void {
    // Reseta o formulário para o estado inicial
    this.form.reset();
    this.editando = false;
    this.clienteIdEditando = null;

    this.form.markAsPristine();
    this.form.markAsUntouched();
    this.form.updateValueAndValidity();
    this.logValidationErrors();
    // Limpa os erros de validação
    Object.keys(this.form.controls).forEach((key) => {
      const control = this.form.get(key);
      if (control) {
        control.setErrors(null); // Limpa os erros de validação
      }
    });
    // Limpa os campos do formulário
    this.form.patchValue({
      nome: '',
      email: '',
      telefone: '',
      endereco: '',
      tipo: '',
    });
  }

  deleteCliente(cliente: Cliente): void {
    // Call your service to delete the client by id
    this.clienteService.deleteCliente(cliente).subscribe({
      next: () => {
        // Refresh the list or update the observable
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
        // Atualiza a lista de clientes
        this.form.markAsPristine();
        this.form.markAsUntouched();
        this.form.updateValueAndValidity();
        this.loadClientes();
      },
      error: (err) => {
        // Handle error (optional)
        Swal.fire({
          icon: 'error',
          title: 'Erro!',
          text: 'Erro ao deletar cliente.',
          timer: 2000,
          showConfirmButton: false,
        });
        this.logValidationErrors();
        this.form.markAsPristine();
        this.form.markAsUntouched();
        this.form.updateValueAndValidity();
        this.loadClientes();
        console.error('Erro ao deletar cliente:', err);
      },
    });
  }
  cancelarEdicao(): void {
    this.resetForm();
    this.editando = false;
    this.clienteIdEditando = null;
    // Fecha o modal se estiver usando Bootstrap
    const modalElement = document.querySelector('.modal');
    if (modalElement) {
      const modalInstance = Modal.getInstance(modalElement);
      if (modalInstance) {
        modalInstance.hide();
      }
    }
    this.form.markAsPristine();
    this.form.markAsUntouched();
    this.form.updateValueAndValidity();
    this.logValidationErrors();
  }

  fecharModal(): void {
    this.resetForm();
    this.editando = false;
    this.clienteIdEditando = null;
    // Fecha o modal se estiver usando Bootstrap
    const modalElement = document.querySelector('.modal');
    if (modalElement) {
      const modalInstance = Modal.getInstance(modalElement);
      if (modalInstance) {
        modalInstance.hide();
      }
    }
    this.form.markAsPristine();
    this.form.markAsUntouched();
    this.form.updateValueAndValidity();
    this.logValidationErrors();
  }
  private logValidationErrors(): void {
    Object.entries(this.form.controls).forEach(([key, control]) => {
      console.warn(`${key}:`, {
        valor: control.value,
        válido: control.valid,
        erros: control.errors,
      });
    });
  }
}
