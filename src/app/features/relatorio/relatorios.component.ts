import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { NgChartsModule } from 'ng2-charts';
import { ChartConfiguration } from 'chart.js';
import { TitleService } from '../../core/services/title.service';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-relatorios',
  standalone: true,
  templateUrl: './relatorios.component.html',
  styleUrls: ['./relatorios.component.scss'],
  imports: [
    CommonModule,
    FormsModule,
    NgChartsModule,
    RouterModule

  ]
})
export class RelatoriosComponent {
  constructor(private titleService: TitleService){}
  ngOnInit(): void {
    this.titleService.setTitle('Relatórios');
  }
  mesSelecionado = 'Jan';
  meses = ['Jan', 'Fev', 'Mar', 'Abr', 'Mai'];

  vendasLabels: string[] = ['Jan', 'Fev', 'Mar', 'Abr', 'Mai'];
  vendasData: ChartConfiguration<'line'>['data']['datasets'] = [
    {
      data: [0, 100, 200, 150, 300],
      label: 'Vendas',
      fill: true,
      tension: 0.3,
      borderColor: '#3b82f6',
      backgroundColor: 'rgba(59, 130, 246, 0.2)',
      pointBackgroundColor: '#3b82f6',
    }
  ];

  despesasLabels: string[] = ['Jan', 'Fev', 'Mar', 'Abr', 'Mai'];
  despesasData: ChartConfiguration<'bar'>['data']['datasets'] = [
    {
      data: [80, 120, 90, 200, 170],
      label: 'Despesas',
      backgroundColor: '#ef4444',
      borderColor: '#b91c1c',
      borderWidth: 1,
    }
  ];

  graficoOptions: ChartConfiguration['options'] = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: true,
        position: 'top',
      },
    },
    scales: {
      y: {
        beginAtZero: true,
      }
    }
  };
}
