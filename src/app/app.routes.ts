import { Routes } from '@angular/router';
import { AuthGuard } from './guards/auth.guard';
import { LoginGuard } from './guards/login.guard';
import { RoleGuard } from './guards/role-guard.guard';

export const routes: Routes = [
  {
    path: 'login',
    loadComponent: () => import('./features/login/login.component').then(m => m.LoginComponent),
    canActivate: [LoginGuard]
  },
  {
    path: 'inicio',
    loadComponent: () => import('./features/inicio/inicio.component').then(m => m.InicioComponent),
    canActivate: [AuthGuard]
  },
  {
    path: 'artigo',
    loadComponent: () => import('./features/artigo/components/artigo/artigo.component').then(m => m.ArtigoComponent),
    canActivate: [AuthGuard, RoleGuard],
    data: { allowedRoles: ['ADMIN'] }
  },
  {
    path: 'cliente',
    loadComponent: () => import('./features/clientes/components/cliente/cliente.component').then(m => m.ClienteComponent),
    canActivate: [AuthGuard]
  },
  {
    path: 'documento',
    loadComponent: () => import('./features/documento/components/documento/documento.component').then(m => m.DocumentosComponent),
    canActivate: [AuthGuard]
  },
  {
    path: 'factura/:numero',
    loadComponent: () => import('./features/documento/components/factura/factura.component').then(m => m.FacturaComponent),
    canActivate: [AuthGuard]
  },
  {
    path: 'proforma/:numero',
    loadComponent: () => import('./features/documento/components/proforma/proforma.component').then(m => m.ProformaComponent),
    canActivate: [AuthGuard]
  },
  {
    path: 'factura-recibo/:numero',
    loadComponent: () => import('./features/documento/components/fatura-recibo/fatura-recibo.component').then(m => m.FaturaReciboComponent),
    canActivate: [AuthGuard]
  },
  {
    path: 'relatorio',
    loadComponent: () => import('./features/relatorio/relatorios.component').then(m => m.RelatoriosComponent),
    canActivate: [AuthGuard, RoleGuard],
    data: { allowedRoles: ['ADMIN'] }
  },
  {
    path: 'usuario',
    loadComponent: () => import('./features/usuario/components/usuario/usuario.component').then(m => m.UsuariosComponent),
    canActivate: [AuthGuard, RoleGuard],
    data: { allowedRoles: ['ADMIN'] }
  },
  {
    path: 'despesa',
    loadComponent: () => import('./features/despesas/components/despesa/despesa.component').then(m => m.DespesaComponent),
    canActivate: [AuthGuard, RoleGuard],
    data: { allowedRoles: ['ADMIN'] }
  },
  {
    path: 'fornecedor',
    loadComponent: () => import('./features/fornecedor/component/fornecedor/fornecedor.component').then(m => m.FornecedoresComponent),
    canActivate: [AuthGuard, RoleGuard],
    data: { allowedRoles: ['ADMIN'] }
  },
  {
    path: 'configuracao',
    loadComponent: () => import('./features/configuracao/configuracao.component').then(m => m.ConfiguracaoComponent),
    canActivate: [AuthGuard, RoleGuard],
    data: { allowedRoles: ['ADMIN'] }
  },
  {
    path: 'visualizar/:id',
    loadComponent: () => import('./features/documento/components/visualizar/visualizar.component').then(m => m.VisualizarComponent),
    canActivate: [AuthGuard]
  },
  {
    path: '',
    loadComponent: () => import('./shared/startup-component/startup-component.component').then(m => m.StartupComponentComponent)
  },
  {
    path: '**',
    redirectTo: 'inicio'
  }
];
