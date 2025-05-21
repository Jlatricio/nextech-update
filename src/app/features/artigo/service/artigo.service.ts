import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, tap } from 'rxjs';
import { Artigo } from '../interface/artigo';
import { environment } from '../../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ArtigoService {

  private apiUrl = `${environment.apiUrl}/articles`;

  constructor(private httpClient: HttpClient) {}

  // Lista todos os artigos
   listarArtigo(): Observable<Artigo[]> {
     return this.httpClient.get<Artigo[]>(this.apiUrl);
   }

    // Obtém um artigo por ID
    obterArtigoPorId(id: number): Observable<Artigo> {
      return this.httpClient.get<Artigo>(`${this.apiUrl}/${id}`);
    }

    // Cria um novo artigo
    criarArtigo(artigo: Partial<Artigo>): Observable<Artigo> {
      return this.httpClient.post<Artigo>(this.apiUrl, artigo);
    }

    // Atualiza um artigo existente
    atualizarArtigo(id: number, artigo: Partial<Artigo>): Observable<Artigo> {
      return this.httpClient.patch<Artigo>(`${this.apiUrl}/${id}`, artigo);
    }

    // Deleta um artigo por ID
    deletarArtigo(id: number): Observable<void> {
      return this.httpClient.delete<void>(`${this.apiUrl}/${id}`);
    }

}

