import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import Swal from 'sweetalert2';

import { Observable } from 'rxjs/internal/Observable';


import { FornecedorService} from '../../services/fornecedor.service'
import { Fornecedor} from '../../interface/fornecedor';
import { Modal } from 'bootstrap';
import { BsDropdownModule } from 'ngx-bootstrap/dropdown';

@Component({
  selector: 'app-fornecedores',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterModule, BsDropdownModule],
  templateUrl: './fornecedor.component.html',
  styleUrl: './fornecedor.component.scss',
})
export class FornecedoresComponent {
  fornecedor$!: Observable<Fornecedor[]>;

  form: FormGroup;
  fornecedores: Fornecedor[] = [];
  editando: boolean = false;
  fornecedorEditandoId: number | null = null;
  fornecedorOriginal: Fornecedor | null = null;
  loading: boolean = false;

  constructor(
    private formBuilder: FormBuilder,
    private fornecedorService: FornecedorService
  ) {
    this.form = this.formBuilder.group({
      id: [''],
      nome: ['', Validators.required],
      nif: ['', Validators.required],
      endereco: ['', Validators.required],
      telefone: ['', [Validators.required, Validators.minLength(9)]],
      email: ['', [Validators.required, Validators.email]],
    });
  }

  ngOnInit(): void {
    this.fornecedor$ = this.fornecedorService.getFornecedores();
    this.fornecedor$.subscribe((fornecedores: Fornecedor[]) => {
      this.fornecedores = fornecedores;
    });
  }

  criarOuAtualizarUsuario(): void {
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

    if (this.editando && this.fornecedorEditandoId !== null) {
      const originalComparable = {
        nome: this.fornecedorOriginal?.nome,
        nif: this.fornecedorOriginal?.nif,
        endereco: this.fornecedorOriginal?.endereco,
        telefone: this.fornecedorOriginal?.telefone,
        email: this.fornecedorOriginal?.email,
      };

      const atualizadoComparable = {
        nome: this.form.value.nome,
        nif: this.form.value.nif,
        endereco: this.form.value.endereco,
        telefone: this.form.value.telefone,
        email: this.form.value.email,
      };

      if (
        JSON.stringify(originalComparable) === JSON.stringify(atualizadoComparable)
      ) {
        Swal.fire({
          icon: 'info',
          title: 'Sem alterações!',
          text: 'Nenhuma modificação foi detectada nos dados do fornecedor.',
          timer: 2000,
          showConfirmButton: false,
        });
        return;
      }

      this.fornecedorService
        .updateFornecedor({
          ...this.form.value,
          id: this.fornecedorEditandoId
        })
        .subscribe({
          next: () => {
            Swal.fire({
              icon: 'success',
              title: 'Sucesso!',
              text: 'Fornecedor atualizado com sucesso!',
              timer: 2000,
              showConfirmButton: false,
            });
            this.cancelarEdicao();
            this.fornecedor$ = this.fornecedorService.getFornecedores();
            this.fecharModal();
          },
          error: (error) => {
            let msg = 'Erro ao criar Fornecedor.';
                      if (error?.status === 400) {
                        msg =
                          error.error?.message ||
                          'Dados inválidos. Verifique os campos e tente novamente.';
                      } else if (error?.status === 409) {
                        msg =
                          error.error?.message ||
                          'Fornecedor com o mesmo NIF, email ou telefone já existe.';
                      } else if (error?.status === 403) {
                        msg =
                          error.error?.message ||
                          'ou telefone já estão cadastrados.';
                      } else if (error?.status === 500) {
                        msg = 'Erro interno no servidor. Tente novamente mais tarde.';
                      } else if (error?.status === 0) {
                        msg = 'Não foi possível conectar ao servidor.';
                      }
            Swal.fire({
              icon: 'error',
              title: 'Erro!',
              text: msg,
              timer: 2000,
              showConfirmButton: false,
            });
          },
          complete: () => {
            this.fornecedorService.getFornecedores().subscribe({
              next: (fornecedores: Fornecedor[]) => {
                this.fornecedores = fornecedores;
              },
              error: (error) => {
                console.error('Erro ao buscar fornecedores:', error);
              },
            });
            this.form.reset();
            this.loading = false;
          },
        });
    } else {
      this.fornecedorService.createFornecedor(this.form.value).subscribe({
        next: () => {
          Swal.fire({
            icon: 'success',
            title: 'Sucesso!',
            text: 'Fornecedor criado com sucesso!',
            timer: 2000,
            showConfirmButton: false,
          });
          this.fecharModal();
          this.form.reset();
          this.fornecedor$ = this.fornecedorService.getFornecedores();
        },
        error: (error: Error) => {
          console.error('Erro:', error.message);
        },
        complete: () => {
          this.fornecedorService.getFornecedores().subscribe({
            next: (fornecedores: Fornecedor[]) => {
              this.fornecedores = fornecedores;
            },
            error: (error) => {
              console.error('Erro ao buscar fornecedores:', error);
            },
          });
          this.form.reset();
          this.loading = false;
        },
      });
    }
  }

