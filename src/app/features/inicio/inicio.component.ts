import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { TitleService } from '../../core/services/title.service';
import { RouterModule } from '@angular/router';

import { BsDropdownModule } from 'ngx-bootstrap/dropdown';


@Component({
  selector: 'app-inicio',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule,  BsDropdownModule],
  templateUrl: './inicio.component.html',
  styleUrl: './inicio.component.scss',
})
export class InicioComponent {
  constructor(private titleService: TitleService) {}

  ngOnInit(): void {
    this.titleService.setTitle('Dashboard');
  }

  

  cards = [
    {
      title: 'Facturado',
      value: 'Kz 0,00',
      info: '8 transações',
      percentage: '0,00%',
      icon: 'fas fa-file-invoice-dollar', // ícone de fatura
      style: ''
    },
    {
      title: 'Despesas',
      value: 'Kz 0,00',
      info: '8 registos',
      percentage: '0,00%',
      icon: 'fas fa-money-bill-wave', // ícone de dinheiro/despesa
      style: 'warning'
    },
    {
      title: 'Recibos',
      value: 'Kz 0,00',
      info: '8 emitidos',
      percentage: '0,00%',
      icon: 'fas fa-receipt', // ícone de recibo
      style: ''
    },
    {
      title: 'Reembolso',
      value: 'Kz 0,00',
      info: '8 pedidos',
      percentage: '0,00%',
      icon: 'fas fa-undo-alt', // ícone de reembolso
      style: 'danger'
    }
  ];

  isPositive(percentage: string): boolean {
  return parseFloat(percentage.replace('%', '').replace(',', '.')) >= 0;
}
getPercentage(percent: string): string {
  return percent.replace(',', '.');
}


  movimentos = [
    {
      ano: 2025,
      mes: 'Abril',
      tipo: 'Despesa',
      numero: '0012',
      entidade: 'Empresa X',
      criadoPor: 'Juvenal',
      data: new Date(),
      valor: 120000,
      documento: '/docs/movimento0012.pdf',
    },

  ];

  filtro = {
    ano: '',
    mes: '',
    tipo: ''
  };

  anos = [2025, 2024, 2023];
  meses = ['Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho', 'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro'];
  tipos = ['Receita', 'Despesa', 'Reembolso'];

  filtrar() {
    console.log('Filtro aplicado:', this.filtro);
  }

  searchTerm: string = '';

filteredCards() {
  if (!this.searchTerm) return this.cards;

  return this.cards.filter(card =>
    card.title.toLowerCase().includes(this.searchTerm.toLowerCase())
  );
}

}
