import { Injectable } from '@angular/core';
import { environment } from '../../../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { catchError, Observable, throwError } from 'rxjs';
import { Usuario } from '../interface/usuario';

@Injectable({
  providedIn: 'root'
})
export class UsuarioService {
  private readonly apiUrl = `${environment.apiUrl}/users`;

    constructor(private httpClient: HttpClient) {}
     listaUsuario(): Observable<Usuario[]> {
  return this.httpClient.get<Usuario[]>(this.apiUrl).pipe(
    catchError(error => {
      console.error('Erro ao listar usuários', error);
      return throwError(() => error);
    })
  );
}

 obterUsuarioPorId(id: number): Observable<Usuario> {
    return this.httpClient.get<Usuario>(`${this.apiUrl}/${id}`);
  }

   criarUsuario(usuario: Partial<Usuario>): Observable<Usuario> {
    return this.httpClient.post<Usuario>(this.apiUrl, usuario);
  }


  atualizarUsuario(id: number, usuario: Partial<Usuario>): Observable<Usuario> {
    return this.httpClient.patch<Usuario>(`${this.apiUrl}/${id}`, usuario);
  }

  deletarUsuario(id: number): Observable<void> {
    return this.httpClient.delete<void>(`${this.apiUrl}/${id}`);
  }

}
