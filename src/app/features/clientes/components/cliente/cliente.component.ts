import { Component, OnInit } from '@angular/core'; // Update the path to the correct file
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup,ReactiveFormsModule, Validators} from '@angular/forms';

import { Observable } from 'rxjs';

import { ClienteService } from '../../service/cliente.service';
import { Cliente } from '../../interface/cliente';



@Component({
  selector: 'app-cliente',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './cliente.component.html',
  styleUrl: './cliente.component.scss'
})
export class ClienteComponent implements OnInit {
  clientes$: Observable<Cliente[]>;
  form:FormGroup; 
 
  constructor(private formBuilder: FormBuilder, private clienteService: ClienteService) {
      this.clientes$ = this.clienteService.listaCliente();

      this.form = this.formBuilder.group({
        nome:['', Validators.required],
        tipo:['', Validators.required],
        email:['',Validators.required, Validators.email],
        telefone:['',Validators.required],
        endereco:['', Validators.required]
      });
  }
  ngOnInit(): void {
  }
  onSubmit() {
    this.clienteService.salvarCliente(this.form.value).subscribe(result => console.log(result))
  }
}
