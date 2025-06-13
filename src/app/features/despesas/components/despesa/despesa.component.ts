import { Component, OnInit } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  Validators,
  ReactiveFormsModule,
  FormsModule,
} from '@angular/forms';
import { CommonModule } from '@angular/common';

import { NgxMaskDirective, provideNgxMask } from 'ngx-mask';
import { Despesa } from '../../interface/despesa';

import { finalize } from 'rxjs';
import { DespesaService } from '../../service/despesa.service';

import { Modal } from 'bootstrap';

import { TitleService } from '../../../../core/services/title.service';
import { RouterModule } from '@angular/router';

import Swal from 'sweetalert2';

import { BsDropdownModule } from 'ngx-bootstrap/dropdown';
import { Fornecedor } from '../../interface/fornecedor';
import { FornecedorService } from '../../service/fornecedorService';

@Component({
  selector: 'app-despesa',
  standalone: true,
  imports: [
    NgxMaskDirective,
    ReactiveFormsModule,
    CommonModule,
    FormsModule,
    RouterModule,
    BsDropdownModule,
  ],
  providers: [provideNgxMask()],
  templateUrl: './despesa.component.html',
  styleUrls: ['./despesa.component.scss'],
})
export class DespesasComponent implements OnInit {
  loading: boolean = false;
  form: FormGroup;

  despesa: Despesa[] = [];
  fornecedores: Fornecedor[] = [];

  despesaSelecionadoId: number | null = null;

  mostrarCampoNovaCategoria = false;
  modoEdicao = false;
  modalModo: 'criar' | 'editar' = 'criar';

  filtro = {
    Categorias: '',
    mes: '',
    tipo: '',
  };

  filtroNomeCategoriaSelecionada = 'Todos';

  selecionarCategoria(id: string, nome: string) {
    this.filtro.Categorias = id;
    this.filtroNomeCategoriaSelecionada = nome;
  }

  searchTerm: string = '';

  // get despesaFiltrados(): Despesa[] {
  //   let resultado = this.despesa;

  //   const termo = this.searchTerm?.trim().toLowerCase();
  //   const categoriaSelecionada = this.filtro?.Categorias;

  //   if (termo) {
  //     resultado = resultado.filter((a) =>
  //       a.nome?.toLowerCase().includes(termo)
  //     );
  //   }

  //   if (categoriaSelecionada) {
  //     resultado = resultado.filter(
  //       (a) => a.categoria?.id === +categoriaSelecionada
  //     );
  //   }

  //   return resultado;
  // }

  // filtrar(): void {
  //   this.loading = true;
  // }

  constructor(
    private formBuilder: FormBuilder,
    private despesaService: DespesaService,
    private titleService: TitleService,
    private fornecedorService: FornecedorService,
  ) {
    this.form = this.formBuilder.group({
      nome: ['', Validators.required],
      motivo: ['', Validators.required],
      fornecedorId: ['', Validators.required],
      valor: ['', Validators.required],
      retencaoFonte: ['', Validators.required],
      descricao: [''],
    });
  }

  ngOnInit(): void {
    this.titleService.setTitle('despesa');
    this.inicializarFormulario();
    this.carregarDespesa();
    this.carregarFornecedores();

    this.form.addControl(
      'descricao',
      this.formBuilder.control('', [Validators.maxLength(300)])
    );
    this.form.get('descricao')?.valueChanges.subscribe((value: string) => {
      this.descricao = value;
      this.descricaoRestante = 300 - (value?.length || 0);
    });
  }

  carregarFornecedores(): void {
    this.fornecedorService.listar().subscribe({
      next: (dados) => (this.fornecedores = dados),
      error: (err) => console.error('Erro ao carregar fornecedores', err),
    });
  }

  inicializarFormulario(): void {
    this.form = this.formBuilder.group({
      nome: ['', Validators.required],
      valor: ['', Validators.required],
      fornecedorId: ['', Validators.required],
      motivo: ['', Validators.required],
      retencaoFonte: ['', Validators.required],
      descricao: [''],
    });
  }

  carregarDespesa(): void {
    this.despesaService.listarDespesa().subscribe({
      next: () => {},
    });
  }

  despesaSelecionado: any = null;
  abrirCriarModal() {
    this.modalModo = 'criar';
    this.despesaSelecionado = {}; // ou zere o form como preferir
  }

