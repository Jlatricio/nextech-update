import { Injectable } from '@angular/core';
import { environment } from '../../../../../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { map, Observable } from 'rxjs';
import { DadosDocumento } from '../../../interface/dadosdocumentos';
import { ProformaResponse } from '../interface/ProformaResponse';

@Injectable({
  providedIn: 'root'
})
export class ProformaService {
 private apiUrl = `${environment.apiUrl}`;



  constructor(private httpClient: HttpClient) { }
  // cria um proforma
  criarProforma(documentos: any) {
    return this.httpClient.post(`${this.apiUrl}/documents`, documentos);
  }

  // lista todos os proformas
listarProformas(): Observable<DadosDocumento[]> {
  return this.httpClient
    .get<ProformaResponse>(`${this.apiUrl}/documents?tipo=FACTURA_PROFORMA`)
    .pipe(map(res => res.data)); // Extrai apenas o array
}

//Vizualiza um proforma por ID
  visualizarProforma(id: number): Observable<DadosDocumento> {
    return this.httpClient.get<DadosDocumento>(`${this.apiUrl}/documents/${id}`);
  }

  // Atualiza um proforma
  atualizarProforma(id: number, documentos: any) {
    return this.httpClient.put(`${this.apiUrl}/documents/${id}`, documentos);
  }

  // Elimina um proforma
  eliminarProforma(id: number) {
    return this.httpClient.delete(`${this.apiUrl}/documents/${id}`);
  }
}
