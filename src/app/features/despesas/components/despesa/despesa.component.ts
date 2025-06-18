import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
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
// ... (mantém todos os imports como estão)
export class DespesasComponent implements OnInit {
  form: FormGroup;
  despesa: Despesa[] = [];
  fornecedores: Fornecedor[] = [];

  despesaSelecionadoId: number | null = null;
  despesaSelecionado: any = null;

  mostrarCampoNovaCategoria = false;
  modoEdicao = false;
  modalModo: 'criar' | 'editar' = 'criar';

  @ViewChild('closeModalBtn', { static: false })
  closeModalBtn!: ElementRef<HTMLButtonElement>;

  constructor(
    private formBuilder: FormBuilder,
    private despesaService: DespesaService,
    private titleService: TitleService,
    private fornecedorService: FornecedorService
  ) {
    this.form = this.formBuilder.group({
      nome: ['', Validators.required],
      fornecedorId: [null, Validators.required],
      valor: [null, [Validators.required, Validators.min(0)]],
      retencaoFonte: [null, Validators.required],
      motivo: ['', Validators.required],
    });
  }

  ngOnInit(): void {
    this.titleService.setTitle('despesa');
    this.carregarDespesa();
    this.carregarFornecedores();
  }

  carregarFornecedores(): void {
    this.fornecedorService.listar().subscribe({
      next: (dados) => (this.fornecedores = dados),
      error: (err) => console.error('Erro ao carregar fornecedores', err),
    });
  }

  carregarDespesa(): void {
    this.despesaService.listarDespesa().subscribe({
      next: (dados) => {
        console.log('Despesas carregadas:', dados);
        this.despesa = dados;
      },
      error: (err) => {
        console.error('Erro ao carregar despesas', err);
      },
    });
  }

  abrirCriarModal(): void {
    this.resetarFormulario(); // limpa tudo antes de abrir
    this.modalModo = 'criar';

    const modalElement = document.getElementById('exampleModal');
    if (modalElement) {
      const modal = Modal.getOrCreateInstance(modalElement);
      modal.show();
    }
  }

  editarDespesa(despesa: Despesa): void {
    this.modalModo = 'editar';
    this.despesaSelecionado = despesa;
    this.despesaSelecionadoId = despesa.id;

    this.form.patchValue({
      nome: despesa.nome,
      fornecedorId: despesa.fornecedor,
      retencaoFonte: despesa.retencaoFonte,
      valor: despesa.valor.toString(),
      motivo: despesa.motivo,
    });

    this.modoEdicao = true;

    const modalElement = document.getElementById('exampleModal');
    if (modalElement) {
      const modal = Modal.getOrCreateInstance(modalElement);
      modal.show();
    }
  }

  salvarDespesa(): void {
    const motivo = this.form.value.motivo?.trim() || 'N/A';

    const despesa: Partial<Despesa> = {
      nome: this.form.value.nome,
      valor: parseFloat(
        String(this.form.value.valor)
          .replace('Kz ', '')
          .replace(/\./g, '')
          .replace(',', '.')
      ),
      motivo,
      fornecedorId: this.form.value.fornecedorId,
      retencaoFonte: this.form.value.retencaoFonte,
    };

    if (this.despesaSelecionadoId) {
      this.despesaService
        .atualizarDespesa(this.despesaSelecionadoId, despesa)
        .subscribe({
          next: () => {
            this.carregarDespesa();
            Swal.fire({
              icon: 'success',
              title: 'Sucesso!',
              text: 'Despesa atualizada com sucesso!',
              timer: 2000,
              showConfirmButton: false,
            });
            this.fecharModal('exampleModal');
          },
          error: (err) => {
            console.error('Erro ao atualizar:', err);
          },
        });
    } else {
      this.despesaService.criarDespesa(despesa).subscribe({
        next: () => {
          Swal.fire({
            icon: 'success',
            title: 'Sucesso!',
            text: 'Despesa criada com sucesso!',
            timer: 2000,
            showConfirmButton: false,
          });
          this.fecharModal('exampleModal');
        },
        error: (err) => {
          Swal.fire({
            icon: 'error',
            title: 'Erro!',
            text: 'Erro ao criar Despesa. Tente novamente.',
            timer: 2000,
            showConfirmButton: false,
          });
          console.error('Erro:', err.error);
        },
        complete: () => {
          this.carregarDespesa();
        },
      });
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
      retencaoFonte: this.form.value.retencaoFonte,
      fornecedorId: this.form.value.fornecedorId,
      motivo: this.form.value.motivo || 'N/A',
    };

    this.despesaService
      .atualizarDespesa(this.despesaSelecionadoId, payload)
      .subscribe({
        next: () => {
          Swal.fire({
            icon: 'success',
            title: 'Atualizado!',
            text: 'Despesa atualizada com sucesso!',
            timer: 2000,
            showConfirmButton: false,
          });
          this.fecharModal('exampleModal');
        },
        error: (err) => {
          Swal.fire({
            icon: 'error',
            title: 'Erro!',
            text: 'Erro ao atualizar Despesa. Tente novamente.',
            timer: 2000,
            showConfirmButton: false,
          });
          console.error('Erro ao atualizar Despesa:', err);
        },
      });
  }

  excluirDespesa(id: number): void {
    Swal.fire({
      title: 'Tem certeza?',
      text: 'Deseja realmente excluir esta Despesa?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Sim, excluir!',
      cancelButtonText: 'Cancelar',
    }).then((result) => {
      if (result.isConfirmed) {
        this.despesaService.deletarDespesa(id).subscribe({
          next: () => this.carregarDespesa(),
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

  fecharModal(id: string): void {
    this.resetarFormulario(); // <- Limpa ANTES de fechar
    const modalElement = document.getElementById(id);
    if (modalElement) {
      const modalInstance = Modal.getOrCreateInstance(modalElement);
      modalInstance?.hide();
    } else {
      console.warn(`Modal com id="${id}" não encontrado no DOM.`);
    }
  }

  resetarFormulario(): void {
    this.form.reset();
    this.despesaSelecionado = null;
    this.despesaSelecionadoId = null;
    this.modoEdicao = false;
    this.modalModo = 'criar';
  }

  toggleNovaCategoria(): void {
    this.mostrarCampoNovaCategoria = !this.mostrarCampoNovaCategoria;
  }

  getTipoDespesaDescricao(tipo: string): string {
    const tipos: { [key: string]: string } = {
      COMPRA_PRODUTO: 'Compra de Produto',
      PAGAMENTO_SERVICO: 'Pagamento de Serviço',
      DESPESA_INTERNA: 'Despesa Interna',
      AMORTIZACOES: 'Amortizações',
      PAGAMENTO_CREDITO: 'Pagamento de Crédito',
      DESPESAS_BANCARIAS: 'Despesas Bancárias',
    };
    return tipos[tipo] || tipo;
  }

  getretencaoFonteDescricao(retencaoFonte: boolean): string {
    return retencaoFonte ? 'Sim' : 'Não';
  }

  getPrimeiroEUltimoNome(nomeCompleto: string): string {
    const nomes = nomeCompleto.trim().split(/\s+/);
    return nomes.length === 1
      ? nomes[0]
      : `${nomes[0]} ${nomes[nomes.length - 1]}`;
  }

  onSubmitArtigo(): void {
    this.modalModo === 'criar' ? this.salvarDespesa() : this.atualizarDespesa();
  }
}
