import { Injectable } from '@angular/core';
import { environment } from '../../../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Empresa } from '../interface/empresa';

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

 uploadLogo(file: File): Observable<{ filename: string; path: string }> {
    const formData = new FormData();
    // O backend espera campo 'logo'
    formData.append('logo', file, file.name);
    // Ajuste URL: se apiUrl é '.../v1/companies'
    return this.httpClient.post<{ filename: string; path: string }>(
      `${this.apiUrl}/upload-logo`,
      formData
    );
  }
}
