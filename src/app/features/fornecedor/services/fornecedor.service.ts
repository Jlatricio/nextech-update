import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
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


  // getFornecedoresByEmpresaId(empresaId: number): Observable<Fornecedor[]> {
  //   return this.http
  //     .get<Fornecedor[]>(`${this.apiUrl}/empresa/${empresaId}`)
  //     .pipe(
  //       tap((fornecedores) =>
  //         console.log('Fornecedores por Empresa ID:', fornecedores)
  //       )
  //     );
  // }
  // getFornecedorById(id: number): Observable<Fornecedor> {
  //   return this.http
  //     .get<Fornecedor>(`${this.apiUrl}/${id}`)
  //     .pipe(tap((fornecedor) => console.log('Fornecedor:', fornecedor)));
  // }
}
