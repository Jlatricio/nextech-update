import { Injectable } from "@angular/core";
import { HttpClient } from '@angular/common/http';

import { tap } from "rxjs";

import { Cliente } from "../interface/cliente";


@Injectable({
  providedIn: 'root',
})
export class ClienteService {
  
  private readonly apiUrl = 'http://localhost:3000/cliente'; // URL de la API de clientes
  
  constructor(private httpClient: HttpClient) {}


  salvarCliente(registro: Cliente) {
    return this.httpClient.post<Cliente>(this.apiUrl,registro)
    .pipe(
      tap(cliente => console.log(cliente))
    );
  }
  
  listaCliente() {
    return this.httpClient.get<Cliente[]>(this.apiUrl)
    .pipe(
     tap(cliente => console.log(cliente))
    );
  }
     

}
