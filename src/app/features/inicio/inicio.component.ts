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
  styleUrls: ['./inicio.component.scss'],  // Corrigido aqui
})
export class InicioComponent {
  DadosDocumentos: DadosDocumento[] = [];
  documentosOriginais: DadosDocumento[] = [];

  currentPage = 1;
  itemsPerPage = 10;
  totalPages = 0;

  get documentosPaginados(): DadosDocumento[] {
    const startIndex = (this.currentPage - 1) * this.itemsPerPage;
    return this.DadosDocumentos.slice(startIndex, startIndex + this.itemsPerPage);
  }

  filtro = {
    Categorias: '',
    mes: '',
    ano: '',
    tipo: ''
  };

  anos: number[] = [];
  meses: number[] = [];
  tipos: string[] = [];

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
        this.atualizarTotalPages();
      },
      error: (err) => {
        console.error('Erro ao listar facturas:', err);
      }
    });
  }

  visualizarTodosDocumentos() {
    this.DocumentoService.listarDocumentos().subscribe({
      next: (documentos: DadosDocumento[]) => {
        this.documentosOriginais = documentos;
        this.DadosDocumentos = documentos;
        this.atualizarEstatisticas(documentos);
        this.inicializarFiltros(documentos);
        this.atualizarTotalPages();
      },
      error: (err) => {
        console.error('Erro ao listar documentos:', err);
      }
    });
  }

  inicializarFiltros(documentos: DadosDocumento[]) {
    this.anos = [...new Set(documentos.map(doc => new Date(doc.dataEmissao).getFullYear()))];
    this.meses = [...new Set(documentos.map(doc => new Date(doc.dataEmissao).getMonth() + 1))];
    this.tipos = [...new Set(documentos.map(doc => doc.tipo))];
  }

  atualizarEstatisticas(documentos: DadosDocumento[]) {
  const facturas = documentos.filter(doc => doc.tipo === 'FACTURA');
  const facturasRecibo = documentos.filter(doc => doc.tipo === 'FACTURA_RECIBO');

  const totalFacturado = facturas.reduce((soma, doc) => soma + (doc.total || 0), 0);
  const transacoes = facturas.length;
  const totalAnterior = 100000;
  const crescimento = totalAnterior > 0 ? ((totalFacturado - totalAnterior) / totalAnterior) * 100 : 0;

  let styleFacturado = '';
  if (crescimento > 5) {
    styleFacturado = 'positivo';
  } else if (crescimento < -5) {
    styleFacturado = 'negativo';
  } else {
    styleFacturado = 'warning';
  }

  this.cards[0] = {
    title: 'Facturado',
    value: `Kz ${totalFacturado.toLocaleString('pt-AO', { minimumFractionDigits: 2 })}`,
    info: `${transacoes} transações`,
    percentage: `${crescimento.toFixed(2)}%`,
    icon: 'fas fa-file-invoice-dollar',
    style: styleFacturado
  };

  const totalFacturadoRecibo = facturasRecibo.reduce((soma, doc) => soma + (doc.total || 0), 0);
  const transacoesRecibo = facturasRecibo.length;
  const totalAnteriorRecibo = 50000;
  const crescimentoRecibo = totalAnteriorRecibo > 0
    ? ((totalFacturadoRecibo - totalAnteriorRecibo) / totalAnteriorRecibo) * 100
    : 0;

  let styleRecibo = '';
  if (crescimentoRecibo > 5) {
    styleRecibo = 'positivo';
  } else if (crescimentoRecibo < -5) {
    styleRecibo = 'negativo';
  } else {
    styleRecibo = 'warning';
  }

  this.cards[2] = {
    title: 'Recibos',
    value: `Kz ${totalFacturadoRecibo.toLocaleString('pt-AO', { minimumFractionDigits: 2 })}`,
    info: `${transacoesRecibo} emitidos`,
    percentage: `${crescimentoRecibo.toFixed(2)}%`,
    icon: 'fas fa-receipt',
    style: styleRecibo
  };
}

  filtrar() {
    this.DadosDocumentos = this.documentosOriginais.filter(doc => {
      const ano = new Date(doc.dataEmissao).getFullYear();
      const mes = new Date(doc.dataEmissao).getMonth() + 1;
      const tipo = doc.tipo;
      const categoria = doc.categoria;
      const nomeCliente = doc.cliente?.nome?.toLowerCase() || '';
      const criadoPor = doc.criadoPor?.toLowerCase() || '';
      const termo = this.searchTerm.toLowerCase();

      const correspondeBusca = !this.searchTerm ||
        nomeCliente.includes(termo) ||
        criadoPor.includes(termo) ||
        tipo.toLowerCase().includes(termo);

      return (!this.filtro.ano || ano === +this.filtro.ano) &&
             (!this.filtro.mes || mes === +this.filtro.mes) &&
             (!this.filtro.tipo || tipo === this.filtro.tipo) &&
             (!this.filtro.Categorias || categoria === this.filtro.Categorias) &&
             correspondeBusca;
    });

    this.atualizarEstatisticas(this.DadosDocumentos);
    this.atualizarTotalPages();
    this.currentPage = 1; // Resetar página ao filtrar
  }



  changePage(page: number) {
    if (page < 1 || page > this.totalPages) {
      return;
    }
    this.currentPage = page;
  }

atualizarTotalPages() {
  this.totalPages = Math.ceil(this.DadosDocumentos.length / this.itemsPerPage) || 1;
}

previousPage() {
  if (this.currentPage > 1) {
    this.currentPage--;
  }
}

nextPage() {
  if (this.currentPage < this.totalPages) {
    this.currentPage++;
  }
}

goToPage(page: number) {
  if (page >= 1 && page <= this.totalPages) {
    this.currentPage = page;
  }
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

  getTipoLabel(tipo: string): string {
    switch (tipo) {
      case 'FACTURA': return 'Factura';
      case 'FACTURA_RECIBO': return 'Factura Recibo';
      case 'FACTURA_PROFORMA': return 'Factura Proforma';
      default: return tipo;
    }
  }

isPositive(percentage: string): boolean {
  if (!percentage) return true;
  const clean = percentage.replace('%', '').replace(',', '.').trim();
  const value = parseFloat(clean);
  return !isNaN(value) && value >= 0;
}

  getPercentage(percent: string): string {
    return percent.replace(',', '.');
  }

  getPrimeiroEUltimoNome(nomeCompleto: string): string {
  const nomes = nomeCompleto.trim().split(/\s+/);
  if (nomes.length === 1) return nomes[0];
  return `${nomes[0]} ${nomes[nomes.length - 1]}`;
}

}
