import { Injectable } from '@angular/core';
import { environment } from '../../../../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { catchError, Observable, throwError } from 'rxjs';
import { Usuario } from '../../../../features/usuario/components/interface/usuario';

@Injectable({
  providedIn: 'root'
})
export class HeaderService {
  private readonly apiUrl = `${environment.apiUrl}/users`;
     constructor(private httpClient: HttpClient) {}

    listaUsuario(): Observable<Usuario[]> {
  return this.httpClient.get<Usuario[]>(this.apiUrl).pipe(
    catchError(error => {
      console.error('Erro ao listar usuários', error);
      return throwError(() => error);
    })
  );
}

}
