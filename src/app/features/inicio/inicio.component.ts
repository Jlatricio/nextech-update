import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { TitleService } from '../../core/services/title.service';
import { RouterModule } from '@angular/router';
import { DocumentoService } from '../documento/service/documento.service';
import { BsDropdownModule } from 'ngx-bootstrap/dropdown';
import { DadosDocumento } from '../documento/interface/dadosdocumentos';
import { FaturaService } from '../documento/components/factura/service/fatura.service';
import { DespesaService } from '../despesas/service/despesa.service';

@Component({
  selector: 'app-inicio',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule, BsDropdownModule],
  templateUrl: './inicio.component.html',
  styleUrls: ['./inicio.component.scss'],
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
    private FaturaService: FaturaService,
    private DespesaService: DespesaService
  ) {}

ngOnInit(): void {
  this.titleService.setTitle('Dashboard');
this.DocumentoService.listarDocumentos().subscribe({
  next: (documentos: DadosDocumento[]) => {
    console.log('Documentos recebidos:', documentos);
    const documentosFiltrados = documentos.filter(doc =>
      !(doc.tipo === 'FACTURA' && doc.anulado === true)
    );

    this.documentosOriginais = documentosFiltrados;
    this.DadosDocumentos = documentosFiltrados;
    this.atualizarEstatisticas(documentosFiltrados);
    this.inicializarFiltros(documentosFiltrados);
    this.atualizarTotalPages();
  },
  error: (err) => {
    console.error('Erro ao listar documentos:', err);
  }
});

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

  cardsGerais: any[] = [];
  cardsFiltrados: any[] = [];

  atualizarEstatisticas(documentos: DadosDocumento[], contexto: 'geral' | 'filtrado' = 'geral'): void {
    const facturas = documentos.filter(doc => doc.tipo === 'FACTURA');
    const facturasRecibo = documentos.filter(doc => doc.tipo === 'FACTURA_RECIBO');
    const reembolso = documentos.filter(doc => doc.tipo === "NOTA_CREDITO" && doc.motivo === 'ANULAÇÃO');

    const facturasValidas = facturas.filter(doc => !doc.anulado);
    const totalFacturado = facturasValidas.reduce((soma, doc) => soma + (doc.total || 0), 0);
    const transacoes = facturasValidas.length;
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

    const cardsTemp: any[] = [
      {
        title: 'Facturado',
        value: `Kz ${totalFacturado.toLocaleString('pt-AO', { minimumFractionDigits: 2 })}`,
        info: `${transacoes} transações`,
        percentage: `${crescimento.toFixed(2)}%`,
        icon: 'fas fa-file-invoice-dollar',
        style: styleFacturado
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

    // Recibos
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

    cardsTemp[2] = {
      title: 'Recibos',
      value: `Kz ${totalFacturadoRecibo.toLocaleString('pt-AO', { minimumFractionDigits: 2 })}`,
      info: `${transacoesRecibo} emitidos`,
      percentage: `${crescimentoRecibo.toFixed(2)}%`,
      icon: 'fas fa-receipt',
      style: styleRecibo
    };

    // Despesas (async)
    this.DespesaService.listarDespesa().subscribe({
      next: (despesas: any[]) => {
        const totalDespesas = despesas.reduce((soma, despesa) => soma + (despesa.valor || 0), 0);
        const totalRegistos = despesas.length;
        const totalAnteriorDespesas = 50000;
        const crescimentoDespesas = totalAnteriorDespesas > 0
          ? ((totalDespesas - totalAnteriorDespesas) / totalAnteriorDespesas) * 100
          : 0;

        let styleDespesas = '';
        if (crescimentoDespesas > 5) {
          styleDespesas = 'positivo';
        } else if (crescimentoDespesas < -5) {
          styleDespesas = 'negativo';
        } else {
          styleDespesas = 'warning';
        }

        cardsTemp[1] = {
          title: 'Despesas',
          value: `Kz ${totalDespesas.toLocaleString('pt-AO', { minimumFractionDigits: 2 })}`,
          info: `${totalRegistos} registos`,
          percentage: `${crescimentoDespesas.toFixed(2)}%`,
          icon: 'fas fa-money-bill-wave',
          style: styleDespesas
        };

        // Reembolso
        const totalReembolso = reembolso.reduce((soma, doc) => soma + (doc.total || 0), 0);
        const totalPedidos = reembolso.length;
        const totalAnteriorReembolso = 20000;
        const crescimentoReembolso = totalAnteriorReembolso > 0
          ? ((totalReembolso - totalAnteriorReembolso) / totalAnteriorReembolso) * 100
          : 0;

        let styleReembolso = '';
        if (crescimentoReembolso > 5) {
          styleReembolso = 'positivo';
        } else if (crescimentoReembolso < -5) {
          styleReembolso = 'negativo';
        } else {
          styleReembolso = 'warning';
        }

        cardsTemp[3] = {
          title: 'Reembolso',
          value: `Kz ${totalReembolso.toLocaleString('pt-AO', { minimumFractionDigits: 2 })}`,
          info: `${totalPedidos} pedidos`,
          percentage: `${crescimentoReembolso.toFixed(2)}%`,
          icon: 'fas fa-undo-alt',
          style: styleReembolso
        };

        if (contexto === 'geral') {
          this.cardsGerais = [...cardsTemp];
        } else {
          this.cardsFiltrados = [...cardsTemp];
        }
      },
      error: (err) => {
        console.error('Erro ao listar despesas:', err);
        if (contexto === 'geral') {
          this.cardsGerais = [...cardsTemp];
        } else {
          this.cardsFiltrados = [...cardsTemp];
        }
      }
    });

    // Atualiza cards imediatamente (sem despesas)
    if (contexto === 'geral') {
      this.cardsGerais = [...cardsTemp];
    } else {
      this.cardsFiltrados = [...cardsTemp];
    }
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

   this.atualizarEstatisticas(this.documentosOriginais, 'geral');
this.atualizarEstatisticas(this.DadosDocumentos, 'filtrado');

    this.atualizarTotalPages();
    this.currentPage = 1;
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
      case 'NOTA_CREDITO': return 'tipo-nota-credito';
      default: return '';
    }
  }

  getTipoLabel(tipo: string): string {
    switch (tipo) {
      case 'FACTURA': return 'Factura';
      case 'FACTURA_RECIBO': return 'Factura Recibo';
      case 'FACTURA_PROFORMA': return 'Factura Proforma';
       case 'NOTA_CREDITO': return 'Nota de credito';
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
