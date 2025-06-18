import { Injectable } from '@angular/core';
import { environment } from '../../../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { ArquivoUpload, Empresa } from '../interface/empresa';

@Injectable({
  providedIn: 'root'
})
export class EmpresaService {
 private apiUrl = `${environment.apiUrl}/companies`;


  constructor(private httpClient: HttpClient) {}

  //Mostra os dados da empresa
  empresadados(): Observable<Empresa>{
  return this.httpClient.get<Empresa>(`${this.apiUrl}/me`);
  }

  //Atualiza os dados da empresa
  atualizadados(dados: Partial<Empresa>): Observable<Empresa>{
    return this.httpClient.patch<Empresa>(this.apiUrl, dados);
  }

}
