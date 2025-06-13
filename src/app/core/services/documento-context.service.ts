import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class DocumentoContextService {
  numeroGerado: string = '';
  tipoDocumento: 'FACTURA' | 'FACTURA_PROFORMA' | 'FACTURA_RECIBO' | '' = '';
}