  salvarDespesa(): void {
    this.loading = true;
    this.modalModo = 'criar';

    // Garante que a descrição nunca seja vazia
    let descricao = this.form.value.descricao?.trim();
    if (!descricao) {
      descricao = 'N/A';
    }

    const despesa: Partial<Despesa> = {
      nome: this.form.value.nome,
      valor: parseFloat(
        String(this.form.value.valor)
          .replace('Kz ', '')
          .replace(/\./g, '')
          .replace(',', '.')
      ),
      // categoriaId: Number(this.form.value.categoria),
      descricao: descricao,
    };

    if (this.despesaSelecionadoId) {
      this.despesaService
        .atualizarDespesa(this.despesaSelecionadoId, despesa)
        .subscribe({
          next: () => {
            this.carregarDespesa();
            this.resetarFormulario();
            Swal.fire({
              icon: 'success',
              title: 'Sucesso!',
              text: 'Despesa atualizado com sucesso!',
              timer: 2000,
              showConfirmButton: false,
            });
            this.fecharModal();
          },
          error: (err) => {
            console.error('Erro ao atualizar:', err);
          },
          complete: () => {
            this.loading = false;
          },
        });
    } else {
      this.despesaService.criarDespesa(despesa).subscribe({
        next: (res: any) => {
          console.log('Despesa criado!', res);
          Swal.fire({
            icon: 'success',
            title: 'Sucesso!',
            text: 'Despesa criado com sucesso!',
            timer: 2000,
            showConfirmButton: false,
          });
          this.fecharModal();
        },
        error: (err: any) => {
          console.error('Erro:', err.error);
        },
        complete: () => {
          this.carregarDespesa();
          this.resetarFormulario();
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

  editarDespesa(despesa: Despesa): void {
    this.modalModo = 'editar';
    this.modalModo = 'editar';
    this.despesaSelecionado = despesa;
    this.despesaSelecionadoId = despesa.id;

    this.form.patchValue({
      nome: despesa.nome,
      valor: despesa.valor.toString(),
      retencaoFonte: despesa.retencaoFonte,
      fornecedorId: despesa.fornecedorId,
      descricao: despesa.descricao,
    });
    this.modoEdicao = true;

    const modalElement = document.getElementById(
      'exampleModal'
    ) as HTMLElement | null;
    if (modalElement) {
      const modal = new Modal(modalElement);
      modal.show();
    }
  }

  atualizarDespesa(): void {
    if (!this.despesaSelecionadoId) return;

    const payload: Partial<Despesa> = {
      nome: this.form.value.nome,
      valor: parseFloat(
        String(this.form.value.valor)
          .replace('Kz ', '')
          .replace(/\./g, '')
          .replace(',', '.')
      ),
      // categoriaId: Number(this.form.value.categoria),

      descricao: this.form.value.descricao || 'N/A',
    };

    this.loading = true;
    this.despesaService
      .atualizarDespesa(this.despesaSelecionadoId, payload)
      .pipe(finalize(() => (this.loading = false)))
      .subscribe({
        next: () => {
          Swal.fire({
            icon: 'success',
            title: 'Atualizado!',
            text: 'Despesa atualizado com sucesso!',
            timer: 2000,
            showConfirmButton: false,
          });
          this.fecharModal();
          this.carregarDespesa();
        },
        error: (err) => {
          console.error('Erro ao atualizar Despesa:', err);
        },
      });
  }

  excluirDespesa(id: number): void {
    Swal.fire({
      title: 'Tem certeza?',
      text: 'Deseja realmente excluir este Despesa?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Sim, excluir!',
      cancelButtonText: 'Cancelar',
    }).then((result) => {
      if (result.isConfirmed) {
        this.despesaService.deletarDespesa(id).subscribe({
          next: () => {
            this.carregarDespesa();
          },
          error: (err) => {
            console.error('Erro ao excluir Despesa:', err);
            Swal.fire({
              icon: 'error',
              title: 'Erro!',
              text: 'Erro ao excluir Despesa. Tente novamente.',
              timer: 2000,
              showConfirmButton: false,
            });
          },
        });
      }
    });
  }

  resetarFormulario(): void {
    this.form.reset();
    this.despesaSelecionadoId = null;
  }

  toggleNovaCategoria() {
    this.mostrarCampoNovaCategoria = !this.mostrarCampoNovaCategoria;
  }

  descricao: string = '';
  descricaoRestante: number = 300;

  ngAfterViewInit(): void {
    this.descricaoRestante = 300 - (this.descricao?.length || 0);
  }
}
