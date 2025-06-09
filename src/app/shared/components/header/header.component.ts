import { Component } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { Usuario } from '../../../features/usuario/interface/usuario';
import { CommonModule } from '@angular/common';
import { UsuarioService } from '../../../features/usuario/service/usuario.service';
import { jwtDecode } from 'jwt-decode';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './header.component.html',
  styleUrl: './header.component.scss',
})
export class HeaderComponent {
  usuarios: Usuario[] = [];
  nome = '';
  usuarioLogadoId: number | null = null;

  constructor(private router: Router,
              private usuarioService: UsuarioService) {}

  ngOnInit(): void {
    this.listarUsuarios();

      this.usuarioLogadoId = this.getUsuarioIdFromToken();

    if (this.usuarioLogadoId) {
      this.obterNomeUsuario(this.usuarioLogadoId);
    } else {
      console.warn('Usuário logado não identificado. Faça login.');
      // this.router.navigate(['/login']);
    }
  }

  listarUsuarios(): void {
    this.usuarioService.listaUsuario().subscribe({
      next: (res) => this.usuarios = res,
      error: (err) => console.error('Erro ao listar usuários', err)
    });
  }

    getUsuarioIdFromToken(): number | null {
    const token = localStorage.getItem('token');
    if (!token) return null;

    try {
      const decoded: any = jwtDecode(token);
      return decoded.id || decoded.userId || null; // depende do nome do campo no token
    } catch (error) {
      console.error('Erro ao decodificar token:', error);
      return null;
    }
  }

  obterNomeUsuario(id: number): void {
    this.usuarioService.obterUsuarioPorId(id).subscribe({
      next: (usuario) => {
        this.nome = usuario.nome;
      },
      error: (err) => {
        console.error('Erro ao obter nome do usuário', err);
      }
    });
  }
}
