import { Injectable } from "@angular/core";
import { HttpClient } from '@angular/common/http';

import { Observable, tap } from "rxjs";

import { Cliente } from "../interface/cliente";
import { environment } from "../../../../environments/environment";


@Injectable({
  providedIn: 'root',
})
export class ClienteService {
 private readonly apiUrl = `${environment.apiUrl}/clientes`;

  constructor(private httpClient: HttpClient) {}

  listaCliente(): Observable<Cliente[]> {
    return this.httpClient.get<Cliente[]>(this.apiUrl).pipe(
      tap((clientes) => console.log('Clientes:', clientes))
    );
  }
  createCliente(cliente: Cliente): Observable<Cliente> {
    return this.httpClient.post<Cliente>(this.apiUrl, cliente).pipe(
      tap((newCliente) => console.log('Cliente creado:', newCliente))
    );
  }
  deleteCliente(clienteId: number): Observable<void> {
    return this.httpClient.delete<void>(`${this.apiUrl}/${clienteId}`).pipe(
      tap(() => console.log(`Cliente eliminado con id: ${clienteId}`))
    );
  }
  updateCliente(cliente: Cliente): Observable<Cliente> {
    return this.httpClient.put<Cliente>(`${this.apiUrl}/${cliente.id}`, cliente).pipe(
      tap((updatedCliente) => console.log('Cliente actualizado:', updatedCliente))
    );
  }
  getClienteById(clienteId: number): Observable<Cliente> {
    return this.httpClient.get<Cliente>(`${this.apiUrl}/${clienteId}`).pipe(
      tap((cliente) => console.log('Cliente encontrado:', cliente))
    );
  }
  getClientesByTipo(tipo: string): Observable<Cliente[]> {
    return this.httpClient.get<Cliente[]>(`${this.apiUrl}?tipo=${tipo}`).pipe(
      tap((clientes) => console.log('Clientes encontrados por tipo:', clientes))
    );
  }
  getClientesByNome(nome: string): Observable<Cliente[]> {
    return this.httpClient.get<Cliente[]>(`${this.apiUrl}?nome=${nome}`).pipe(
      tap((clientes) => console.log('Clientes encontrados por nome:', clientes))
    );
  }
  getClientesByEmail(email: string): Observable<Cliente[]> {
    return this.httpClient.get<Cliente[]>(`${this.apiUrl}?email=${email}`).pipe(
      tap((clientes) => console.log('Clientes encontrados por email:', clientes))
    );
  }

  getClientesByTelefone(telefone: string): Observable<Cliente[]> {
    return this.httpClient.get<Cliente[]>(`${this.apiUrl}?telefone=${telefone}`).pipe(
      tap((clientes) => console.log('Clientes encontrados por telefone:', clientes))
    );
  }


  getClientesByEndereco(endereco: string): Observable<Cliente[]> {
    return this.httpClient.get<Cliente[]>(`${this.apiUrl}?endereco=${endereco}`).pipe(
      tap((clientes) => console.log('Clientes encontrados por endereco:', clientes))
    );
  }
}
