import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

import { Observable, tap } from 'rxjs';
import { Usuario } from '../components/interface/usuario';


@Injectable({
  providedIn: 'root',
})
export class usuarioServices {
  private readonly apiUrl = 'http://localhost:3000/fornecedor'; // URL de la API de clientes

  constructor(private httpClient: HttpClient) {}

  listaUsuario() {
    return this.httpClient
      .get<Usuario[]>(this.apiUrl)
      .pipe(tap((usuario) => console.log(usuario)));
  }

  salvarUsuario(registro: Usuario) {
    return this.httpClient
      .post<Usuario>(this.apiUrl, registro)
      .pipe(tap((usuario) => console.log(usuario)));
  }

  deleteUsuario(id: number): Observable<void> {
    // Replace the URL with the correct API endpoint
    return this.httpClient.delete<void>(`${this.apiUrl}/${id}`);
  }

  atualizarUsuario(id: number, registro: Usuario): Observable<Usuario> {
      return this.httpClient.put<Usuario>(`${this.apiUrl}/${id}`, registro)
      .pipe(tap((usuarioAtualizado) => console.log(usuarioAtualizado)));
  }
}
