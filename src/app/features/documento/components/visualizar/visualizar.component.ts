import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
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
  imports: [CommonModule],
  templateUrl: './visualizar.component.html',
  styleUrls: ['./visualizar.component.scss'],
})
export class VisualizarComponent implements OnInit {
  documento: DadosDocumento | null = null;
  isLoading = false;

  @ViewChild('recibo', { static: false }) reciboElement!: ElementRef;

  constructor(
    private documentoService: DocumentoService,
    private router: Router,
    private titleService: TitleService,
    private route: ActivatedRoute,
    private loadingBar: LoadingBarService
  ) {}

  ngOnInit(): void {
    const id = Number(this.route.snapshot.paramMap.get('id'));
    if (id) {
      this.documentoService.visualizarDocumento(id).subscribe({
        next: (doc) => {
          this.documento = doc;
          this.titleService.setTitle('Visualizar Documento: ' + doc.numero);
        },
        error: (err) => {
          console.error('Erro ao carregar o documento:', err);
        }
      });
    }
  }

  cancelar() {
  this.router.navigate(['/documento']);
}


  private async gerarCanvas(): Promise<HTMLCanvasElement> {
    if (!this.reciboElement || !this.documento) {
      throw new Error('Elemento recibo ou documento não encontrado!');
    }

    const element = this.reciboElement.nativeElement;
    return await html2canvas(element, {
      scale: 2,
      useCORS: true,
      scrollY: -window.scrollY,
      scrollX: -window.scrollX,
      windowWidth: element.scrollWidth,
      windowHeight: element.scrollHeight
    });
  }



  async baixarPDF(): Promise<void> {
    try {
      this.isLoading = true;
      this.loadingBar.start();

      const canvas = await this.gerarCanvas();
      const imgData = canvas.toDataURL('image/png');
      const pdf = new jsPDF('p', 'mm', 'a4');
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = (canvas.height * pdfWidth) / canvas.width;

      pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, pdfHeight);

      const tipo = this.visualizarTipoDocumento(this.documento!.tipo);
      const cliente = this.documento!.cliente.nome;
      const filename = `${tipo} de ${cliente}.pdf`;

      pdf.save(filename);
    } catch (err) {
      console.error(err);
    } finally {
      this.loadingBar.complete();
      this.isLoading = false;
    }
  }

  async imprimirPDF(): Promise<void> {
    try {
      this.isLoading = true;
      this.loadingBar.start();

      const canvas = await this.gerarCanvas();
      const imgData = canvas.toDataURL('image/png');
      const pdf = new jsPDF('p', 'mm', 'a4');
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = (canvas.height * pdfWidth) / canvas.width;

      pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, pdfHeight);

      const blob = pdf.output('blob');
      const blobUrl = URL.createObjectURL(blob);

      const win = window.open('', '_blank');
      if (win) {
        win.document.write(`
          <html>
            <head><title>Imprimir PDF</title></head>
            <body style="margin:0">
              <embed src="${blobUrl}" type="application/pdf" width="100%" height="100%"/>
              <script>
                setTimeout(() => {
                  window.print();
                }, 500);
              </script>
            </body>
          </html>
        `);
        win.document.close();
      } else {
        alert('Popup bloqueado. Permita pop-ups para imprimir o PDF.');
      }
    } catch (err) {
      console.error(err);
    } finally {
      this.loadingBar.complete();
      this.isLoading = false;
    }
  }

  visualizarTipoDocumento(tipo: string): string {
    return tipo.replace(/_/g, ' ').toUpperCase();
  }
}
