import { Routes } from '@angular/router';

import { UsuariosComponent } from './features/usuario/usuarios.component';
import { FornecedoresComponent } from './features/fornecedor/fornecedores.component';
import { DocumentosComponent } from './features/documento/documentos.component';
import { RelatoriosComponent } from './features/relatorio/relatorios.component';
import { ConfiguracaoComponent } from './features/configuracao/configuracao.component';

import { InicioComponent } from './features/inicio/inicio.component';
import { ClienteComponent } from './features/clientes/components/cliente/cliente.component';
import { ArtigoComponent } from './features/artigo/components/artigo/artigo.component';
import { DespesaComponent } from './features/despesas/components/despesa/despesa.component';
import { LoginComponent } from './features/login/login.component';

export const routes: Routes = [
  {path: 'login', component: LoginComponent},
  { path: 'inicio', component: InicioComponent },
  { path: 'artigo', component: ArtigoComponent },
  { path: 'cliente', component: ClienteComponent },
  { path: 'documento', component: DocumentosComponent },
  { path: 'fornecedor', component: FornecedoresComponent },
  { path: 'relatorio', component: RelatoriosComponent },
  { path: 'usuario', component: UsuariosComponent },
  {path: 'despesa', component: DespesaComponent},
  { path: 'configuracao', component: ConfiguracaoComponent },
  { path: '**', redirectTo: 'inicio' },
];
