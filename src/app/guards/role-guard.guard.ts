// src/app/guards/role.guard.ts
import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, Router } from '@angular/router';
import { jwtDecode } from 'jwt-decode';

@Injectable({
  providedIn: 'root'
})
export class RoleGuard implements CanActivate {
  constructor(private router: Router) {}

  canActivate(route: ActivatedRouteSnapshot): boolean {
    const token = localStorage.getItem('token');
    if (!token) {
      this.router.navigate(['/login']);
      return false;
    }

    try {
      const decoded: any = jwtDecode(token);
      const userPerfil = decoded.perfil; 
      const allowedRoles = route.data['allowedRoles'] as string[];

      if (allowedRoles.includes(userPerfil)) {
        return true;
      } else {
        console.warn(`Acesso negado: o perfil ${userPerfil} não está autorizado.`);
        this.router.navigate(['/inicio']);
        return false;
      }
    } catch (e) {
      console.warn('Erro ao decodificar o token', e);
      this.router.navigate(['/login']);
      return false;
    }
  }
}
