import { Component, Inject, OnInit, PLATFORM_ID } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { Usuario } from '../../../features/usuario/components/interface/usuario';
import { CommonModule, isPlatformBrowser } from '@angular/common';
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
export class HeaderComponent implements OnInit {
 nomeUsuario = '';


  constructor(
    @Inject(PLATFORM_ID) private platformId: Object,
    private router: Router,

  ) {}

  ngOnInit(): void {
      if (isPlatformBrowser(this.platformId)) {
const token = localStorage.getItem('token');
    if (token) {
      const decoded: any = jwtDecode(token);
      this.nomeUsuario = decoded.nome;
      console.log('Perfil de usuário:', this.nomeUsuario);
    }
  }
}







  logout(): void {
    Swal.fire({
      title: 'Saindo...',
      didOpen: () => {
        Swal.showLoading();
      },
      allowOutsideClick: false,
      showConfirmButton: false,
      timer: 1000
    }).then(() => {
      localStorage.removeItem('token');

      Swal.fire({
        icon: 'success',
        title: 'Logout realizado',
        text: 'Você foi desconectado com sucesso.',
        timer: 2000,
        showConfirmButton: false,
        allowOutsideClick: false
      }).then(() => {
        this.router.navigate(['/login']);
      });
    });
  }
}
