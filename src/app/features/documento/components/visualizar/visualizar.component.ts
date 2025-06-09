import { Component, ElementRef, inject, OnInit, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { TitleService } from '../../../../core/services/title.service';

import { jsPDF } from 'jspdf';
import { DocumentoService } from '../../service/documento.service';
import html2canvas from 'html2canvas';
import { DadosDocumento } from '../../interface/dadosdocumentos';
import { LoadingBarService } from '@ngx-loading-bar/core';

@Component({
  selector: 'app-visualizar',
  standalone: true,
  imports: [CommonModule   ],
  templateUrl: './visualizar.component.html',
  styleUrls: ['./visualizar.component.scss'],
})
export class VisualizarComponent implements OnInit {
  documento: DadosDocumento | null = null;
    isLoading = false;

  constructor(
    private documentoService: DocumentoService,
    private router: Router,
    private titleService: TitleService,
    private route: ActivatedRoute,
    private loadingBar: LoadingBarService
  ) {}

  @ViewChild('recibo', { static: false }) reciboElement!: ElementRef;

  ngOnInit(): void {
    const id = Number(this.route.snapshot.paramMap.get('id'));
    if (id) {
      this.documentoService.visualizarDocumento(id).subscribe({
        next: (doc) => {
          this.documento = doc;
          this.titleService.setTitle('Visualizar Documento: ' + doc.numero);
          console.log('Documento carregado:', doc);
        },
        error: (err) => {
          console.error('Erro ao carregar o documento:', err);
        }
      });
    }

   
  }
 gerarPDF() {
    if (!this.reciboElement || !this.documento) {
      console.error('Elemento recibo ou documento não encontrado!');
      return;
    }

    this.isLoading = true;          // ativa estado de loading
    this.loadingBar.start();        // inicia barra de loading

    const element = this.reciboElement.nativeElement;

    html2canvas(element, {
      scale: 2,
      useCORS: true,
      scrollY: -window.scrollY
    }).then(canvas => {
      const imgData = canvas.toDataURL('image/png');
      const pdf = new jsPDF('p', 'mm', 'a4');
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = (canvas.height * pdfWidth) / canvas.width;

      pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, pdfHeight);

      const tipoFormatado = this.visualizarTipoDocumento(this.documento?.tipo ?? '');
      const clienteNome = this.documento?.cliente?.nome ?? 'Cliente';
      const nomeArquivo = `${tipoFormatado} de ${clienteNome}.pdf`;

      const blob = pdf.output('blob');
      const blobUrl = URL.createObjectURL(blob);

      const novaJanela = window.open('', '_blank');
      if (novaJanela) {
        novaJanela.document.write(`
          <html>
            <head>
              <title>${nomeArquivo}</title>
            </head>
            <body style="margin:0;padding:0;height:100vh;display:flex;flex-direction:column">
              <embed src="${blobUrl}#toolbar=1" type="application/pdf" width="100%" height="100%" style="flex:1;border:none;" />
              <div style="padding:10px;text-align:center;font-family:sans-serif;">
                <a href="${blobUrl}" download="${nomeArquivo}" style="text-decoration:none;padding:8px 16px;background:#007bff;color:#fff;border-radius:5px;">⬇ Baixar PDF</a>
              </div>
            </body>
          </html>
        `);
        novaJanela.document.close();
      } else {
        alert('Popup bloqueado pelo navegador. Por favor, permita pop-ups para esta página.');
      }

      this.loadingBar.complete();  // finaliza a barra de loading
      this.isLoading = false;      // desativa estado de loading
    }).catch(() => {
      this.loadingBar.complete();
      this.isLoading = false;
    });
  }


  visualizarTipoDocumento(tipo: string): string {
    return tipo
      .replace(/_/g, ' ')
      .toUpperCase();
  }
}
