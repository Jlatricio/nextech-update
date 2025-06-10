import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { TitleService } from '../../core/services/title.service';
import { RouterModule } from '@angular/router';
import { DocumentoService } from '../documento/service/documento.service';
import { BsDropdownModule } from 'ngx-bootstrap/dropdown';
import { DadosDocumento } from '../documento/interface/dadosdocumentos';
import { FaturaService } from '../documento/components/factura/service/fatura.service';

@Component({
  selector: 'app-inicio',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule, BsDropdownModule],
  templateUrl: './inicio.component.html',
  styleUrl: './inicio.component.scss',
})
export class InicioComponent {
  DadosDocumentos: DadosDocumento[] = [];

  filtro = {
    ano: '',
    mes: '',
    tipo: ''
  };

  anos = [2025, 2024, 2023];
  meses = ['Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho', 'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro'];
  tipos = ['Receita', 'Despesa', 'Reembolso'];

  searchTerm: string = '';

  cards = [
    {
      title: 'Facturado',
      value: 'Kz 0,00',
      info: '0 transações',
      percentage: '0,00%',
      icon: 'fas fa-file-invoice-dollar',
      style: ''
    },
    {
      title: 'Despesas',
      value: 'Kz 0,00',
      info: '0 registos',
      percentage: '0,00%',
      icon: 'fas fa-money-bill-wave',
      style: 'warning'
    },
    {
      title: 'Recibos',
      value: 'Kz 0,00',
      info: '0 emitidos',
      percentage: '0,00%',
      icon: 'fas fa-receipt',
      style: ''
    },
    {
      title: 'Reembolso',
      value: 'Kz 0,00',
      info: '0 pedidos',
      percentage: '0,00%',
      icon: 'fas fa-undo-alt',
      style: 'danger'
    }
  ];

  constructor(
    private titleService: TitleService,
    private DocumentoService: DocumentoService,
    private FaturaService: FaturaService
  ) {}

  ngOnInit(): void {
    this.titleService.setTitle('Dashboard');
    this.visualizarTodosDocumentos();
  }

  listarFacturas() {
    this.FaturaService.listarFacturas().subscribe({
      next: (facturas: DadosDocumento[]) => {
        this.DadosDocumentos = facturas;
      },
      error: (err) => {
        console.error('Erro ao listar facturas:', err);
      }
    });
  }

  visualizarTodosDocumentos() {
    this.DocumentoService.listarDocumentos().subscribe({
      next: (documentos: DadosDocumento[]) => {
        this.DadosDocumentos = documentos;
        this.atualizarEstatisticas(documentos);
      },
      error: (err) => {
        console.error('Erro ao listar documentos:', err);
      }
    });
  }

  atualizarEstatisticas(documentos: DadosDocumento[]) {
    const facturas = documentos.filter(doc => doc.tipo === 'FACTURA');
    const facturasRecibo = documentos.filter(doc => doc.tipo === 'FACTURA_RECIBO');

    const totalFacturado = facturas.reduce((soma, doc) => soma + (doc.total || 0), 0);
    const transacoes = facturas.length;
    const totalAnterior = 100000;
    const crescimento = totalAnterior > 0 ? ((totalFacturado - totalAnterior) / totalAnterior) * 100 : 0;

    this.cards[0] = {
      title: 'Facturado',
      value: `Kz ${totalFacturado.toLocaleString('pt-AO', { minimumFractionDigits: 2 })}`,
      info: `${transacoes} transações`,
      percentage: `${crescimento.toFixed(2)}%`,
      icon: 'fas fa-file-invoice-dollar',
      style: crescimento >= 0 ? 'positivo' : 'negativo'
    };

    const totalFacturadoRecibo = facturasRecibo.reduce((soma, doc) => soma + (doc.total || 0), 0);
    const transacoesRecibo = facturasRecibo.length;
    const totalAnteriorRecibo = 50000;
    const crescimentoRecibo = totalAnteriorRecibo > 0
      ? ((totalFacturadoRecibo - totalAnteriorRecibo) / totalAnteriorRecibo) * 100
      : 0;

    this.cards[2] = {
      title: 'Recibos',
      value: `Kz ${totalFacturadoRecibo.toLocaleString('pt-AO', { minimumFractionDigits: 2 })}`,
      info: `${transacoesRecibo} emitidos`,
      percentage: `${crescimentoRecibo.toFixed(2)}%`,
      icon: 'fas fa-receipt',
      style: crescimentoRecibo >= 0 ? 'positivo' : 'negativo'
    };
  }

  filtrar() {
    console.log('Filtro aplicado:', this.filtro);
  }

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
      case 'FACTURA': return 'tipo-factura';
      case 'FACTURA_RECIBO': return 'tipo-factura-recibo';
      case 'FACTURA_PROFORMA': return 'tipo-factura-proforma';
      default: return '';
    }
  }

  isPositive(percentage: string): boolean {
    return parseFloat(percentage.replace('%', '').replace(',', '.')) >= 0;
  }

  getPercentage(percent: string): string {
    return percent.replace(',', '.');
  }
}
