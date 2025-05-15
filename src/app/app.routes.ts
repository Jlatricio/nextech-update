import { Routes } from '@angular/router';
import { AuthGuard } from './guards/auth.guard';  // Importe o AuthGuard
import { LoginGuard } from './guards/login.guard';

export const routes: Routes = [
  {
    path: 'login',
    loadComponent: () => import('./features/login/login.component').then(m => m.LoginComponent),
    canActivate: [LoginGuard]  // Protege a rota de login
  },
  {
    path: 'inicio',
    loadComponent: () => import('./features/inicio/inicio.component').then(m => m.InicioComponent),
    canActivate: [AuthGuard]  // Protege a rota de inicio
  },
  {
    path: 'artigo',
    loadComponent: () => import('./features/artigo/components/artigo/artigo.component').then(m => m.ArtigoComponent),
    canActivate: [AuthGuard]  // Protege a rota de artigo
  },
  {
    path: 'cliente',
    loadComponent: () => import('./features/clientes/components/cliente/cliente.component').then(m => m.ClienteComponent),
    canActivate: [AuthGuard]  // Protege a rota de cliente
  },
  {
    path: 'documento',
    loadComponent: () => import('./features/documento/components/documento/documento.component').then(m => m.DocumentosComponent),
    canActivate: [AuthGuard]  // Protege a rota de documento
  },
  {
    path: 'factura',
    loadComponent: () => import('./features/documento/components/factura/factura.component').then(m => m.FacturaComponent),
    canActivate: [AuthGuard]  // Protege a rota de factura
  },
  {
    path: 'proforma',
    loadComponent: () => import('./features/documento/components/proforma/proforma.component').then(m => m.ProformaComponent),
    canActivate: [AuthGuard]  // Protege a rota de proforma
  },
  {
    path: 'factura-recibo',
    loadComponent: () => import('./features/documento/components/fatura-recibo/fatura-recibo.component').then(m => m.FaturaReciboComponent),
    canActivate: [AuthGuard]  // Protege a rota de fatura-recibo
  },
  {
    path: 'relatorio',
    loadComponent: () => import('./features/relatorio/relatorios.component').then(m => m.RelatoriosComponent),
    canActivate: [AuthGuard]  // Protege a rota de relatorio
  },
  {
    path: 'usuario',
    loadComponent: () => import('./features/usuario/components/usuario/usuario.component').then(m => m.UsuariosComponent),
    canActivate: [AuthGuard]  // Protege a rota de usuario
  },
  {
    path: 'despesa',
    loadComponent: () => import('./features/despesas/components/despesa/despesa.component').then(m => m.DespesaComponent),
    canActivate: [AuthGuard]  // Protege a rota de despesa
  },
  {
    path: 'fornecedor',
    loadComponent: () => import('./features/fornecedor/component/fornecedor/fornecedor.component').then(m => m.FornecedoresComponent),
    canActivate: [AuthGuard]  // Protege a rota de fornecedor
  },
  {
    path: 'configuracao',
    loadComponent: () => import('./features/configuracao/configuracao.component').then(m => m.ConfiguracaoComponent),
    canActivate: [AuthGuard]  // Protege a rota de configuracao
  },
  {
    path: '**',
    redirectTo: 'inicio'
  }
];
