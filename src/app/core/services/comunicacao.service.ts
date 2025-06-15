import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class ComunicacaoService {
  private anularDocumentoSubject = new Subject<number>();
  anularDocumento$ = this.anularDocumentoSubject.asObservable();

  emitirAnulacao(id: number): void {
    this.anularDocumentoSubject.next(id);
  }
}
