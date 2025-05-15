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

login(email: string, senha: string): Observable<any> {
  const payload = { email, senha };
  return this.http.post(`${this.apiUrl}/auth/signin`, payload).pipe(
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
