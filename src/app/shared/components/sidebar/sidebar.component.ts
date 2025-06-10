import { CommonModule } from '@angular/common';
import { Component} from '@angular/core';
import { ActivatedRoute, Router, RouterModule} from '@angular/router';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './sidebar.component.html',
  styleUrl: './sidebar.component.scss',
})
export class SidebarComponent {
loading: boolean = false;

  constructor( private router: Router) {}

  get hasActiveMenu(): boolean {
  return this.menus.some(menu => this.isActive(menu.route));
}


 menus: { route: string; name: string; icon: string; activeIcon: string; title: string }[] = [
  {
    route: '/inicio',
    name: 'Início',
    icon: 'bi bi-columns-gap',
    activeIcon: 'bi bi-columns-gap',
    title: 'Início'
  },
  {
    route: '/artigo',
    name: 'Artigos',
    icon: 'bi bi-grid-3x3-gap-fill',
    activeIcon: 'bi bi-grid-3x3-gap-fill',
    title: 'Artigos'
  },
  {
    route: '/despesa',
    name: 'Despesas',
    icon: 'bi bi-wallet2',
    activeIcon: 'bi bi-wallet2',
    title: 'Despesas'
  },
  {
    route: '/cliente',
    name: 'Clientes',
    icon: 'bi bi-people',
    activeIcon: 'bi bi-people',
    title: 'Clientes'
  },
  {
    route: '/documento',
    name: 'Documentos',
    icon: 'bi bi-file-text-fill',
    activeIcon: 'bi bi-file-text-fill',
    title: 'Documentos'
  },
  {
    route: '/fornecedor',
    name: 'Fornecedores',
    icon: 'bi bi-truck',
    activeIcon: 'bi bi-truck',
    title: 'Fornecedores'
  },
  {
    route: '/relatorio',
    name: 'Relatórios',
    icon: 'bi bi-bar-chart-line',
    activeIcon: 'bi bi-bar-chart-line',
    title: 'Relatórios'
  },
  {
    route: '/usuario',
    name: 'Usuários',
    icon: 'bi bi-people-fill',
    activeIcon: 'bi bi-people-fill',
    title: 'Usuários'
  },
  {
    route: '/configuracao',
    name: 'Configurações',
    icon: 'bi bi-gear-fill',
    activeIcon: 'bi bi-gear-fill',
    title: 'Configurações'
  }
];



  isActive(route: string): boolean {
    return this.router.url === route;
  }

}
