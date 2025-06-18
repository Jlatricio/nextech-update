import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { catchError, tap } from 'rxjs/operators';
import { environment } from './../../../../environments/environment';
import { Observable, throwError } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private apiUrl = environment.apiUrl;

  constructor(private http: HttpClient, private router: Router) {}

login(credenciais: { email?: string; telefone?: string; senha: string }): Observable<any> {
  return this.http.post(`${this.apiUrl}/auth/signin`, credenciais).pipe(
    tap((response: any) => {
      localStorage.setItem('token', response.token);
    }),
    catchError((error) => throwError(() => error))
  );
}






  isAuthenticated(): boolean {
    return !!localStorage.getItem('token');
  }
}
