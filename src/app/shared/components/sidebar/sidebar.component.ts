import { CommonModule, isPlatformBrowser } from '@angular/common';
import { Component, Inject, OnInit, PLATFORM_ID } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { jwtDecode } from 'jwt-decode';

@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './sidebar.component.html',
  styleUrl: './sidebar.component.scss',
})
export class SidebarComponent implements OnInit {
  perfilUsuario = '';

  constructor(@Inject(PLATFORM_ID) private platformId: Object,
    private router: Router) {}

  ngOnInit(): void {
    if (isPlatformBrowser(this.platformId)) {
    const token = localStorage.getItem('token');
    if (token) {
      const decoded: any = jwtDecode(token);
      this.perfilUsuario = decoded.perfil;
      console.log('Perfil de usuário:', this.perfilUsuario);
    }
  }
  }
  get menus() {
    const todos = [
      { route: '/inicio', name: 'Início', icon: 'bi bi-columns-gap', activeIcon: 'bi bi-columns-gap', title: 'Início' },
      { route: '/artigo', name: 'Artigos', icon: 'bi bi-grid-3x3-gap-fill', activeIcon: 'bi bi-grid-3x3-gap-fill', title: 'Artigos' },
      { route: '/despesa', name: 'Despesas', icon: 'bi bi-wallet2', activeIcon: 'bi bi-wallet2', title: 'Despesas' },
      { route: '/cliente', name: 'Clientes', icon: 'bi bi-people', activeIcon: 'bi bi-people', title: 'Clientes' },
      { route: '/documento', name: 'Documentos', icon: 'bi bi-file-text-fill', activeIcon: 'bi bi-file-text-fill', title: 'Documentos' },
      { route: '/fornecedor', name: 'Fornecedores', icon: 'bi bi-truck', activeIcon: 'bi bi-truck', title: 'Fornecedores' },
      { route: '/relatorio', name: 'Relatórios', icon: 'bi bi-bar-chart-line', activeIcon: 'bi bi-bar-chart-line', title: 'Relatórios' },
      { route: '/usuario', name: 'Usuários', icon: 'bi bi-people-fill', activeIcon: 'bi bi-people-fill', title: 'Usuários' },
      { route: '/configuracao', name: 'Configurações', icon: 'bi bi-gear-fill', activeIcon: 'bi bi-gear-fill', title: 'Configurações' }
    ];

    if (this.perfilUsuario === 'VENDEDOR') {
      return todos.filter(menu => ![
        '/artigo',
        '/despesa',
        '/fornecedor',
        '/relatorio',
        '/usuario',
        '/configuracao'
      ].includes(menu.route));
    }

    return todos;
  }

  get hasActiveMenu(): boolean {
    return this.menus.some(menu => this.isActive(menu.route));
  }

  isActive(route: string): boolean {
    return this.router.url === route;
  }
}
