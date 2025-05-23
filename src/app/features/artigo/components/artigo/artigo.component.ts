import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule, FormsModule } from '@angular/forms';
import { NgxMaskDirective, provideNgxMask } from 'ngx-mask';
import { Artigo } from '../../interface/artigo';
import { Observable } from 'rxjs';
import { ArtigoService } from '../../service/artigo.service';
import bootstrap, { Modal } from 'bootstrap';
import { CommonModule } from '@angular/common';
import { TitleService } from '../../../../core/services/title.service';
import { RouterModule } from '@angular/router';
import { CategoriaService } from '../../service/categoria.service';

@Component({
  selector: 'app-artigo',
  standalone: true,
  imports: [NgxMaskDirective, ReactiveFormsModule, CommonModule, FormsModule, RouterModule],
  providers: [provideNgxMask()],
  templateUrl:'./artigo.component.html',
  styleUrls: ['./artigo.component.scss']
})
export class ArtigoComponent implements OnInit {
loading: boolean = false;
  form: FormGroup;
  categoriaForm!: FormGroup;
artigos: Artigo[] = [];
 artigoSelecionadoId: number | null = null;
    categorias: { id: number, nome: string }[] = [];
  mostrarCampoNovaCategoria = false;
  novaCategoria = '';
modoEdicao = false;


  filtro = {
    Categorias: '',
    mes: '',
    tipo: ''
  };

  searchTerm: string = '';

 get artigosFiltrados(): Artigo[] {
  let resultado = this.artigos;

  const termo = this.searchTerm?.trim().toLowerCase();
  const categoriaSelecionada = this.filtro?.Categorias;

  if (termo) {
    resultado = resultado.filter(a => a.nome?.toLowerCase().includes(termo));
  }

  if (categoriaSelecionada) {
    resultado = resultado.filter(a => a.categoria?.id === +categoriaSelecionada);
  }

  return resultado;
}



filtrar(): void {
  this.loading = true;

  this.artigoService.listarArtigo().subscribe({
    next: artigos => {
      this.categoriaService.listarCategorias().subscribe({
        next: categorias => {
          const artigosComCategoria = artigos.map(a => ({
            ...a,
            categoria: categorias.find(c => c.id === a.categoriaId)
          }));

          if (this.filtro.Categorias) {
            this.artigos = artigosComCategoria.filter(a =>
              a.categoria && a.categoria.id === Number(this.filtro.Categorias)
            );
          } else {
            this.artigos = artigosComCategoria;
          }

          this.loading = false;
        },
        error: () => {
          this.loading = false;
        }
      });
    },
    error: () => {
      this.loading = false;
    }
  });
}







  constructor(
    private formBuilder: FormBuilder,
    private artigoService: ArtigoService,
    private titleService: TitleService,
    private categoriaService: CategoriaService,
  ) {


    this.form = this.formBuilder.group({
      nome: ['', Validators.required],
      categoria: ['', Validators.required],
      imposto: ['', Validators.required],
      precoUnitario: ['', Validators.required]
    });



    this.categoriaForm = this.formBuilder.group({
      nome: ['']
    });
  }

  ngOnInit(): void {
    this.titleService.setTitle('Artigos');
     this.carregarCategorias();
       this.inicializarFormulario();
    this.carregarArtigos();

     this.form.addControl('descricao', this.formBuilder.control('', [Validators.maxLength(300)]));
    this.form.get('descricao')?.valueChanges.subscribe((value: string) => {
      this.descricao = value;
      this.descricaoRestante = 300 - (value?.length || 0);
    });
  }




    inicializarFormulario(): void {
    this.form = this.formBuilder.group({
      nome: ['', Validators.required],
      precoUnitario: ['', Validators.required],
      categoria: ['', Validators.required],
      imposto: [0, Validators.required],
      tipo: ['', Validators.required],
      descricao: ['']
    });
  }

carregarArtigos(): void {
  this.artigoService.listarArtigo().subscribe({
    next: artigos => {
      this.categoriaService.listarCategorias().subscribe({
        next: categorias => {
          this.artigos = artigos.map(a => ({
            ...a,
            categoria: categorias.find(c => c.id === a.categoriaId)
          }));
        }
      });
    }
  });
}


salvarArtigo(): void {
  this.loading = true;  // começa o loading

  const artigo: Partial<Artigo> = {
    nome: this.form.value.nome,
    preco: parseFloat(
      String(this.form.value.precoUnitario)
        .replace('Kz ', '')
        .replace(/\./g, '')
        .replace(',', '.')
    ),
    categoriaId: Number(this.form.value.categoria),
    impostoAplicado: parseFloat(this.form.value.imposto),
    tipo: this.form.value.tipo,
    descricao: this.form.value.descricao,
  };

  if (this.artigoSelecionadoId) {
    this.artigoService.atualizarArtigo(this.artigoSelecionadoId, artigo).subscribe({
      next: () => {
        this.carregarArtigos();
        this.resetarFormulario();
        alert('Artigo atualizado com sucesso!');
        this.fecharModal();
      },
      error: (err) => {
        console.error('Erro ao atualizar:', err);
      },
      complete: () => {
        this.loading = false;  // termina o loading
      }
    });
  } else {
    this.artigoService.criarArtigo(artigo).subscribe({
      next: (res: any) => {
        console.log('Artigo criado!', res);
        alert('Artigo criado com sucesso!');
        this.fecharModal();
      },
      error: (err: any) => {
        console.error('Erro:', err.error);
      },
      complete: () => {
        this.carregarArtigos();
        this.resetarFormulario();
        this.loading = false;  // termina o loading
      }
    });
  }
}

fecharModal(): void {
  const modalElement = document.getElementById('exampleModal');
  if (modalElement) {
    const modal = Modal.getInstance(modalElement);
    modal?.hide();
  }
}



