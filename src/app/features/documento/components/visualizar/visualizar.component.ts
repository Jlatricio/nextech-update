import { Component, ElementRef, inject, OnInit, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { TitleService } from '../../../../core/services/title.service';

import {  jsPDF  } from 'jspdf';
import { DocumentoService } from '../../service/documento.service';
import autoTable from 'jspdf-autotable';

@Component({
  selector: 'app-visualizar',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './visualizar.component.html',
  styleUrl: './visualizar.component.scss',
})
export class VisualizarComponent implements OnInit {
  private documentoService = inject(DocumentoService);

  constructor(private router: Router, private titleService: TitleService) {}
 
  ngOnInit(): void {
    this.titleService.setTitle('Visualizar Documento');
  }

  voltar(): void {
    this.router.navigate([
      '../documento/components/documento/documento.component.html',
    ]);
  }


  

  gerarDocumento(id: number) {
    this.documentoService.getTipoDocumento(id).subscribe(response => {
      if (response.tipo === 'fatura') {
        this.gerarFaturaPDF(response.dados);
      } else if (response.tipo === 'performa') {
        this.gerarPerformaPDF(response.dados);
      }
    });
  }

  gerarFaturaPDF(dados: any) {
    
    const doc = new jsPDF();

    // Cores e fontes
    const primaryColor = '#003366';
    const gray = '#666666';

    // Logo (opcional)
    // doc.addImage(logoBase64, 'PNG', 10, 10, 30, 30);

    // Cabeçalho
    doc.setFontSize(14);
    doc.setTextColor('#1a237e'); // Azul escuro
    doc.text('Factura Proforma PP 2025/1', 105, 20, { align: 'center' });

    doc.setFontSize(10);
    doc.setTextColor('#d84315'); // Laranja
    doc.text('Este documento não serve de Factura', 105, 26, {
      align: 'center',
    });

    // Dados do cliente
    doc.setTextColor('#000000');
    doc.setFontSize(10);
    doc.text('Exmo (s) Senhor (es): swa', 10, 40, { align: 'center' });
    doc.text('NIF: Consumidor Final', 10, 46, { align: 'center' });
    doc.text('+244 948732289', 10, 52, { align: 'center' });
    doc.text('divaldo@outlook.com', 10, 58, { align: 'center' });
    doc.text('Bairro Popular', 10, 64, { align: 'center' });

    // Dados do lado direito
    doc.text('DATA DE EMISSÃO: 15-05-2025', 140, 40);
    doc.text('DATA DE EXP: 22-05-2025', 140, 46);
    doc.text('VENDEDOR: Admin', 140, 52);

    // Tabela de produtos
    autoTable(doc, {
      startY: 75,
      head: [
        [
          'REF',
          'DESCRIÇÃO',
          'QTD',
          'PR. UNITÁRIO',
          'DSC. %',
          'TAXA %',
          'TOTAL',
        ],
      ],
      body: [
        [
          '#cs',
          'cadeira\n(Ajuste Simplificado)',
          '1',
          '45 556.66',
          '00.00',
          '00.00',
          '45 556.66',
        ],
      ],
      styles: {
        fontSize: 10,
        cellPadding: 4,
        valign: 'middle',
        textColor: '#212121',
      },
      headStyles: {
        fillColor: [26, 35, 126], // Azul escuro
        textColor: [255, 255, 255],
        fontStyle: 'bold',
      },
      alternateRowStyles: {
        fillColor: [240, 240, 240], // Cinza claro nas linhas alternadas
      },
    });

    // Total
    const finalY = (doc as any).lastAutoTable.finalY + 10;
    doc.setFontSize(14);
    doc.setTextColor(primaryColor);
    doc.text('Total: R$ 1.350,00', 150, finalY, { align: 'right' });
   
     // Observações finais
     doc.setTextColor('#d84315');
     doc.setFontSize(9);
     doc.text(
       'Documento emitido para fins de Formação ou Testes. Não tem validade fiscal',
       105,
       285,
       { align: 'center' }
     );
 
     doc.setTextColor('#000');
     doc.setFontSize(8);
     doc.text('1 de 1', 200, 292, { align: 'right' });
     
     doc.save('fatura-pro-formatada.pdf');

  }

  // Fatura Performa
  gerarPerformaPDF(dados: any) {
    const doc = new jsPDF();
    doc.text('Fatura Proforma', 10, 10);
    doc.text(`Cliente: ${dados.cliente}`, 10, 20);
    doc.text(`Serviço: ${dados.servico}`, 10, 30);
    doc.output('dataurlnewwindow');
  }
}
