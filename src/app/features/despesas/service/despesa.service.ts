import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Despesa } from '../interface/despesa';
import { Observable, tap } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class DespesaService {
  private readonly apiUrl = 'http://localhost:3000/despesa';
  http: any;
  constructor(private httpClient: HttpClient) { }

  salvarDespesa(registro: Despesa) {
    return this.httpClient.post<Despesa>(this.apiUrl, registro)
      .pipe(
        tap((despesa: Despesa) => console.log(despesa))
      );
  }

  listaDespesas() {
    return this.httpClient.get<Despesa[]>(this.apiUrl)
      .pipe(
        tap((despesas: Despesa[]) => console.log(despesas))
      );
  }

  deletarDespesa(id: number): Observable<void> {
    return this.httpClient.delete<void>(`${this.apiUrl}/${id}`);
  }

  atualizarDespesa(id: number, registro: Despesa): Observable<Despesa> {
    return this.httpClient.put<Despesa>(`${this.apiUrl}/${id}`, registro)
      .pipe(
        tap(despesaAtualizada => console.log(despesaAtualizada))
      );
  }
}
