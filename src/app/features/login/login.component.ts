import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { AuthService } from './Auth/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss'
})
export class LoginComponent {
  email: string = '';
  senha: string = '';

  constructor(private authService: AuthService, private router: Router) {}

  login() {
    const credenciais = {
      email: this.email,
      senha: this.senha
    };

    this.authService.login(credenciais).subscribe({
      next: () => {
        this.router.navigate(['/admin-dashboard']); // ou outra rota protegida
      },
      error: (err) => {
        console.error('Erro de login:', err);
        alert('Email ou senha inválidos');
      }
    });
  }
}
