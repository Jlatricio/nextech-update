import { Component, ElementRef, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { TitleService } from '../../../../core/services/title.service';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-recibo',
  imports: [CommonModule],
  templateUrl: './recibo.component.html',
  styleUrl: './recibo.component.scss'
})
export class ReciboComponent {
  constructor(private router: Router, private titleService: TitleService) {}

  ngOnInit(): void {
    this.titleService.setTitle('Criar um recibo');
  }

   @ViewChild('recibo', { static: false }) reciboElement!: ElementRef;

  dados = {
    nome: 'João André',
    produto: 'iPhone 16 Pro Max',
    valor: 1819000,
    data: new Date().toLocaleDateString('pt-BR', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit'
    }),
     itens: [
    {
      ref: '001',
      descricao: 'Consultoria web',
      qtd: 1,
      preco: 50000,
      total: 50000
    }
  ]
  };

  gerarPDF() {
    const element = this.reciboElement.nativeElement;

    html2canvas(element).then(canvas => {
      const imgData = canvas.toDataURL('image/png');
      const pdf = new jsPDF('p', 'mm', 'a4');
      const imgProps = pdf.getImageProperties(imgData);
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = (imgProps.height * pdfWidth) / imgProps.width;

      pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, pdfHeight);

      const blob = pdf.output('blob');
      const url = URL.createObjectURL(blob);
      window.open(url); // Exibe no navegador
    });
  }
}

