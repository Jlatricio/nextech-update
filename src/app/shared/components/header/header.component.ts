import { Component } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { Usuario } from '../../../features/usuario/interface/usuario';
import { CommonModule } from '@angular/common';
import { UsuarioService } from '../../../features/usuario/service/usuario.service';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './header.component.html',
  styleUrl: './header.component.scss',
})
export class HeaderComponent {
  usuarios: Usuario[] = [];

  constructor(private router: Router,
              private usuarioService: UsuarioService) {}

  ngOnInit(): void {
    this.listarUsuarios();

    // Exemplo para pegar a URL atual
    console.log(this.router.url);

    // Se quiser monitorar mudanças de rota
    this.router.events.subscribe(event => {
      // Tratar eventos, por exemplo NavigationEnd
    });
  }

  listarUsuarios(): void {
    this.usuarioService.listaUsuario().subscribe({
      next: (res) => this.usuarios = res,
      error: (err) => console.error('Erro ao listar usuários', err)
    });
  }
}
