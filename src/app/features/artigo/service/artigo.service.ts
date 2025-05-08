import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, tap } from 'rxjs';
import { Artigo } from '../interface/artigo';

@Injectable({
  providedIn: 'root'
})
export class ArtigoService {

    private readonly apiUrl = 'http://localhost:3000/artigo';
  http: any;

    constructor(private httpClient: HttpClient) {}

    salvarArtigo(registro: Artigo) {
      return this.httpClient.post<Artigo>(this.apiUrl, registro)
      .pipe(
        tap(artigo => console.log(artigo))
      );
    }

    listaArtigos() {
      return this.httpClient.get<Artigo[]>(this.apiUrl)
      .pipe(
        tap(artigos => console.log(artigos))
      );
    }

    deletarArtigo(id: number): Observable<void> {
      // Replace the URL with the correct API endpoint
      return this.httpClient.delete<void>(`${this.apiUrl}/${id}`);
    }

    atualizarArtigo(id: number, registro: Artigo): Observable<Artigo> {
      return this.httpClient.put<Artigo>(`${this.apiUrl}/${id}`, registro)
      .pipe(
      tap(artigoAtualizado => console.log(artigoAtualizado))
      );
    }

}

