import { CommonModule } from '@angular/common';
import { Component} from '@angular/core';
import { Router, RouterModule} from '@angular/router';

@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './sidebar.component.html',
  styleUrl: './sidebar.component.scss',
})
export class SidebarComponent {

  constructor(private router: Router) {}

  menus: { route: string; name: string; icon: string; activeIcon: string }[] = [
    {
      route: '/inicio',
      name: 'Início',
      icon: 'bi bi-columns-gap',
      activeIcon: 'bi bi-columns-gap',
    },
    {
      route: '/artigo',
      name: 'Artigo',
      icon: 'bi bi-grid-3x3-gap-fill',
      activeIcon: 'bi bi-grid-3x3-gap-fill',
    },
    {
      route: '/despesa',
      name: 'Despesas',
      icon: 'bi bi-wallet2',
      activeIcon: 'bi bi-wallet2',
    },
   
    {
      route: '/cliente',
      name: 'Cliente',
      icon: 'bi bi-people',
      activeIcon: 'bi bi-people',
    },
    {
      route: '/documento',
      name: 'Documento',
      icon: 'bi bi-file-text-fill',
      activeIcon: 'bi bi-file-text-fill',
    },
    {
      route: '/fornecedor',
      name: 'Fornecedor',
      icon: 'bi bi-truck',
      activeIcon: 'bi bi-truck',
    },
    {
      route: '/relatorio',
      name: 'Relatório',
      icon: 'bi bi-bar-chart-line',
      activeIcon: 'bi bi-bar-chart-line',
    },
    {
      route: '/usuario',
      name: 'Usuários',
      icon: 'bi bi-people-fill',
      activeIcon: 'bi bi-people-fill',
    },
    {
      route: '/configuracao',
      name: 'Configuração',
      icon: 'bi bi-gear-fill',
      activeIcon: 'bi bi-gear-fill',
    },
    {
      route: '/sair',
      name: 'Sair',
      icon: 'bi bi-box-arrow-in-left',
      activeIcon: 'bi bi-box-arrow-in-left',
    },
  ];

  isActive(route: string): boolean {
    return this.router.url === route;
  }

}
