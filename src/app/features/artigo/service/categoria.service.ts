import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Categoria } from './../interface/categoria'; // ajuste se o caminho for diferente
import { environment } from './../../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class CategoriaService {
  private apiUrl = `${environment.apiUrl}/categories`;

  constructor(private http: HttpClient) {}

  // GET /categories
  listarCategorias(): Observable<Categoria[]> {
    return this.http.get<Categoria[]>(this.apiUrl);
  }

  // Faz o query /categories/{id}
  obterCategoriaPorId(id: number): Observable<Categoria> {
    return this.http.get<Categoria>(`${this.apiUrl}/${id}`);
  }

  // Adiciona /categories
  criarCategoria(categoria: Partial<Categoria>): Observable<Categoria> {
    return this.http.post<Categoria>(this.apiUrl, categoria);
  }

  // atualiza /categories/{id}
  atualizarCategoria(id: number, categoria: Partial<Categoria>): Observable<Categoria> {
    return this.http.patch<Categoria>(`${this.apiUrl}/${id}`, categoria);
  }

  // DELETE /categories/{id}
  deletarCategoria(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }
}
