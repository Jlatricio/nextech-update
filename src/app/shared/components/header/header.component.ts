import { Component } from '@angular/core';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { usuarioServices } from '../../../features/usuario/service/usuario.service';
import { Usuario } from '../../../features/usuario/interface/usuario';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [RouterModule, CommonModule],
  templateUrl: './header.component.html',
  styleUrl: './header.component.scss',
})
export class HeaderComponent {
   usuarios: Usuario[] = [];

  constructor(private route: ActivatedRoute,
        private usuarioService: usuarioServices,
  ) {}

  ngOnInit(): void {
   this.listarUsuarios();
  }
listarUsuarios(): void {
    this.usuarioService.listaUsuario().subscribe({
      next: (res) => this.usuarios = res,
      error: (err) => console.error('Erro ao listar usuários', err)
    });
  }
}
