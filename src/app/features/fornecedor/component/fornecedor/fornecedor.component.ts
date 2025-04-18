import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Observable } from 'rxjs/internal/Observable';

import { FornecedorService} from '../../services/fornecedor.service'
import { Fornecedor} from '../../interface/fornecedor';
import { RouterModule } from '@angular/router';

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
            populateForm(fornecedor: any): void {
            this.form.patchValue({
              nome: fornecedor.nome,
              nif: fornecedor.nif,
              telefone: fornecedor.telefone,
              email: fornecedor.email,
              endereco: fornecedor.endereco
            });
          }

  constructor(private formBuilder: FormBuilder,private fornecedorService: FornecedorService
  ) {
    this.fornecedor$ = this.fornecedorService.listaFornecedor();

    this.form = this.formBuilder.group({
      nome: ['', Validators.required],
      nif: ['', Validators.required],
      telefone: ['', Validators.required],
      email: ['', Validators.required, Validators.email],
      endereco: ['', Validators.required],
    });
  }
  ngOnInit(): void {}
  onSubmit() {
    this.fornecedorService
      .salvarFornecedor(this.form.value)
      .subscribe((result) => console.log(result));
  }
  deleteFornecedor(id: number | undefined) {
    if (id !== undefined) {
      this.fornecedorService.deleteFornecedor(id).subscribe(() => {
        console.log(`fornecedor com ID ${id} deleted`);
        this.fornecedor$ = this.fornecedorService.listaFornecedor(); // Refresh the list
      });
    }
  }
  updatefornecedor(id: number) {
    if (this.form.valid) {
     this.fornecedorService
       .atualizarFornecedor(id, this.form.value)
       .subscribe(updatefornecedor =>{
         console.log(`Fornecedor com ID ${id} updated`, updatefornecedor);
         this.form.reset();
         this.fornecedor$ = this.fornecedorService.listaFornecedor(); // Refresh the list
       });
    }
  }
}
