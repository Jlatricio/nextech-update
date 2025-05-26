import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

import { Observable, tap } from 'rxjs';
import { Usuario } from '../interface/usuario';
import { environment } from '../../../../environments/environment';


@Injectable({
  providedIn: 'root'
})

export class usuarioServices {
 private readonly apiUrl = `${environment.apiUrl}/users`;

  constructor(private httpClient: HttpClient) {}

  // Lista todos os usuários
  listaUsuario(): Observable<Usuario[]> {
    return this.httpClient.get<Usuario[]>(this.apiUrl);
  }

  // Obtém um usuário por ID
  obterUsuarioPorId(id: number): Observable<Usuario> {
    return this.httpClient.get<Usuario>(`${this.apiUrl}/${id}`);
  }

  // Cria um novo usuário
  criarUsuario(usuario: Partial<Usuario>): Observable<Usuario> {
    return this.httpClient.post<Usuario>(this.apiUrl, usuario);
  }
  // Atualiza um usuário existente
  atualizarUsuario(id: number, usuario: Partial<Usuario>): Observable<Usuario> {
    return this.httpClient.patch<Usuario>(`${this.apiUrl}/${id}`, usuario);
  }
  // Deleta um usuário por ID
  deletarUsuario(id: number): Observable<void> {
    return this.httpClient.delete<void>(`${this.apiUrl}/${id}`);
  }

}
