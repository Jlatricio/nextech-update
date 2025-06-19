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
    private fornecedorService: FornecedorService,
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
      // Exibir mensagem de alerta se o formulário for inválido
      Swal.fire({
        icon: 'success',
        title: 'Atenção!',
        text: 'Preencha todos os campos obrigatórios.',
        timer: 2000,
        showConfirmButton: false,
      });
      return;
    }

    if (this.editando && this.fornecedorEditandoId !== null) {
      this.fornecedorService
        .updateFornecedor(this.form.value) 
        .subscribe({
          next: () => {
            Swal.fire({
                      icon: 'success',
                      title: 'Sucesso!',
                      text: 'Fornecedor atualizado com sucesso!',
                      timer: 2000,
                      showConfirmButton: false
                    });
            this.cancelarEdicao();
            this.fornecedor$ = this.fornecedorService.getFornecedores();
            this.fecharModal();
          },
          error: (error: any) => {
                       let msg = 'Erro ao atualizar fornecedor.';
                      if (
                        error?.status === 400 ||
                        error?.status === 'No changes detected to update.'
                      ) {
                        msg = 'nenhuma informação foi alterada.';
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
          complete: () => {
            this.loading = false;
          }
        });

    } else {
      this.fornecedorService.createFornecedor(this.form.value).subscribe({
        next: () => {
          Swal.fire({
                   icon: 'success',
                   title: 'Sucesso!',
                   text: 'Fornecedor criado com sucesso!',
                   timer: 2000,
                   showConfirmButton: false
                 });

          this.fecharModal();
          this.form.reset();
          this.fornecedor$ = this.fornecedorService.getFornecedores();
          this.fecharModal();
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
            }
          })
          this.form.reset();
          this.loading = false;
        }
      });
    }
  }

  deleteFornecedor(fornecedor: Fornecedor) {
    this.fornecedorService.deleteFornecedor(fornecedor.id).subscribe(
      () => {
        // Exibir mensagem de sucesso
          Swal.fire({
          title: 'Tem certeza?',
          text: 'Deseja realmente excluir este  fornecedor?',
          icon: 'warning',
          showCancelButton: true,
          confirmButtonText: 'Sim, excluir!',
          cancelButtonText: 'Cancelar'
        })
        // Atualizar a lista de fornecedores
        this.fornecedor$ = this.fornecedorService.getFornecedores();
      },
      (error) => {
        // Exibir mensagem de erro
        console.log(error.message)
        Swal.fire({
          icon: 'warning',
          title: 'Atenção!',
          html: 'Este fornecedor está <b>associado a uma despesa</b> e não pode ser excluído neste momento.',
          confirmButtonText: 'Entendi',
          confirmButtonColor: '#f0ad4e', // cor de atenção (laranja)
        });
      }
    );
  }

  updateFornecedor(fornecedor: Fornecedor) {
    this.fornecedorService
      .updateFornecedor(fornecedor) // <-- Pass only one argument
      .subscribe(
        (response) => {
          // Exibir mensagem de sucesso
          Swal.fire({
              title: 'Sucesso!',
              text: 'Fornecedor atualizado com sucesso!',
              icon: 'success',
              timer: 2000,
              showConfirmButton: false
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
            showConfirmButton: false
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
