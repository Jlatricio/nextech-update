import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

import { Fornecedor } from '../interface/fornecedor';
import { Observable, pipe, tap } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class FornecedorService {
  private readonly apiUrl = 'http://localhost:3000/fornecedor'; // URL de la API de clientes

  constructor(private httpClient: HttpClient) {}

  listaFornecedor() {
    return this.httpClient
      .get<Fornecedor[]>(this.apiUrl)
      .pipe(tap((fornecedor) => console.log(fornecedor)));
  }

  salvarFornecedor(registro: Fornecedor) {
    return this.httpClient
      .post<Fornecedor>(this.apiUrl, registro)
      .pipe(tap((fornecedor) => console.log(fornecedor)));
  }

  deleteFornecedor(id: number): Observable<void> {
    // Replace the URL with the correct API endpoint
    return this.httpClient.delete<void>(`${this.apiUrl}/${id}`);
  }

  atualizarFornecedor(id: number, registro: Fornecedor): Observable<Fornecedor> {
        return this.httpClient.put<Fornecedor>(`${this.apiUrl}/${id}`, registro)
       .pipe(tap((fornecedorAtualizado) => console.log(fornecedorAtualizado)));
  }
}
