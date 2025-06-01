import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';

import { Observable } from 'rxjs/internal/Observable';


import { FornecedorService} from '../../services/fornecedor.service'
import { Fornecedor} from '../../interface/fornecedor';

@Component({
  selector: 'app-fornecedores',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterModule],
  templateUrl: './fornecedor.component.html',
  styleUrl: './fornecedor.component.scss',
})
export class FornecedoresComponent {
  fornecedor$!: Observable<Fornecedor[]>;

  form: FormGroup;
    fornecedor: Fornecedor = {
          id: 0,
          nome: '',
          nif: '',
          endereco: '',
          telefone: '',
          email: ''
    };

    constructor(
      private formBuilder: FormBuilder,
      private fornecedorService: FornecedorService,
      
    ) {
    this.form = this.formBuilder.group({
      id: [this.fornecedor.id],
      nome: [this.fornecedor.nome, Validators.required],  
      nif: [this.fornecedor.nif, Validators.required],
      endereco: [this.fornecedor.endereco, Validators.required],
      telefone: [this.fornecedor.telefone,[Validators.required,Validators.minLength(9),],],
      email: [this.fornecedor.email, [Validators.required, Validators.email]],
    });
  }

  ngOnInit(): void {
    this.fornecedor$ = this.fornecedorService.getFornecedores();
  }       
  onSubmit() {
    console.log(this.form.value);
    if (this.form.valid) {
      this.fornecedorService.createFornecedor(this.form.value).subscribe(
        (response) => {

          // Exibir mensagem de sucesso
          alert('Fornecedor criado com sucesso');
          console.log(response)
          this.form.reset();
          // Atualizar a lista de fornecedores
          this.fornecedor$ = this.fornecedorService.getFornecedores();
        },
        (error) => {
          // Exibir mensagem de erro
          alert('Erro ao criar fornecedor');
          console.log(error)
        }
      );
    } else {
      console.log('Form is invalid');
      Object.entries(this.form.controls).forEach(([key, control]) => {
        console.log(
          `${key} - valor: ${control.value}, válido: ${control.valid}, erros:`,
          control.errors
        );
      });
    }
  }

  deleteFornecedor(fornecedor: Fornecedor) {
    this.fornecedorService.deleteFornecedor(fornecedor.id).subscribe(
      () => {
        // Exibir mensagem de sucesso
        alert('Fornecedor excluído com sucesso');

        // Atualizar a lista de fornecedores
        this.fornecedor$ = this.fornecedorService.getFornecedores();
      },
      (error) => {
        // Exibir mensagem de erro
        alert('Erro ao excluir fornecedor:' + error.message);
      } 
    );
  }
  updateFornecedor(fornecedor: Fornecedor) {
    this.fornecedorService.updateFornecedor(fornecedor).subscribe(
      (response) => {
        // Exibir mensagem de sucesso
        alert('Fornecedor atualizado com sucesso');
        console.log(response);
        // Atualizar a lista de fornecedores
        this.fornecedor$ = this.fornecedorService.getFornecedores();
      },
      (error) => {
        // Exibir mensagem de erro
        alert('Erro ao atualizar fornecedor:' + error.message);
      }
    );
  }
  populateForm(fornecedor: Fornecedor) {
    this.form.patchValue({
      id: fornecedor.id,
      nome: fornecedor.nome,
      nif: fornecedor.nif,
      endereco: fornecedor.endereco,
      telefone: fornecedor.telefone,
      email: fornecedor.email
    });
  }
 
}
