import { CommonModule } from '@angular/common';
import { AfterViewInit, Component } from '@angular/core';
import { Router, RouterModule, ActivatedRoute } from '@angular/router';
import { TitleService } from '../../../../core/services/title.service';
import { ProformaService } from '../proforma/service/proforma.service';
import { DadosDocumento } from '../../interface/dadosdocumentos';
import { Dropdown, Modal } from 'bootstrap';

@Component({
  selector: 'app-documentos',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './documento.component.html',
  styleUrls: ['./documento.component.scss'],  // Corrigido para styleUrls (plural)
})
export class DocumentosComponent implements AfterViewInit {

  DadosDocumento: DadosDocumento[] = [];
  desativarBotoes = true;
  dropdownInstance: Dropdown | null = null;
  modalInstance: Modal | null = null;
  aba: string = 'proformas';
  documentoSelecionadoId: number | null = null;

  constructor(
    private router: Router,
    private titleService: TitleService,
    private ProformaService: ProformaService,
    private route: ActivatedRoute,
  ) {}

  ngOnInit(): void {
    this.listarProformas();
    this.titleService.setTitle('Documentos');

    const id = this.route.snapshot.paramMap.get('id');
    console.log('ID recebido:', id);
  }

  listarProformas() {
    this.ProformaService.listarProformas().subscribe({
      next: (proformas) => {
        this.DadosDocumento = proformas;
      },
      error: (err) => {
        console.error('Erro ao listar proformas:', err);
      }
    });
  }

  ngAfterViewInit() {
    // Inicializa o modal Bootstrap
    const modalEl = document.getElementById('menuModal');
    if (modalEl) {
      this.modalInstance = new Modal(modalEl, { backdrop: false });
    }


  }

  openModal(id: number) {
    this.documentoSelecionadoId = id;
    if (this.modalInstance) {
      this.modalInstance.show();
    }
  }

  acaoAnular(id: number) {
    console.log('Anulação acionada para o documento com ID:', id);
    // Implementar lógica da anulação aqui
  }

  acaoRectificar(id: number) {
    console.log('Retificação acionada para o documento com ID:', id);
    // Implementar lógica da retificação aqui
  }

  acaoImprimir(id: number) {
    console.log('Impressão acionada para o documento com ID:', id);
    // Implementar lógica de impressão aqui
  }

  acaoDownload(id: number) {
    console.log('Download acionado para o documento com ID:', id);
    this.router.navigate(['/vizualizar', id]);
  }

}
