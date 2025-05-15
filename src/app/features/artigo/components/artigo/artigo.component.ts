import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule, FormsModule } from '@angular/forms';
import { NgxMaskDirective, provideNgxMask } from 'ngx-mask';
import { Artigo } from '../../interface/artigo';
import { Observable } from 'rxjs';
import { ArtigoService } from '../../service/artigo.service';
import { Modal } from 'bootstrap';
import { CommonModule } from '@angular/common';
import { TitleService } from '../../../../core/services/title.service';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-artigo',
  standalone: true,
  imports: [NgxMaskDirective, ReactiveFormsModule, CommonModule, FormsModule, RouterModule],
  providers: [provideNgxMask()],
  templateUrl: './artigo.component.html',
  styleUrls: ['./artigo.component.scss']
})
export class ArtigoComponent implements OnInit {

  artigo$: Observable<Artigo[]>;
  form: FormGroup;
  categoriaForm!: FormGroup;

  filtro = {
    Categorias: '',
    mes: '',
    tipo: ''
  };

  searchTerm: string = '';

  Categorias = ['Serviço', 'Produto'];

  cards = [
    {
      title: 'Facturado',
      value: 'Kz 0,00',
      info: '8 transações',
      percentage: '0,00%',
      icon: 'fas fa-file-invoice',
      style: ''
    },
    {
      title: 'Despesas',
      value: 'Kz 0,00',
      info: '8 registos',
      percentage: '0,00%',
      icon: 'fas fa-money-bill-wave',
      style: 'warning'
    },
    {
      title: 'Recibos',
      value: 'Kz 0,00',
      info: '8 emitidos',
      percentage: '0,00%',
      icon: 'fas fa-receipt',
      style: ''
    },
    {
      title: 'Reembolso',
      value: 'Kz 0,00',
      info: '8 pedidos',
      percentage: '0,00%',
      icon: 'fas fa-undo',
      style: 'danger'
    }
  ];

  constructor(
    private formBuilder: FormBuilder,
    private artigoService: ArtigoService,
    private titleService: TitleService
  ) {
    this.artigo$ = this.artigoService.listaArtigos();

    this.form = this.formBuilder.group({
      nome: ['', Validators.required],
      categoria: ['', Validators.required],
      imposto: ['', Validators.required],
      precoUnitario: ['', Validators.required]
    });

    this.categoriaForm = this.formBuilder.group({
      nome: ['', Validators.required],
      referencia: ['', Validators.required]
    });
  }

  ngOnInit(): void {
    this.titleService.setTitle('Artigos');
  }

  populateForm(artigo: Artigo): void {
    this.form.patchValue({
      nome: artigo.nome,
      categoria: artigo.categoria,
      imposto: artigo.imposto,
      precoUnitario: artigo.precoUnitario
    });
  }

  onSubmit(): void {
    if (this.form.valid) {
      this.artigoService.salvarArtigo(this.form.value).subscribe(result => {
        console.log(result);
        this.form.reset();

        const modal = document.getElementById('exampleModal');
        if (modal) {
          const bootstrapModal = Modal.getInstance(modal);
          bootstrapModal?.hide();
        }
      });
    }
  }

  deleteArtigo(id: number | undefined): void {
    if (id !== undefined) {
      this.artigoService.deletarArtigo(id).subscribe(() => {
        console.log(`Artigo with ID ${id} deleted`);
        this.artigo$ = this.artigoService.listaArtigos();
      });
    }
  }

  updateArtigo(id: number): void {
    if (this.form.valid) {
      this.artigoService.atualizarArtigo(id, this.form.value).subscribe(updatedArtigo => {
        console.log(`Artigo with ID ${id} updated`, updatedArtigo);
        this.form.reset();

        const modal = document.getElementById('exampleModal');
        if (modal) {
          const bootstrapModal = Modal.getInstance(modal);
          bootstrapModal?.hide();
        }

        this.artigo$ = this.artigoService.listaArtigos();
      });
    }
  }

  filtrar(): void {
    console.log('Filtro aplicado:', this.filtro);
    // Aqui você pode implementar o filtro para os artigos
  }

  filteredCards(): any[] {
    if (!this.searchTerm) return this.cards;

    return this.cards.filter(card =>
      card.title.toLowerCase().includes(this.searchTerm.toLowerCase())
    );
  }

  onCategoriaSubmit(): void {
    if (this.categoriaForm.valid) {
      console.log('Categoria Form Data:', this.categoriaForm.value);
      // Lógica para salvar categoria (futura implementação)

      this.categoriaForm.reset();

      const modal = document.getElementById('categoriaModal');
      if (modal) {
        const bootstrapModal = Modal.getInstance(modal);
        bootstrapModal?.hide();
      }
    }
  }

  categorias: string[] = ['Eletrônicos', 'Roupas', 'Alimentos'];
novaCategoria: string = '';
mostrarCampoNovaCategoria = false;

toggleNovaCategoria() {
  this.mostrarCampoNovaCategoria = !this.mostrarCampoNovaCategoria;
}

adicionarCategoria() {
  const novaCat = this.novaCategoria.trim();
  if (novaCat) {
    if (!this.categorias.includes(novaCat)) {
      this.categorias.push(novaCat);
      this.novaCategoria = '';
      this.mostrarCampoNovaCategoria = false;
    } else {
      alert('Categoria já existe!');
    }
  }
}

}
