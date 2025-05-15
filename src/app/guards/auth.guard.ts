import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {

  constructor(private router: Router) {}

  canActivate(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): boolean {
    const token = localStorage.getItem('token');

    if (token) {
      // Se já estiver logado e tentar acessar o /login → redireciona para /inicio
      if (state.url === '/login') {
        this.router.navigate(['/inicio']);
        return false;
      }
      // Permite acessar outras rotas protegidas
      return true;
    } else {
      // Se não tiver token e tentar acessar rota protegida → redireciona para /login
      if (state.url !== '/login') {
        this.router.navigate(['/login']);
        return false;
      }
      // Permite acessar /login
      return true;
    }
  }

}
