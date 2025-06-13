import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Fornecedor } from '../interface/fornecedor';
import { environment } from '../../../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class FornecedorService {
 private readonly apiUrl = `${environment.apiUrl}/suppliers`;

  constructor(private http: HttpClient) {}

  listar(): Observable<Fornecedor[]> {
    return this.http.get<Fornecedor[]>(this.apiUrl);
  }
}
