import { Component } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { Usuario } from '../../../features/usuario/interface/usuario';
import { CommonModule } from '@angular/common';
import { UsuarioService } from '../../../features/usuario/service/usuario.service';
import { jwtDecode } from 'jwt-decode';
import Swal from 'sweetalert2';
import { HeaderService } from './service/header.service';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './header.component.html',
  styleUrl: './header.component.scss',
})
export class HeaderComponent {
  usuario: Usuario[] = [];

  constructor(
    private router: Router,
    private usuarioService: UsuarioService,
    private headerService: HeaderService
  ) {}

  ngOnInit(): void {
    this.listarUsuarios();
  }

  getUsuarioLogadoId(): number | null {
    const token = localStorage.getItem('token');
    if (token) {
      try {
        const decoded: any = jwtDecode(token);
        return decoded?.id ?? null;
      } catch (e) {
        console.error('Erro ao decodificar o token:', e);
        return null;
      }
    }
    return null;
  }

  listarUsuarios(): void {
    const idLogado = this.getUsuarioLogadoId();

    this.headerService.listaUsuario().subscribe({
      next: (res: Usuario[]) => {
        const usuarioEncontrado = res.find((user) => user.id === idLogado);
        if (usuarioEncontrado) {
          this.usuario = [usuarioEncontrado]; // Armazena como array com 1 item, opcional
        } else {
          console.warn('Usuário logado não encontrado na lista.');
          this.usuario = [];
        }
      },
      error: (err) => {
        console.error('Erro ao listar usuários', err);
        this.usuario = [];
      },
    });
  }

  getNomeUsuario(): string {
    return this.usuario[0]?.nome?.split(' ')[0] ?? '';
  }

  logout(): void {
    Swal.fire({
      title: 'Saindo...',
      didOpen: () => {
        Swal.showLoading();
      },
      allowOutsideClick: false,
      showConfirmButton: false,
      timer: 1000,
    }).then(() => {
      localStorage.removeItem('token');

      Swal.fire({
        icon: 'success',
        title: 'Logout realizado',
        text: 'Você foi desconectado com sucesso.',
        timer: 2000,
        showConfirmButton: false,
        allowOutsideClick: false,
      }).then(() => {
        this.router.navigate(['/login']);
      });
    });
  }
}