  deleteFornecedor(fornecedor: Fornecedor) {
    this.fornecedorService.deleteFornecedor(fornecedor).subscribe(
      () => {
        // Exibir mensagem de sucesso
        this.fornecedor$ = this.fornecedorService.getFornecedores();
        Swal.fire({
          title: 'Tem certeza?',
          text: 'Deseja realmente excluir este  fornecedor?',
          icon: 'warning',
          showCancelButton: true,
          confirmButtonText: 'Sim, excluir!',
          cancelButtonText: 'Cancelar',
        });
        // Atualizar a lista de fornecedores 
        this.fornecedores = this.fornecedores.filter(
          (f) => f.id !== fornecedor.id
        );
        this.cancelarEdicao();
        this.fecharModal();
        // Exibir mensagem de sucesso
        Swal.fire({
          icon: 'success',
          title: 'Sucesso!',
          text: 'Fornecedor excluído com sucesso!',
          timer: 2000,
          showConfirmButton: false,
        });
      },
      (error) => {
        // Exibir mensagem de erro
        console.log(error.message);
        Swal.fire({
          icon: 'warning',
          title: 'Atenção!',
          text: 'Não é possível eliminar este fornecedor porque ele possui uma despesa associada.',
          showConfirmButton: true,
        });
      }

    );
  }

  updateFornecedor(fornecedor: Fornecedor)
   {

    // Verifica se o fornecedor a ser editado é o mesmo que está sendo editado
    if (this.editando && this.fornecedorEditandoId === fornecedor.id) {
      Swal.fire({
        icon: 'info',
        title: 'Atenção!',
        text: 'Você já está editando este fornecedor.',
        timer: 2000,
        showConfirmButton: false,
      });
      return;
    }
    // Verifica se o formulário é válido antes de prosseguir
    this.form.patchValue({
      id: fornecedor.id,
      nome: fornecedor.nome,
      nif: fornecedor.nif,
      endereco: fornecedor.endereco,
      telefone: fornecedor.telefone,
      email: fornecedor.email,
    });
    this.editando = true;
    this.fornecedorEditandoId = fornecedor.id;
    this.fornecedorOriginal = { ...fornecedor };
    
    if (this.form.invalid) {
      Swal.fire({
        icon: 'warning',
        title: 'Atenção!',
        text: 'Preencha todos os campos obrigatórios.',
        timer: 2000,
        showConfirmButton: false,
      });
      this.fecharModal();
      console.error('Formulário inválido:', this.form.errors);
      // Retorna para evitar a execução do código de atualização

      this.cancelarEdicao();
      this.fecharModal();
      return;
    }
    this.fornecedorService
      .updateFornecedor(fornecedor)
      .subscribe(
        (response) => {
          // Verifica se o formulário é válido antes de prosseguir
          if (this.form.invalid) {
            Swal.fire({
              icon: 'warning',
              title: 'Atenção!',
              text: 'Preencha todos os campos obrigatórios.',
              timer: 2000,
              showConfirmButton: false,
            });
          }
            this.fecharModal();
            console.error('Formulário inválido:', this.form.errors);
          // Exibir mensagem de sucesso
          Swal.fire({
            title: 'Sucesso!',
            text: 'Fornecedor atualizado com sucesso!',
            icon: 'success',
            timer: 2000,
            showConfirmButton: false,
          });
          console.log(response);
          // Atualizar a lista de fornecedores
          this.fornecedor$ = this.fornecedorService.getFornecedores();
          this.cancelarEdicao();
          this.fecharModal();
        },
        (error) => {

          // Exibir mensagem de erro
          console.error('Erro ao atualizar fornecedor:', error);
          Swal.fire({
            icon: 'error',
            title: 'Erro!',
            text: 'Erro ao atualizar fornecedor. Tente novamente.',
            timer: 2000,
            showConfirmButton: false,
          });
        }
      );
  }

  populateForm(fornecedor: Fornecedor) {
    this.form.patchValue({
      ...fornecedor,
    });
    this.editando = true;
    this.fornecedorEditandoId = fornecedor.id!;
    this.fornecedorOriginal = { ...fornecedor };
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
  cancelarEdicao() {
    this.form.reset({ id: 0 });
    this.editando = false;
    this.fornecedorEditandoId = null;
    this.fornecedorOriginal = null;
  }
}
