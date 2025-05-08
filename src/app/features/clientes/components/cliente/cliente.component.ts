import { Component, OnInit } from '@angular/core'; // Update the path to the correct file
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup,ReactiveFormsModule, Validators} from '@angular/forms';

import { Observable } from 'rxjs';

import { ClienteService } from '../../service/cliente.service';
import { Cliente } from '../../interface/cliente';
import { TitleService } from '../../../../core/services/title.service';
import { RouterModule } from '@angular/router';



@Component({
  selector: 'app-cliente',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterModule],
  templateUrl: './cliente.component.html',
  styleUrl: './cliente.component.scss',
})
export class ClienteComponent implements OnInit {



  clientes$: Observable<Cliente[]>;
  form: FormGroup;

  populateForm(cliente: any): void {
    this.form.patchValue({
      nome: cliente.nome,
      tipo: cliente.tipo,
      email: cliente.email,
      telefone: cliente.telefone,
      endereco: cliente.endereco
    });
  }

  constructor(
    private formBuilder: FormBuilder,
    private clienteService: ClienteService
    , private titleService: TitleService
  ) {
    this.clientes$ = this.clienteService.listaCliente();

    this.form = this.formBuilder.group({
      nome: ['', Validators.required],
      tipo: ['', Validators.required],
      email: ['', Validators.required, Validators.email],
      telefone: ['', Validators.required],
      endereco: ['', Validators.required],
    });
  }
  ngOnInit(): void {
    this.titleService.setTitle('Clientes');
  }
  onSubmit() {
    this.clienteService
      .salvarCliente(this.form.value)
      .subscribe((result) => console.log(result));
  }

  deleteCliente(id: number | undefined) {
    if (id !== undefined) {
      this.clienteService.deletarCliente(id).subscribe(() => {
        console.log(`cliente com ID ${id} deleted`);
        this.clientes$ = this.clienteService.listaCliente(); // Refresh the list
      });
    }
  }

  updateCliente(id: number) {
    if (this.form.valid) {
      this.clienteService
        .atualizarCliente(id, this.form.value)
        .subscribe(updateCliente => {
          console.log(`Cliente com ID ${id} updated`, updateCliente);
          this.form.reset();
           // Clear the form
          this.clientes$ = this.clienteService.listaCliente(); // Refresh the list
        });
    }
  }

  Categorias = ['Serviço','Produto'];

  filtrar() {
  
    // aqui você pode fazer um filtro real nos dados ou chamada a um serviço/backend
  }

  searchTerm: string = '';

filteredCards() {
}

}
