import { Injectable } from "@angular/core";
import { HttpClient } from '@angular/common/http';

import { Observable, tap } from "rxjs";

import { Cliente } from "../interface/cliente";
import { environment } from "../../../../environments/environment";


@Injectable({
  providedIn: 'root',
})
export class ClienteService {
  private readonly apiUrl = `${environment.apiUrl}/costumers`;

  constructor(private httpClient: HttpClient) {}

  getCliente(): Observable<Cliente[]> {
    return this.httpClient
      .get<Cliente[]>(this.apiUrl)
      .pipe(tap((clientes) => console.log('Clientes:', clientes)));
  }

  createCliente(cliente: Cliente): Observable<Cliente> {
    return this.httpClient
      .post<Cliente>(this.apiUrl, cliente)
      .pipe(tap((newCliente) => console.log('Cliente creado:', newCliente)));
  }

  editarCliente(cliente: Cliente): Observable<Cliente> {
    const newCliente = {
      tipo: cliente.tipo,
      nome: cliente.nome,
      email: cliente.email,
      telefone: cliente.telefone,
      endereco: cliente.endereco,
    };
    return this.httpClient.patch<Cliente>(
      `${this.apiUrl}/${cliente.id}`,
      newCliente
    );
  }

  deleteCliente(cliente: Cliente): Observable<void> {
    return this.httpClient
      .delete<void>(`${this.apiUrl}/${cliente.id}`)
      .pipe(tap(() => console.log(`Cliente eliminado con id: ${cliente.id}`)));
  }


  checkEmail(email: string): Observable<boolean> {
    return this.httpClient.get<boolean>( `/api/costumers/check-email?email=${email}`
    );
  }

  checkTelefone(telefone: string): Observable<boolean> {
    return this.httpClient.get<boolean>( `/api/costumers/check-telefone?telefone=${telefone}`
    );
  }
}
