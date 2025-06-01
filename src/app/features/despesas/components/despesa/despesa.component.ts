import { Component } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';

import { Modal } from 'bootstrap';
import { Observable } from 'rxjs';

import { CommonModule } from '@angular/common';
import { DespesaService } from '../../service/despesa.service';
import { Despesa } from '../../interface/despesa';
import { NgxMaskDirective, provideNgxMask } from 'ngx-mask';
import { TitleService } from '../../../../core/services/title.service';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-despesa',
  imports: [NgxMaskDirective,ReactiveFormsModule, CommonModule, FormsModule, RouterModule],
   providers: [provideNgxMask()],
  templateUrl: './despesa.component.html',
  styleUrl: './despesa.component.scss'
})
export class DespesaComponent {


  despesa$: Observable<Despesa[]>;
  form: FormGroup;
  populateForm(despesa: any): void {
  this.form.patchValue({
    nome: despesa.nome,
    motivo: despesa.motivo,
    fornecedor: despesa.fornecedor,
    reteencaonafonte: despesa.reteencaonafonte,
    data: despesa.data,
    entidade: despesa.entidade,
    criadopor: despesa.criadopor,
    valor: despesa.valor,
    documento: despesa.documento
  });
}

  constructor(private formBuilder: FormBuilder, private despesaService: DespesaService,  private titleService: TitleService) {
    this.despesa$ = this.despesaService.listaDespesas();

    this.form = this.formBuilder.group({
      nome: ['', Validators.required],
      fornecedor: ['', Validators.required],
      motivo: ['', Validators.required],
      criadopor: ['Admin', Validators.required],
      data: [new Date().toISOString(), Validators.required], // Capture current date and time
      rtnc: ['', Validators.required],
      valor: ['', Validators.required]
    });
  }

  ngOnInit(): void {
    this.titleService.setTitle('Nextech - Despesas');
  }


  onSubmit() {
    if (this.form.valid) {
      this.despesaService.salvarDespesa(this.form.value).subscribe(result => {
        console.log(result);
        this.form.reset(); // Clear the form
        const modal = document.getElementById('exampleModal');
        if (modal) {
          const bootstrapModal = Modal.getInstance(modal);
          bootstrapModal?.hide(); // Close the modal
        }
        this.despesa$ = this.despesaService.listaDespesas();
      });
    }
  }

  deleteArtigo(id: number | undefined) {
    if (id !== undefined) {
      this.despesaService.deletarDespesa(id).subscribe(() => {
        console.log(`Artigo with ID ${id} deleted`);
        this.despesa$ = this.despesaService.listaDespesas();
      });
    }
  }

  updateArtigo(id: number) {
    if (this.form.valid) {
      this.despesaService.atualizarDespesa(id, this.form.value).subscribe(updatedArtigo => {
        console.log(`Artigo with ID ${id} updated`, updatedArtigo);
        this.form.reset(); // Clear the form
        const modal = document.getElementById('exampleModal');
        if (modal) {
          const bootstrapModal = Modal.getInstance(modal);
          bootstrapModal?.hide(); // Close the modal
        }
        this.despesa$ = this.despesaService.listaDespesas();
      });
    }
  }

  cards = [
    {
      title: 'Facturado',
      value: 'Kz 0,00',
      info: '8 transações',
      percentage: '0,00%',
      icon: 'fas fa-file-invoice',
      style: ''
    },
    {
      title: 'Despesas',
      value: 'Kz 0,00',
      info: '8 registos',
      percentage: '0,00%',
      icon: 'fas fa-money-bill-wave',
      style: 'warning'
    },
    {
      title: 'Recibos',
      value: 'Kz 0,00',
      info: '8 emitidos',
      percentage: '0,00%',
      icon: 'fas fa-receipt',
      style: ''
    },
    {
      title: 'Reembolso',
      value: 'Kz 0,00',
      info: '8 pedidos',
      percentage: '0,00%',
      icon: 'fas fa-undo',
      style: 'danger'
    }
  ];


  filtro = {
    Categorias: '',
    mes: '',
    tipo: ''
  };

  Categorias = ['Serviço','Produto'];

  filtrar() {
    console.log('Filtro aplicado:', this.filtro);
    // aqui você pode fazer um filtro real nos dados ou chamada a um serviço/backend
  }

  searchTerm: string = '';

filteredCards() {
  if (!this.searchTerm) return this.cards;

  return this.cards.filter(card =>
    card.title.toLowerCase().includes(this.searchTerm.toLowerCase())
  );
}
}
