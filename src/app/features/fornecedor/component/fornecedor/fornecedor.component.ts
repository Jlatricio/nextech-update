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
          log: null,
          nif: '',
          endereco: '',
          telefone: 0,
          email: '',
          empresaId: 0,
          dataCriacao: new Date(),
    };

    constructor(
      private formBuilder: FormBuilder,
      private fornecedorService: FornecedorService,
      
    ) {
    this.form = this.formBuilder.group({
      id: [this.fornecedor.id],
      nome: [this.fornecedor.nome, Validators.required],
      log: [this.fornecedor.log],
      nif: [this.fornecedor.nif, Validators.required],
      endereco: [this.fornecedor.endereco, Validators.required],
      telefone: [
        this.fornecedor.telefone,
        [
          Validators.required,
          Validators.pattern(/^(\(?\d{2}\)?\s?(9\d{4}|\d{4})-?\d{4})$/),
          Validators.minLength(9),
        ],
      ],
      email: [this.fornecedor.email, [Validators.required, Validators.email]],
      dataCriacao: [this.fornecedor.dataCriacao],
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
          console.log('Fornecedor created successfully:', response);
          this.fornecedor$ = this.fornecedorService.getFornecedores();
          this.form.reset();
        },
        (error) => {
          console.error('Error creating fornecedor:', error);
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

}
