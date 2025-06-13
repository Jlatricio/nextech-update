import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../../../environments/environment';
import { DadosDocumento } from '../interface/dadosdocumentos';
import { map, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class DocumentoService {

   private apiUrl = `${environment.apiUrl}`;


  constructor(private httpClient: HttpClient) {}

  // Lista todos os documentos
 listarDocumentos(): Observable<DadosDocumento[]> {
  return this.httpClient.get<{ data: DadosDocumento[] }>(`${this.apiUrl}/documents`)
    .pipe(map(response => response.data));
}

  //documento por ID
visualizarDocumento(id: number): Observable<DadosDocumento> {
  return this.httpClient.get<DadosDocumento>(`${this.apiUrl}/documents/${id}`);
}

// Gera um código de referência
gerarCodigoReferencia(payload: { tipo: string; motivo?: string }): Observable<string> {
  return this.httpClient.post<{ referencia: string }>(
    `${this.apiUrl}/documents/generate-code`, payload
  ).pipe(map(res => res.referencia));
}





}
