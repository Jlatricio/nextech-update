import { Component, ElementRef, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { TitleService } from '../../../../core/services/title.service';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-fatura-recibo',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './fatura-recibo.component.html',
  styleUrls: ['./fatura-recibo.component.scss'] // corrigido plural
})
export class FaturaReciboComponent {
  constructor(private router: Router, private titleService: TitleService) {}

  ngOnInit(): void {
    this.titleService.setTitle('Criar uma fatura/recibo');
  }
 
}
