import { Proforma } from './../proforma/interface/proforma';
import { CommonModule } from '@angular/common';
import { AfterViewInit, Component, ElementRef, QueryList, ViewChildren } from '@angular/core';
import { Router, RouterModule, ActivatedRoute } from '@angular/router';
import { TitleService } from '../../../../core/services/title.service';
import { ProformaService } from '../proforma/service/proforma.service';
import { DadosDocumento } from '../../interface/dadosdocumentos';
import { Dropdown, Modal } from 'bootstrap';
import { FaturaService } from '../factura/service/fatura.service';
import { factura } from '../factura/interface/factura';
import { FacturaRecibo } from '../fatura-recibo/interface/facturarecibo';
import { FacturareciboService } from '../fatura-recibo/service/facturarecibo.service';
import { forkJoin } from 'rxjs';
import { FormGroup } from '@angular/forms';


@Component({
  selector: 'app-documentos',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './documento.component.html',
  styleUrls: ['./documento.component.scss'],
})
export class DocumentosComponent implements AfterViewInit {

  DadosDocumentos: DadosDocumento[] = [];
  desativarBotoes = true;
  dropdownInstance: Dropdown | null = null;
  modalInstance: Modal | null = null;
  aba: 'facturas' | 'proformas' | 'fr' = 'facturas';
  documentoSelecionadoId: number | null = null;
  facturas: factura[] = [];
  proformas: Proforma[] = [];
  facturasRecibo: FacturaRecibo[] = [];
form!: FormGroup;

  constructor(
    private router: Router,
    private titleService: TitleService,
    private ProformaService: ProformaService,
    private FaturaService: FaturaService,
    private FacturaReciboService: FacturareciboService,
    private route: ActivatedRoute,
  ) {}

  tipoDocumentoSelecionado(): string {
  switch (this.aba) {
    case 'facturas': return 'FACTURA';
    case 'proformas': return 'FACTURA_PROFORMA';
    case 'fr': return 'FACTURA_RECIBO';
    default: return '';
  }
}

  ngOnInit(): void {
     this.carregarDocumentos();
    this.listarProformas();
    this.titleService.setTitle('Documentos');

    const id = this.route.snapshot.paramMap.get('id');
    console.log('ID recebido:', id);

    if (id) {
      switch (this.tipoDocumentoSelecionado()) {
        case 'FACTURA_PROFORMA':
          this.ProformaService.visualizarProforma(+id).subscribe((proforma) => {
            this.form.patchValue(proforma);
          });
          break;
        case 'FACTURA':
          this.FaturaService.visualizarFactura(+id).subscribe((factura) => {
            this.form.patchValue(factura);
          });
          break;
        case 'FACTURA_RECIBO':
          this.FacturaReciboService.visualizarFaturaRecibo(+id).subscribe((facturaRecibo) => {
            this.form.patchValue(facturaRecibo);
          });
          break;
      }
    }


    this.FaturaService.listarFacturas().subscribe({
      next: (facturas) => {
      this.facturas = facturas;
      this.DadosDocumentos = [...this.DadosDocumentos, ...facturas];
      },
      error: (err) => {
      console.error('Erro ao listar facturas:', err);
      }
    });

    this.ProformaService.listarProformas().subscribe({
      next: (proformas) => {
      this.proformas = proformas;
      this.DadosDocumentos = [...this.DadosDocumentos, ...proformas];
      },
      error: (err) => {
      console.error('Erro ao listar proformas:', err);
      }
    });

    this.FacturaReciboService.listarFaturaRecibos().subscribe({
      next: (facturasRecibo) => {
      this.facturasRecibo = facturasRecibo;
      this.DadosDocumentos = [...this.DadosDocumentos, ...facturasRecibo];
      },
      error: (err) => {
      console.error('Erro ao listar facturas recibo:', err);
      }
    });
  }

  carregarDocumentos() {
  forkJoin({
    facturas: this.FaturaService.listarFacturas(),
    proformas: this.ProformaService.listarProformas(),
    facturasRecibo: this.FacturaReciboService.listarFaturaRecibos()
  }).subscribe({
    next: ({ facturas, proformas, facturasRecibo }) => {
      this.facturas = facturas;
      this.proformas = proformas;
      this.facturasRecibo = facturasRecibo;
      this.DadosDocumentos = [...facturas, ...proformas, ...facturasRecibo];
    },
    error: (err) => {
      console.error('Erro ao carregar documentos:', err);
    }
  });
}

listarFacturas() {
  this.FaturaService.listarFacturas().subscribe({
    next: (facturas) => {
      this.facturas = facturas;
      this.DadosDocumentos = [...this.DadosDocumentos, ...facturas];
    },
    error: (err) => {
      console.error('Erro ao listar facturas:', err);
    }
  });
}

listarProformas() {
  this.ProformaService.listarProformas().subscribe({
    next: (proformas) => {
      this.proformas = proformas;
      this.DadosDocumentos = [...this.DadosDocumentos, ...proformas];
    },
    error: (err) => {
      console.error('Erro ao listar proformas:', err);
    }
  });
}

  listarFacturasRecibo() {
    this.FacturaReciboService.listarFaturaRecibos().subscribe({
      next: (facturasRecibo) => {
        this.facturasRecibo = facturasRecibo;
        this.DadosDocumentos = [...this.DadosDocumentos, ...facturasRecibo];
      },
      error: (err) => {
        console.error('Erro ao listar facturas recibo:', err);
      }
    });
  }


  ngAfterViewInit() {
    // Inicializa o modal Bootstrap
    const modalEl = document.getElementById('modalAcoes');
    if (modalEl) {
      this.modalInstance = new Modal(modalEl);
    }

  setTimeout(() => this.updateIndicator(), 0);
  }

  openModal(id: number) {
    this.documentoSelecionadoId = id;
    if (this.modalInstance) {
      this.modalInstance.show();
    }
  }

  acaoAnular(id: number) {
  console.log('Anulação acionada para o documento com ID:', id);
  // lógica da anulação
  this.modalInstance?.hide();
}

acaoRectificar(id: number) {
  console.log('Retificação acionada para o documento com ID:', id);

  let rota = '';
  switch (this.aba) {
    case 'facturas':
     rota = 'factura/' + id;
      break;
    case 'proformas':
      rota = 'proforma/' + id;


      break;
    case 'fr':
      rota = 'factura-recibo/' + id;
      break;
  }

  this.modalInstance?.hide();
  // Remova as barras extras se já estiver usando rota relativa
  this.router.navigate([rota], { relativeTo: this.route });
}




acaoDownload(id: number) {
  this.router.navigate(['/visualizar', id]);
  this.modalInstance?.hide();
}


@ViewChildren('tab', { read: ElementRef }) tabs!: QueryList<ElementRef>;

indicatorLeft = '0px';
indicatorWidth = '0px';




selecionarAba(aba: 'facturas' | 'proformas' | 'fr', event: Event) {
  this.aba = aba;

  // Aguarda DOM atualizar para então calcular posição do background
  setTimeout(() => this.updateIndicator(), 0);
}


updateIndicator() {
  const activeIndex = ['proformas', 'facturas', 'fr'].indexOf(this.aba);
  const tabElements = this.tabs.toArray();
  const activeTab = tabElements[activeIndex]?.nativeElement;

  if (activeTab) {
    const parentRect = activeTab.parentElement.getBoundingClientRect();
    const rect = activeTab.getBoundingClientRect();
    this.indicatorLeft = `${rect.left - parentRect.left}px`;
    this.indicatorWidth = `${rect.width}px`;
  }

}




}
