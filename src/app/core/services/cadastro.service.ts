import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class CadastroService {

  private apiUrl = 'https://api.nextechgestao.cloud/v1/auth/signup';

  constructor(private http: HttpClient) { }

  cadastrarUsuario(payload: {
    nome: string,
    email: string,
    telefone: string,
    senha: string
  }): Observable<any> {
    return this.http.post(this.apiUrl, payload);
  }
}
