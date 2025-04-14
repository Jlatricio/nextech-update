import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule, FormsModule } from '@angular/forms';
import { NgxMaskDirective, provideNgxMask } from 'ngx-mask';
import { Artigo } from '../../interface/artigo';
import { Observable } from 'rxjs';
import { ArtigoService } from '../../service/artigo.service';
import { Modal } from 'bootstrap';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-artigo',
  standalone: true,
  imports: [NgxMaskDirective, ReactiveFormsModule, CommonModule, FormsModule],
  providers: [provideNgxMask()],
  templateUrl: './artigo.component.html',
  styleUrls: ['./artigo.component.scss'] // Fixed typo
})
export class ArtigoComponent implements OnInit {
  artigo$: Observable<Artigo[]>;
  form: FormGroup;
  populateForm(artigo: any): void {
    this.form.patchValue({
      nome: artigo.nome,
      categoria: artigo.categoria,
      imposto: artigo.imposto,
      precoUnitario: artigo.precoUnitario
    });
  }

  constructor(private formBuilder: FormBuilder, private artigoService: ArtigoService) {
    this.artigo$ = this.artigoService.listaArtigos();

    this.form = this.formBuilder.group({
      nome: ['', Validators.required],
      categoria: ['', Validators.required],
      imposto: ['', Validators.required],
      precoUnitario: ['', Validators.required]
    });
  }

  ngOnInit(): void {}

  onSubmit() {
    if (this.form.valid) {
      this.artigoService.salvarArtigo(this.form.value).subscribe(result => {
        console.log(result);
        this.form.reset(); // Clear the form
        const modal = document.getElementById('exampleModal');
        if (modal) {
          const bootstrapModal = Modal.getInstance(modal);
          bootstrapModal?.hide(); // Close the modal
        }
      });
    }
  }

  deleteArtigo(id: number | undefined) {
    if (id !== undefined) {
      this.artigoService.deletarArtigo(id).subscribe(() => {
        console.log(`Artigo with ID ${id} deleted`);
        this.artigo$ = this.artigoService.listaArtigos(); // Refresh the list
      });
    }
  }

  updateArtigo(id: number) {
    if (this.form.valid) {
      this.artigoService.atualizarArtigo(id, this.form.value).subscribe(updatedArtigo => {
        console.log(`Artigo with ID ${id} updated`, updatedArtigo);
        this.form.reset(); // Clear the form
        const modal = document.getElementById('exampleModal');
        if (modal) {
          const bootstrapModal = Modal.getInstance(modal);
          bootstrapModal?.hide(); // Close the modal
        }
        this.artigo$ = this.artigoService.listaArtigos(); // Refresh the list
      });
    }
  }

}
