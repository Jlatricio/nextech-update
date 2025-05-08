import { Injectable } from "@angular/core";
import { HttpClient } from '@angular/common/http';

import { Observable, tap } from "rxjs";

import { Cliente } from "../interface/cliente";


@Injectable({
  providedIn: 'root',
})
export class ClienteService {
  private readonly apiUrl = 'http://localhost:3000/cliente'; // URL de la API de clientes

  constructor(private httpClient: HttpClient) {}

  listaCliente() {
    return this.httpClient
      .get<Cliente[]>(this.apiUrl)
      .pipe(tap((cliente) => console.log(cliente)));
  }

  salvarCliente(registro: Cliente) {
    return this.httpClient
      .post<Cliente>(this.apiUrl, registro)
      .pipe(tap((cliente) => console.log(cliente)));
  }

  deletarCliente(id: number): Observable<void> {
    // Replace the URL with the correct API endpoint
    return this.httpClient.delete<void>(`${this.apiUrl}/${id}`);
  }

  atualizarCliente(id: number, registro: Cliente): Observable<Cliente> {
    return this.httpClient.put<Cliente>(`${this.apiUrl}/${id}`, registro)
      .pipe(tap((clienteAtualizado) => console.log(clienteAtualizado)));
  }
}
