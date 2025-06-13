import { Injectable } from '@angular/core';
import { environment } from '../../../../../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { facturaResponse } from '../interface/facturaresponse';
import { map, Observable } from 'rxjs';
import { DadosDocumento } from '../../../interface/dadosdocumentos';

@Injectable({
  providedIn: 'root'
})
export class FaturaService {
 private apiUrl = `${environment.apiUrl}`;
    constructor(private httpClient: HttpClient) { }

    // cria um factura
    criarFactura(documentos: any) {
      return this.httpClient.post(`${this.apiUrl}/documents`, documentos);
    }

    // lista todos os facturas
    listarFacturas(): Observable<DadosDocumento[]> {
      return this.httpClient
      .get<facturaResponse>(`${this.apiUrl}/documents?tipo=FACTURA`)
      .pipe(map(res => res.data));
    }

    // Vizualiza uma factura por ID
    visualizarFactura(id: number): Observable<DadosDocumento> {
      return this.httpClient.get<DadosDocumento>(`${this.apiUrl}/documents/${id}`);
    }

    // Atualiza uma factura
    atualizarFactura(id: number, documentos: any) {
      return this.httpClient.put(`${this.apiUrl}/documents/${id}`, documentos);
    }

  
}
