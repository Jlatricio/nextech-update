import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { TitleService } from '../../core/services/title.service';
import { RouterModule } from '@angular/router';
import { DocumentoService } from '../documento/service/documento.service'

import { BsDropdownModule } from 'ngx-bootstrap/dropdown';
import { DadosDocumento } from '../documento/interface/dadosdocumentos';


@Component({
  selector: 'app-inicio',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule,  BsDropdownModule],
  templateUrl: './inicio.component.html',
  styleUrl: './inicio.component.scss',
})
export class InicioComponent {
 DadosDocumentos: DadosDocumento[] = [];

  constructor(private titleService: TitleService,
              private DocumentoService: DocumentoService

  ) {}

  visualizarTodosDocumentos() {
    this.DocumentoService.listarDocumentos().subscribe({
      next: (documentos: DadosDocumento[]) => {
        this.DadosDocumentos = documentos;
      },
      error: (err) => {
        console.error('Erro ao listar documentos:', err);
      }
    });
  }

  ngOnInit(): void {
    this.titleService.setTitle('Dashboard');
      this.visualizarTodosDocumentos();
  }



  cards = [
    {
      title: 'Facturado',
      value: 'Kz 0,00',
      info: '8 transações',
      percentage: '0,00%',
      icon: 'fas fa-file-invoice-dollar', // ícone de fatura
      style: ''
    },
    {
      title: 'Despesas',
      value: 'Kz 0,00',
      info: '8 registos',
      percentage: '0,00%',
      icon: 'fas fa-money-bill-wave', // ícone de dinheiro/despesa
      style: 'warning'
    },
    {
      title: 'Recibos',
      value: 'Kz 0,00',
      info: '8 emitidos',
      percentage: '0,00%',
      icon: 'fas fa-receipt', // ícone de recibo
      style: ''
    },
    {
      title: 'Reembolso',
      value: 'Kz 0,00',
      info: '8 pedidos',
      percentage: '0,00%',
      icon: 'fas fa-undo-alt', // ícone de reembolso
      style: 'danger'
    }
  ];

  isPositive(percentage: string): boolean {
  return parseFloat(percentage.replace('%', '').replace(',', '.')) >= 0;
}
getPercentage(percent: string): string {
  return percent.replace(',', '.');
}




  filtro = {
    ano: '',
    mes: '',
    tipo: ''
  };

  anos = [2025, 2024, 2023];
  meses = ['Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho', 'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro'];
  tipos = ['Receita', 'Despesa', 'Reembolso'];

  filtrar() {
    console.log('Filtro aplicado:', this.filtro);
  }

  searchTerm: string = '';

filteredCards() {
  if (!this.searchTerm) return this.cards;

  return this.cards.filter(card =>
    card.title.toLowerCase().includes(this.searchTerm.toLowerCase())
  );
}

formatTipo(tipo: string): string {
  return tipo.replace(/_/g, ' ').toUpperCase();
}

getTipoClass(tipo: string): string {
  switch (tipo) {
    case 'FACTURA':
      return 'tipo-factura';
    case 'FACTURA_RECIBO':
      return 'tipo-factura-recibo';
    case 'FACTURA_PROFORMA':
      return 'tipo-factura-proforma';
    default:
      return '';
  }
}


}
