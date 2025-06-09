import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../../../environments/environment';
import { DadosDocumento } from '../interface/dadosdocumentos';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class DocumentoService {
   private apiUrl = `${environment.apiUrl}`;


  constructor(private httpClient: HttpClient) {}

  // Lista todos os documentos
  listarDocumentos() {
    return this.httpClient.get(`${this.apiUrl}/documents`);
  }

  //documento por ID
visualizarDocumento(id: number): Observable<DadosDocumento> {
  return this.httpClient.get<DadosDocumento>(`${this.apiUrl}/documents/${id}`);
}


}
