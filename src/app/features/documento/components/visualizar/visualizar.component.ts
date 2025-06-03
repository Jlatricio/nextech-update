import { Component, ElementRef, inject, OnInit, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { TitleService } from '../../../../core/services/title.service';

import {  jsPDF  } from 'jspdf';
import { DocumentoService } from '../../service/documento.service';
import html2canvas from 'html2canvas';

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



 @ViewChild('recibo', { static: false }) reciboElement!: ElementRef;

  dados = {
    nome: 'João André',
    endereco: 'Rua das Flores, 123, Luanda, Angola',
    telefone: '+244 912 345 678',
    produto: 'Equipamentos de informática',
    valor: 3800000,
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
        descricao: 'Notebook Dell Inspiron 15',
        qtd: 1,
        preco: 1800000,
        total: 1800000
      },
      {
        ref: '002',
        descricao: 'Mouse sem fio Logitech',
        qtd: 2,
        preco: 400000,
        total: 800000
      },
      {
        ref: '003',
        descricao: 'Teclado mecânico Redragon',
        qtd: 1,
        preco: 1200000,
        total: 1200000
      }
    ]
  };



  gerarPDF() {
    if (!this.reciboElement) {
      console.error('Elemento recibo não encontrado!');
      return;
    }

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
      window.open(url); // Abre o PDF no navegador
    });
  }
}