  editarArtigo(artigo: Artigo): void {
    this.artigoSelecionadoId = artigo.id ?? null;
    this.form.patchValue({
      nome: artigo.nome,
      precoUnitario: artigo.preco.toString(),
      categoria: artigo.categoriaId.toString(), // se `categoriaId` for string
      imposto: artigo.impostoAplicado,
      tipo: artigo.tipo,
      descricao: artigo.descricao
    });
    this.modoEdicao = true;


  const modalElement = document.getElementById('exampleModal') as HTMLElement | null;
  if (modalElement) {
    const modal = new Modal(modalElement);
    modal.show();
  }
  }

  excluirArtigo(id: number): void {
    if (confirm('Deseja realmente excluir este artigo?')) {
      this.artigoService.deletarArtigo(id).subscribe(() => this.carregarArtigos());
    }
  }

  resetarFormulario(): void {
    this.form.reset();
    this.artigoSelecionadoId = null;
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


toggleNovaCategoria() {
  this.mostrarCampoNovaCategoria = !this.mostrarCampoNovaCategoria;
}

  adicionarCategoria(): void {
    if (!this.novaCategoria.trim()) return;

    const novaCat = { nome: this.novaCategoria };

    this.categoriaService.criarCategoria(novaCat).subscribe({
      next: (categoriaCriada) => {
        this.categorias.push(categoriaCriada);
        this.form.get('categoria')?.setValue(categoriaCriada.id);
        this.novaCategoria = '';
        this.mostrarCampoNovaCategoria = false;
      },
      error: (err) => {
        console.error('Erro ao criar categoria:', err);
      }
    });
  }

  carregarCategorias(): void {
    this.categoriaService.listarCategorias().subscribe({
      next: (data) => {
        this.categorias = data; // Agora categorias é um array de objetos com id e nome
      },
      error: (err) => {
        console.error('Erro ao carregar categorias:', err);
      }
    });
  }

  descricao: string = '';
  descricaoRestante: number = 300;

  ngAfterViewInit(): void {
    this.descricaoRestante = 300 - (this.descricao?.length || 0);
  }


  impostos = [
  { valor: 0, nome: 'Nenhum imposto' },
  { valor: 0.07, nome: 'Imposto sobre o Valor Acrescentado (IVA) – 7%' },
  { valor: 0.14, nome: 'Imposto sobre o Valor Acrescentado (IVA) – 14%' },
  { valor: 0.25, nome: 'Imposto Industrial – 25% (taxa geral)' },
  { valor: 0.10, nome: 'Imposto Industrial – 10% (atividades agrícolas, aquícolas, apícolas, avícolas, piscatórias, silvícolas e pecuárias)' },
  { valor: 0.35, nome: 'Imposto Industrial – 35% (bancos, seguros, telecomunicações e empresas petrolíferas)' },
  { valor: 0, nome: 'Imposto sobre o Rendimento do Trabalho (IRT) – Taxas progressivas conforme tabela' },
  { valor: 0.25, nome: 'Imposto sobre o Rendimento do Trabalho (IRT) – 25% (Grupo B, matéria coletável não sujeita a retenção na fonte)' },
  { valor: 0.25, nome: 'Imposto sobre o Rendimento do Trabalho (IRT) – 25% (Grupo C, matéria coletável não sujeita a retenção na fonte)' },
  { valor: 0.10, nome: 'Imposto sobre a Aplicação de Capitais (IAC) – 10%' },
  { valor: 0.005, nome: 'Imposto Predial (IP) – 0,5% a 1% (varia conforme o valor do imóvel)' },
  { valor: 0.02, nome: 'Sisa – 2% (transmissão onerosa de bens imóveis)' },
  { valor: 0, nome: 'Imposto Especial de Consumo (IEC) – Taxas variáveis conforme o produto' },
  { valor: 0, nome: 'Imposto sobre Veículos Motorizados (IVM) – Taxas variáveis conforme o tipo e cilindrada do veículo' },
  { valor: 0, nome: 'Imposto sobre Sucessões e Doações – Taxas variáveis conforme o valor e grau de parentesco' },
  { valor: 0, nome: 'Imposto sobre as Atividades Petrolíferas – Taxas específicas conforme a legislação aplicável' },
  { valor: 0, nome: 'Imposto sobre as Atividades Mineiras – Taxas específicas conforme a legislação aplicável' },
  { valor: 0, nome: 'Direitos Aduaneiros – Taxas variáveis conforme o tipo de mercadoria' }
];

getNomeImposto(valor: number): string {
  const imposto = this.impostos.find(i => i.valor === valor);
  return imposto ? imposto.nome : 'Desconhecido';
}



}
