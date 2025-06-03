import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder,FormGroup,ReactiveFormsModule,Validators,} from '@angular/forms';
import { RouterModule } from '@angular/router';

import { Observable } from 'rxjs';

import { ClienteService } from '../../service/cliente.service';
import { Cliente } from '../../interface/cliente';

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
        editando = false;
        clienteIdEditando: number | null = null;

  constructor(private formBuilder: FormBuilder, private clienteService: ClienteService)
  {
    this.form = this.createForm();
    this.clientes$ = this.clienteService.getCliente();
  }

  ngOnInit(): void {
    this.loadClientes();
  }

  private createForm(): FormGroup {
    return this.formBuilder.group({
      nome: ['', Validators.required],
      tipo: ['', Validators.required],
      email: ['', Validators.required, Validators.email],
      telefone: ['', Validators.required],
      endereco: ['', Validators.required],
    });
  }

  private loadClientes(): void {
    this.clientes$ = this.clienteService.getCliente();
  }
  onSubmit(): void {
    if (this.form.invalid) {
      console.warn('Formulário inválido:', this.form.value);
      this.logValidationErrors();
      return;
    }

    const cliente: Cliente = {
      id: this.editando ? this.clienteIdEditando! : 0, 
      ...this.form.value,
    };

    if (this.editando) {
      this.updateCliente(cliente);
    } else {
      this.createCliente(cliente); // Pass Cliente with id
    }
  }
  private createCliente(cliente: Cliente): void {
    this.clienteService.createCliente(cliente).subscribe({
      next: () => {
        alert('Cliente criado com sucesso!');
        this.resetForm();
        this.loadClientes();
      },
      error: (error) => {
        alert('Erro ao criar cliente.');
        console.error('Erro:', error);
      },
    });
  }
  private updateCliente(cliente: Cliente): void {
    this.clienteService.updateCliente(cliente).subscribe({
      next: () => {
        alert('Cliente atualizado com sucesso!');
        this.resetForm();
        this.loadClientes();
      },
      error: (error) => {
        alert('Erro ao atualizar cliente.');
        console.error('Erro:', error);
      },
    });
  }
  populateForm(cliente: Cliente): void {
    this.form.patchValue({
      nome: cliente.nome,
      email: cliente.email,
      telefone: cliente.telefone,
      endereco: cliente.endereco,
      tipo: cliente.tipo,
    });
    this.editando = true;
    this.clienteIdEditando = cliente.id;
  }
  resetForm(): void {
    this.form.reset();
    this.editando = false;
    this.clienteIdEditando = null;
  }
  deleteCliente(id: number) {
    // Call your service to delete the client by id
    this.clienteService.deleteCliente(id).subscribe({
      next: () => {
        // Refresh the list or update the observable
        this.loadClientes();
      },
      error: (err) => {
        // Handle error (optional)
        console.error('Erro ao deletar cliente:', err);
      },
    });
  }
  private logValidationErrors(): void {
    Object.entries(this.form.controls).forEach(([key, control]) => {
      console.warn(`${key}:`, {
        valor: control.value,
        válido: control.valid,
        erros: control.errors,
      });
    });
  }
}
