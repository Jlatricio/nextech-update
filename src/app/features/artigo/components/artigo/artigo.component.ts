import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule, FormsModule } from '@angular/forms';
import { NgxMaskDirective, provideNgxMask } from 'ngx-mask';
import { Artigo } from '../../interface/artigo';
import { finalize, Observable } from 'rxjs';
import { ArtigoService } from '../../service/artigo.service';
import bootstrap, { Modal } from 'bootstrap';
import { CommonModule } from '@angular/common';
import { TitleService } from '../../../../core/services/title.service';
import { RouterModule } from '@angular/router';
import { CategoriaService } from '../../service/categoria.service';
import { ToastrService } from 'ngx-toastr';
import Swal from 'sweetalert2';
import { BsDropdownModule } from 'ngx-bootstrap/dropdown';

@Component({
  selector: 'app-artigo',
  standalone: true,
  imports: [NgxMaskDirective, ReactiveFormsModule, CommonModule, FormsModule, RouterModule, BsDropdownModule],
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
modalModo: 'criar' | 'editar' = 'criar';




  filtro = {
    Categorias: '',
    mes: '',
    tipo: ''
  };


filtroNomeCategoriaSelecionada = 'Todos';

selecionarCategoria(id: string, nome: string) {
  this.filtro.Categorias = id;
  this.filtroNomeCategoriaSelecionada = nome;
}

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
     private toastr: ToastrService
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

artigoSelecionado: any = null;
abrirCriarModal() {
  this.modalModo = 'criar';
  this.artigoSelecionado = {}; // ou zere o form como preferir
}

salvarArtigo(): void {
  this.loading = true;
  this.modalModo = 'criar';
  // Garante que a descrição nunca seja vazia
  let descricao = this.form.value.descricao?.trim();
  if (!descricao) {
    descricao = 'N/A';
  }

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
    descricao: descricao,
  };

  if (this.artigoSelecionadoId) {
    this.artigoService.atualizarArtigo(this.artigoSelecionadoId, artigo).subscribe({
      next: () => {
        this.carregarArtigos();
        this.resetarFormulario();
        Swal.fire({
          icon: 'success',
          title: 'Sucesso!',
          text: 'Artigo atualizado com sucesso!',
          timer: 2000,
          showConfirmButton: false
        });
        this.fecharModal();
      },
      error: (err) => {
        console.error('Erro ao atualizar:', err);
      },
      complete: () => {
        this.loading = false;
      }
    });
  } else {
    this.artigoService.criarArtigo(artigo).subscribe({
      next: (res: any) => {
        console.log('Artigo criado!', res);
        Swal.fire({
          icon: 'success',
          title: 'Sucesso!',
          text: 'Artigo criado com sucesso!',
          timer: 2000,
          showConfirmButton: false
        });
        this.fecharModal();
      },
      error: (err: any) => {
        console.error('Erro:', err.error);
      },
      complete: () => {
        this.carregarArtigos();
        this.resetarFormulario();
        this.loading = false;
      }
    });
  }
}

fecharModal(): void {
  const modalElement = document.getElementById('exampleModal');

  if (modalElement) {
    let modal = Modal.getInstance(modalElement);
    if (!modal) {
      modal = new Modal(modalElement);
    }

    modal.hide();

    // Espera o modal terminar a animação e remove o backdrop manualmente
    setTimeout(() => {
      // Remove classe que trava o scroll da página
      document.body.classList.remove('modal-open');

      // Remove o backdrop (fundo escuro)
      const backdrops = document.querySelectorAll('.modal-backdrop');
      backdrops.forEach(b => b.remove());
    }, 300); // 300ms é o tempo padrão do fade-out no Bootstrap
  }
}





  editarArtigo(artigo: Artigo): void {

      this.modalModo = 'editar';
     this.modalModo = 'editar';
  this.artigoSelecionado = artigo;
  this.artigoSelecionadoId = artigo.id;

    this.form.patchValue({
      nome: artigo.nome,
      precoUnitario: artigo.preco.toString(),
      categoria: artigo.categoriaId.toString(),
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

   atualizarArtigo(): void {
    if (!this.artigoSelecionadoId) return;

    const payload: Partial<Artigo> = {
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
      descricao: this.form.value.descricao || 'N/A'
    };

    this.loading = true;
    this.artigoService.atualizarArtigo(this.artigoSelecionadoId, payload)
      .pipe(finalize(() => (this.loading = false)))
      .subscribe({
        next: () => {
          Swal.fire({
            icon: 'success',
            title: 'Atualizado!',
            text: 'Artigo atualizado com sucesso!',
            timer: 2000,
            showConfirmButton: false
          });
          this.fecharModal();
          this.carregarArtigos();
        },
        error: (err) => {
          console.error('Erro ao atualizar artigo:', err);
        }
      });
  }


excluirArtigo(id: number): void {
  Swal.fire({
    title: 'Tem certeza?',
    text: 'Deseja realmente excluir este artigo?',
    icon: 'warning',
    showCancelButton: true,
    confirmButtonText: 'Sim, excluir!',
    cancelButtonText: 'Cancelar'
  }).then((result) => {
    if (result.isConfirmed) {
      this.artigoService.deletarArtigo(id).subscribe({
        next: () => {
          this.carregarArtigos();
          this.toastr.success('Artigo excluído com sucesso!');
        },
        error: (err) => {
            console.error('Erro ao excluir artigo:', err);
            Swal.fire({
            icon: 'error',
            title: 'Erro!',
            text: 'Erro ao excluir artigo. Tente novamente.',
            timer: 2000,
            showConfirmButton: false
            });
        }
      });
    }
  });
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

  // IVA
  { valor: 0.14, nome: ' 14% (taxa geral)' },
  { valor: 0.07, nome: ' 7% (reduzida)' },
  { valor: 0.05, nome: ' 5% (cesta básica)' },
  { valor: 0.01, nome: ' 1% (Cabinda)' },

  // Imposto Industrial
  { valor: 0.25, nome: ' 25% (geral)' },
  { valor: 0.10, nome: ' 10% (agropecuária)' },
  { valor: 0.35, nome: ' 35% (setores especiais)' },

  // IRT
  { valor: 0.25, nome: ' 25% (Grupos B e C)' },

  // IAC
  { valor: 0.15, nome: ' 15% (juros)' },
  { valor: 0.10, nome: ' 10% (dividendos)' },
  { valor: 0.05, nome: ' 5%' },

  // IP
  { valor: 0.005, nome: ' 0,5% (padrão)' },
  { valor: 0.001, nome: ' 0,1% (residencial)' },
  { valor: 0.006, nome: ' 0,6% (terrenos)' },
  { valor: 0.25, nome: ' 25% (renda)' },

  // Outros
  { valor: 0.02, nome: ' Sisa – 2%' },
];


getNomesImpostos(valor: number): string[] {
  return this.impostos
    .filter(i => i.valor === valor)
    .map(i => i.nome);
}



}
