import { Routes } from '@angular/router';
<<<<<<< HEAD

export const routes: Routes = [];
=======
import { FacturaComponent } from './features/documento/components/factura/factura.component';

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
    loadComponent: () => import('./features/documento/components/documento/documento.component').then(m => m.DocumentosComponent)
  },
  {
    path: 'factura',
    loadComponent: () => import('./features/documento/components/factura/factura.component').then(m => m.FacturaComponent)
  },
  {
    path: 'proforma',
    loadComponent: () => import('./features/documento/components/proforma/proforma.component').then(m => m.ProformaComponent)
  },
  {
    path: 'factura-recibo',
    loadComponent: () => import('./features/documento/components/fatura-recibo/fatura-recibo.component').then(m => m.FaturaReciboComponent)
  },

  {
    path: 'relatorio',
    loadComponent: () => import('./features/relatorio/relatorios.component').then(m => m.RelatoriosComponent)
  },
  {
    path: 'usuario',
    loadComponent: () => import('./features/usuario/components/usuario/usuario.component').then(m => m.UsuariosComponent)
  },
  {
    path: 'despesa',
    loadComponent: () => import('./features/despesas/components/despesa/despesa.component').then(m => m.DespesaComponent)
  },
  {
    path: 'fornecedor',
    loadComponent: () => import('./features/fornecedor/component/fornecedor/fornecedor.component').then(m => m.FornecedoresComponent)
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
>>>>>>> minha-nova-feature
