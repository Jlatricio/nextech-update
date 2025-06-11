import { HttpClient } from '@angular/common/http';
import {  Injectable } from '@angular/core';
import { environment } from '../../../../environments/environment';

import { Fornecedor } from '../interface/fornecedor';
import { Observable, tap } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class FornecedorService {
  private readonly apiUrl = `${environment.apiUrl}/suppliers`;

  constructor(private readonly http: HttpClient) {}

  createFornecedor(fornecedor: Fornecedor): Observable<Fornecedor> {
    return this.http
      .post<Fornecedor>(this.apiUrl, fornecedor)
      .pipe(
        tap((newFornecedor) => console.log('Novo Fornecedor:', newFornecedor))
      );
  }

  getFornecedores(): Observable<Fornecedor[]> {
    return this.http
      .get<Fornecedor[]>(this.apiUrl)
      .pipe(tap((fornecedores) => console.log('Fornecedores:', fornecedores)));
  }

  updateFornecedor(id: number, fornecedor: Partial<Fornecedor>): Observable<Fornecedor> {
    const updatedFornecedor = {
      ...(fornecedor.nome !== undefined && { nome: fornecedor.nome }),
      ...(fornecedor.email !== undefined && { email: fornecedor.email }),
      ...(fornecedor.telefone !== undefined && { telefone: fornecedor.telefone }),
      ...(fornecedor.endereco !== undefined && { endereco: fornecedor.endereco }),
    };
    return this.http
      .patch<Fornecedor>(`${this.apiUrl}/${id}`, updatedFornecedor)
      .pipe(
        tap((updatedFornecedor) =>
          console.log('Fornecedor atualizado:', updatedFornecedor)
        )
      );
  }

  deleteFornecedor(id: number): Observable<void> {
    return this.http
      .delete<void>(`${this.apiUrl}/${id}`)
      .pipe(tap(() => console.log(`Fornecedor com ID ${id} excluído`)));
  }
}
