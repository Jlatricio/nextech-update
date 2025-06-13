import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable} from 'rxjs';
import { Despesa } from '../interface/despesa';
import { environment } from '../../../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class DespesaService {
  private apiUrl = `${environment.apiUrl}/expenses`;

  constructor(private httpClient: HttpClient) {}

  // Lista todos os Despesa
  listarDespesa(): Observable<Despesa[]> {
    return this.httpClient.get<Despesa[]>(this.apiUrl);
  }

  // // Obtém um despesa por ID
  // obterDespesaPorId(id: number): Observable<Despesa> {
  //   return this.httpClient.get<Despesa>(`${this.apiUrl}/${id}`);
  // }

  // Cria um novo despesa
  criarDespesa(despesa: Partial<Despesa>): Observable<Despesa> {
    return this.httpClient.post<Despesa>(this.apiUrl, despesa);
  }

  // Atualiza um despesa existente
  atualizarDespesa(id: number, despesa: Partial<Despesa>): Observable<Despesa> {
    return this.httpClient.patch<Despesa>(`${this.apiUrl}/${id}`, despesa);
  }

  // Deleta um despesa por ID
  deletarDespesa(id: number): Observable<void> {
    return this.httpClient.delete<void>(`${this.apiUrl}/${id}`);
  }
}

