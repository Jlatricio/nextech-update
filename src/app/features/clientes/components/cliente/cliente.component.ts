import { Component, OnInit } from '@angular/core'; // Update the path to the correct file
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup,ReactiveFormsModule, Validators} from '@angular/forms';

import { Observable } from 'rxjs';

import { ClienteService } from '../../service/cliente.service';
import { Cliente } from '../../interface/cliente';
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

  // populateForm(cliente: any): void {
  //   this.form.patchValue({
  //     nome: cliente.nome,
  //     tipo: cliente.tipo,
  //     email: cliente.email,
  //     telefone: cliente.telefone,
  //     endereco: cliente.endereco
  //   });
  // }

  constructor(private formBuilder: FormBuilder,private clienteService: ClienteService
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
    this.clientes$ = this.clienteService.listaCliente();
  }
  
  onSubmit() {
    if (this.form.valid) {
      this.clienteService.createCliente(this.form.value).subscribe(
        (response) => {
          alert('Cliente criado com sucesso' + response);
          this.form.reset();
        },
        (error) => {
          console.error('Erro ao criar cliente:', error);
        }
      );
    } else {
      alert('Formulário inválido');
    }
  }

  

}
