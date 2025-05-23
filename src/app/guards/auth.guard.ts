import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, Router } from '@angular/router';
import { jwtDecode } from 'jwt-decode';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {

  constructor(private router: Router) {}

  isTokenExpired(token: string): boolean {
    try {
      const decoded: any = jwtDecode(token);
      const exp = decoded.exp;
      const now = Math.floor(Date.now() / 1000); 
      return exp < now;
    } catch (e) {
      return true;
    }
  }

  canActivate(next: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean {
    const token = localStorage.getItem('token');

    if (token && !this.isTokenExpired(token)) {
      if (state.url === '/login') {
        this.router.navigate(['/inicio']);
        return false;
      }
      return true;
    } else {
      if (state.url !== '/login') {
        this.router.navigate(['/login']);
        return false;
      }
      return true;
    }
  }
}
