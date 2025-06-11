import { Injectable } from '@angular/core';
import { environment } from '../../../../../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { map, Observable } from 'rxjs';
import { DadosDocumento } from '../../../interface/dadosdocumentos';
import { facturaReciboResponse } from '../interface/facturareciboresponse';

@Injectable({
  providedIn: 'root'
})
export class FacturareciboService {
 private apiUrl = `${environment.apiUrl}`;



  constructor(private httpClient: HttpClient) { }
  // Cria um fatura recibo
  criarFaturaRecibo(documentos: any) {
    return this.httpClient.post(`${this.apiUrl}/documents`, documentos);
  }

  // Lista todos os fatura recibos
  listarFaturaRecibos():  Observable<DadosDocumento[]>{
     return this.httpClient.get<facturaReciboResponse>(`${this.apiUrl}/documents?tipo=FACTURA_RECIBO`)
        .pipe(map(res => res.data)); // Extrai apenas o array
  }

  // Visualiza um fatura recibo por ID
  visualizarFaturaRecibo(id: number): Observable<DadosDocumento> {
    return this.httpClient.get<DadosDocumento>(`${this.apiUrl}/documents/${id}`);
  }

  // Atualiza um fatura recibo
  atualizarFaturaRecibo(id: number, documentos: any) {
    return this.httpClient.put(`${this.apiUrl}/documents/${id}`, documentos);
  }


}
