import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: 'login',
    loadComponent: () => import('./features/login/login.component').then(m => m.LoginComponent)
  },
  {
    path: 'inicio',
    loadComponent: () => import('./features/inicio/inicio.component').then(m => m.InicioComponent)
  },
  {
    path: 'artigo',
    loadComponent: () => import('./features/artigo/components/artigo/artigo.component').then(m => m.ArtigoComponent)
  },
  {
    path: 'cliente',
    loadComponent: () => import('./features/clientes/components/cliente/cliente.component').then(m => m.ClienteComponent)
  },
  {
    path: 'documento',
    loadComponent: () => import('./features/documento/documentos.component').then(m => m.DocumentosComponent)
  },
  {
    path: 'fornecedor',
    loadComponent: () => import('./features/fornecedor/fornecedores.component').then(m => m.FornecedoresComponent)
  },
  {
    path: 'relatorio',
    loadComponent: () => import('./features/relatorio/relatorios.component').then(m => m.RelatoriosComponent)
  },
  {
    path: 'usuario',
    loadComponent: () => import('./features/usuario/usuarios.component').then(m => m.UsuariosComponent)
  },
  {
    path: 'despesa',
    loadComponent: () => import('./features/despesas/components/despesa/despesa.component').then(m => m.DespesaComponent)
  },
  {
    path: 'configuracao',
    loadComponent: () => import('./features/configuracao/configuracao.component').then(m => m.ConfiguracaoComponent)
  },
  {
    path: '**',
    redirectTo: 'inicio'
  }
];
