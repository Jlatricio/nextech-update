import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, Router } from '@angular/router';
import { jwtDecode } from 'jwt-decode';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {

  constructor(private router: Router) {}

  private isTokenExpired(token: string): boolean {
    try {
      const decoded: any = jwtDecode(token);
      const exp = decoded.exp;
      const now = Math.floor(Date.now() / 1000);
      return exp < now;
    } catch (e) {
      console.warn('Token inválido:', e);
      return true;
    }
  }

  canActivate(next: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean {
    const token = localStorage.getItem('token');
    const url = state.url;

    if (token && !this.isTokenExpired(token)) {
      const decoded: any = jwtDecode(token);
      const perfil = decoded.perfil;

      const rotasRestritasParaVendedor = [
        '/configuracao',
        '/artigo',
        '/relatorio',
        '/usuario',
        '/despesa',
        '/fornecedor'
      ];

      if (
        perfil === 'VENDEDOR' &&
        rotasRestritasParaVendedor.some(restrita => url.startsWith(restrita))
      ) {
        console.warn(`Acesso negado para VENDEDOR na rota ${url}`);
        this.router.navigate(['/inicio']);
        return false;
      }

      if (url === '/login') {
        this.router.navigate(['/inicio'], { replaceUrl: true });
        return false;
      }

      return true;
    }

    if (url !== '/login') {
      this.router.navigate(['/login'], { replaceUrl: true });
      return false;
    }

    return true;
  }
}
