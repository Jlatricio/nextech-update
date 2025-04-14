import { Component } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ArtigoService } from '../../../artigo/service/artigo.service';
import { Modal } from 'bootstrap';
import { Observable } from 'rxjs';
import { Artigo } from '../../../artigo/interface/artigo';
import { CommonModule } from '@angular/common';
import { DespesaService } from '../../service/despesa.service';
import { Despesa } from '../../interface/despesa';
import { NgxMaskDirective, provideNgxMask } from 'ngx-mask';

@Component({
  selector: 'app-despesa',
  imports: [NgxMaskDirective,ReactiveFormsModule, CommonModule],
   providers: [provideNgxMask()],
  templateUrl: './despesa.component.html',
  styleUrl: './despesa.component.scss'
})
export class DespesaComponent {


  despesa$: Observable<Despesa[]>;
  form: FormGroup;
  populateForm(despesa: any): void {
  this.form.patchValue({
    nome: despesa.nome,
    motivo: despesa.motivo,
    fornecedor: despesa.fornecedor,
    reteencaonafonte: despesa.reteencaonafonte,
    data: despesa.data,
    entidade: despesa.entidade,
    criadopor: despesa.criadopor,
    valor: despesa.valor,
    documento: despesa.documento
  });
}

  constructor(private formBuilder: FormBuilder, private despesaService: DespesaService) {
    this.despesa$ = this.despesaService.listaDespesas();

    this.form = this.formBuilder.group({
      nome: ['', Validators.required],
      fornecedor: ['', Validators.required],
      motivo: ['', Validators.required],
      criadopor: ['Admin', Validators.required],
      data: [new Date().toISOString(), Validators.required], // Capture current date and time
      rtnc: ['', Validators.required],
      valor: ['', Validators.required]
    });
  }

  ngOnInit(): void {}

  onSubmit() {
    if (this.form.valid) {
      this.despesaService.salvarDespesa(this.form.value).subscribe(result => {
        console.log(result);
        this.form.reset(); // Clear the form
        const modal = document.getElementById('exampleModal');
        if (modal) {
          const bootstrapModal = Modal.getInstance(modal);
          bootstrapModal?.hide(); // Close the modal
        }
        this.despesa$ = this.despesaService.listaDespesas();
      });
    }
  }

  deleteArtigo(id: number | undefined) {
    if (id !== undefined) {
      this.despesaService.deletarDespesa(id).subscribe(() => {
        console.log(`Artigo with ID ${id} deleted`);
        this.despesa$ = this.despesaService.listaDespesas();
      });
    }
  }

  updateArtigo(id: number) {
    if (this.form.valid) {
      this.despesaService.atualizarDespesa(id, this.form.value).subscribe(updatedArtigo => {
        console.log(`Artigo with ID ${id} updated`, updatedArtigo);
        this.form.reset(); // Clear the form
        const modal = document.getElementById('exampleModal');
        if (modal) {
          const bootstrapModal = Modal.getInstance(modal);
          bootstrapModal?.hide(); // Close the modal
        }
        this.despesa$ = this.despesaService.listaDespesas();
      });
    }
  }
}
