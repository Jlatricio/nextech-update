import { CommonModule } from '@angular/common';
import { Component} from '@angular/core';
import { ActivatedRoute, Router, RouterModule} from '@angular/router';

@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './sidebar.component.html',
  styleUrl: './sidebar.component.scss',
})
export class SidebarComponent {

  constructor(private route: ActivatedRoute, private router: Router) {}

 menus: { route: string; name: string; icon: string; activeIcon: string }[] = [
  {
    route: '/inicio',
    name: 'Início',
    icon: 'bi bi-columns-gap',
    activeIcon: 'bi bi-columns-gap',
  },
  {
    route: '/artigo',
    name: 'Artigos',
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
    name: 'Clientes',
    icon: 'bi bi-people',
    activeIcon: 'bi bi-people',
  },
  {
    route: '/documento',
    name: 'Documentos',
    icon: 'bi bi-file-text-fill',
    activeIcon: 'bi bi-file-text-fill',
  },
  {
    route: '/fornecedor',
    name: 'Fornecedores',
    icon: 'bi bi-truck',
    activeIcon: 'bi bi-truck',
  },
  {
    route: '/relatorio',
    name: 'Relatórios',
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
    name: 'Configurações',
    icon: 'bi bi-gear-fill',
    activeIcon: 'bi bi-gear-fill',
  }
];


  isActive(route: string): boolean {
    return this.router.url === route;
  }

   logout(): void {
    localStorage.removeItem('token');
    this.router.navigate(['/login']);
  }

}
