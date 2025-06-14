import { Component, OnInit, AfterViewInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule, FormsModule } from '@angular/forms';
import { NgxMaskDirective, provideNgxMask } from 'ngx-mask';
import { Artigo } from '../../interface/artigo';
import { finalize } from 'rxjs';
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
  imports: [
    NgxMaskDirective,
    ReactiveFormsModule,
    CommonModule,
    FormsModule,
    RouterModule,
    BsDropdownModule,
  ],
  providers: [provideNgxMask()],
  templateUrl: './artigo.component.html',
  styleUrls: ['./artigo.component.scss'],
})
export class ArtigoComponent implements OnInit, AfterViewInit {


  loading: boolean = false;
  form: FormGroup;
  categoriaForm!: FormGroup;
  artigos: Artigo[] = [];
  artigoSelecionadoId: number | null = null;
  artigoSelecionado: Artigo | null = null;
  artigoOriginal: Artigo | null = null;
  categorias: { id: number; nome: string }[] = [];
  mostrarCampoNovaCategoria = false;
  novaCategoria = '';
  modoEdicao = false;
  modalModo: 'criar' | 'editar' = 'criar';

  filtro = {
    Categorias: '',
    mes: '',
    tipo: '',
  };
  filtroNomeCategoriaSelecionada = 'Todos';
  searchTerm: string = '';

  descricao: string = '';
  descricaoRestante: number = 300;

  impostos = [
    { valor: 0, nome: 'Nenhum imposto' },
    // IVA
    { valor: 0.14, nome: ' 14% (taxa geral)' },
    { valor: 0.07, nome: ' 7% (reduzida)' },
    { valor: 0.05, nome: ' 5% (cesta básica)' },
    { valor: 0.01, nome: ' 1% (Cabinda)' },
    // Imposto Industrial
    { valor: 0.25, nome: ' 25% (geral)' },
    { valor: 0.1, nome: ' 10% (agropecuária)' },
    { valor: 0.35, nome: ' 35% (setores especiais)' },
    // IRT
    { valor: 0.25, nome: ' 25% (Grupos B e C)' },
    // IAC
    { valor: 0.15, nome: ' 15% (juros)' },
    { valor: 0.1, nome: ' 10% (dividendos)' },
    { valor: 0.05, nome: ' 5%' },
    // IP
    { valor: 0.005, nome: ' 0,5% (padrão)' },
    { valor: 0.001, nome: ' 0,1% (residencial)' },
    { valor: 0.006, nome: ' 0,6% (terrenos)' },
    { valor: 0.25, nome: ' 25% (renda)' },
    // Outros
    { valor: 0.02, nome: ' Sisa – 2%' },
  ];

  constructor(
    private formBuilder: FormBuilder,
    private artigoService: ArtigoService,
    private titleService: TitleService,
    private categoriaService: CategoriaService,
    private toastr: ToastrService
  ) {
    // Inicializa o form principal
    this.form = this.formBuilder.group({
      nome: ['', [Validators.required, Validators.minLength(3)]],
      precoUnitario: [
        '',
        [Validators.required, Validators.pattern(/^\d+([.,]\d{1,2})?$/)],
      ],
      categoria: ['', Validators.required],
      imposto: [0, Validators.required],
      tipo: ['', Validators.required],
      descricao: ['', [Validators.maxLength(300)]],
    });
    // Form de nova categoria
    this.categoriaForm = this.formBuilder.group({
      nome: [''],
    });
  }

  ngOnInit(): void {
    this.titleService.setTitle('Artigos');
    this.carregarCategorias();
    this.carregarArtigos();

    // Controla contagem de caracteres de descrição
    this.form.get('descricao')?.valueChanges.subscribe((value: string) => {
      this.descricao = value;
      this.descricaoRestante = 300 - (value?.length || 0);
    });
  }

  ngAfterViewInit(): void {
    this.descricaoRestante = 300 - (this.descricao?.length || 0);
  }

  // Propriedade para filtro na exibição
  get artigosFiltrados(): Artigo[] {
    let resultado = this.artigos;
    const termo = this.searchTerm?.trim().toLowerCase();
    const categoriaSelecionada = this.filtro?.Categorias;
    if (termo) {
      resultado = resultado.filter((a) =>
        a.nome?.toLowerCase().includes(termo)
      );
    }
    if (categoriaSelecionada) {
      resultado = resultado.filter(
        (a) => a.categoria?.id === Number(categoriaSelecionada)
      );
    }
    return resultado;
  }

  selecionarCategoria(id: string, nome: string) {
    this.filtro.Categorias = id;
    this.filtroNomeCategoriaSelecionada = nome;
  }

  filtrar(): void {
    this.loading = true;
    this.artigoService.listarArtigo().subscribe({
      next: (artigos) => {
        this.categoriaService.listarCategorias().subscribe({
          next: (categorias) => {
            const artigosComCategoria = artigos.map((a) => ({
              ...a,
              categoria: categorias.find((c) => c.id === a.categoriaId),
            }));
            if (this.filtro.Categorias) {
              this.artigos = artigosComCategoria.filter(
                (a) =>
                  a.categoria &&
                  a.categoria.id === Number(this.filtro.Categorias)
              );
            } else {
              this.artigos = artigosComCategoria;
            }
            this.loading = false;
          },
          error: () => {
            this.loading = false;
          },
        });
      },
      error: () => {
        this.loading = false;
      },
    });
  }

  carregarArtigos(): void {
    this.artigoService.listarArtigo().subscribe({
      next: (artigos) => {
        this.categoriaService.listarCategorias().subscribe({
          next: (categorias) => {
            this.artigos = artigos.map((a) => ({
              ...a,
              categoria: categorias.find((c) => c.id === a.categoriaId),
            }));
          },
          error: (err) => {
            console.error(
              'Erro ao listar categorias dentro de carregarArtigos:',
              err
            );
          },
        });
      },
      error: (err) => {
        console.error('Erro ao listar artigos:', err);
      },
    });
  }

  carregarCategorias(): void {
    this.categoriaService.listarCategorias().subscribe({
      next: (data) => {
        this.categorias = data;
      },
      error: (err) => {
        console.error('Erro ao carregar categorias:', err);
      },
    });
  }

    // Chama abrirModal para criar:
  abrirCriarArtigo(): void {
    this.modalModo = 'criar';
    this.artigoSelecionado = null;
    this.artigoSelecionadoId = null;
    this.artigoOriginal = null;
    this.modoEdicao = false;
    this.resetarFormulario();
    // Ajustes iniciais, p.ex. imposto padrão:
    this.form.get('imposto')?.setValue(0);
    this.descricaoRestante = 300;
    // Abre modal após garantir renderização:
    setTimeout(() => this.abrirModal('exampleModal'), 0);
  }

    salvarArtigo(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }
    this.loading = true;
    // Prepara objeto parcial:
    let descricao = this.form.value.descricao?.trim();
    if (!descricao) descricao = 'N/A';
    const artigoPayload: Partial<Artigo> = {
      nome: this.form.value.nome.trim(),
      preco: parseFloat(
        String(this.form.value.precoUnitario)
          .replace('Kz ', '')
          .replace(/\./g, '')
          .replace(',', '.')
      ),
      categoriaId: Number(this.form.value.categoria),
      impostoAplicado: parseFloat(String(this.form.value.imposto)),
      tipo: this.form.value.tipo,
      descricao,
    };
    this.artigoService.criarArtigo(artigoPayload).subscribe({
      next: res => {
        Swal.fire({
          icon: 'success',
          title: 'Sucesso!',
          text: 'Artigo criado com sucesso!',
          timer: 2000,
          showConfirmButton: false,
        });
        // Fecha modal, limpa e recarrega
        this.fecharModal('exampleModal');
        this.resetarFormulario();
        this.carregarArtigos();
      },
      error: err => {
        console.error('Erro ao criar artigo:', err);
        Swal.fire({
          icon: 'error',
          title: 'Erro!',
          text: err.error?.message || 'Erro ao criar artigo.',
          timer: 3000,
          showConfirmButton: false,
        });
      },
      complete: () => {
        this.loading = false;
      }
    });
  }

  editarArtigo(artigo: Artigo): void {
    this.artigoOriginal = { ...artigo };
    this.artigoSelecionado = artigo;
    this.artigoSelecionadoId = artigo.id!;
    this.modoEdicao = true;
    this.modalModo = 'editar';

    // Preenche o form:
    this.form.patchValue({
      nome: artigo.nome,
      precoUnitario: artigo.preco.toString(),
      categoria: artigo.categoriaId.toString(),
      imposto: artigo.impostoAplicado,
      tipo: artigo.tipo,
      descricao: artigo.descricao,
    });
    this.descricaoRestante = artigo.descricao ? 300 - artigo.descricao.length : 300;

    // Abre modal:
    setTimeout(() => this.abrirModal('exampleModal'), 0);
  }

 atualizarArtigo(): void {
    if (this.form.invalid) {
      Swal.fire('Atenção', 'Preencha todos os campos obrigatórios.', 'warning');
      return;
    }
    if (!this.artigoSelecionadoId) {
      console.error('ID do artigo não definido para atualização.');
      this.loading = false;
      return;
    }
    // Pega valores do form:
    const nomeForm = this.form.value.nome?.trim();
    const precoParsed = parseFloat(
      String(this.form.value.precoUnitario)
        .replace('Kz ', '')
        .replace(/\./g, '')
        .replace(',', '.')
    );
    const categoriaIdParsed = Number(this.form.value.categoria);
    const impostoParsed = parseFloat(String(this.form.value.imposto));
    const tipoForm: string = this.form.value.tipo;
    const descricaoForm = this.form.value.descricao?.trim() || 'N/A';

    // Compara com original:
    if (this.modoEdicao && this.artigoOriginal) {
      const originalComparable = {
        nome: this.artigoOriginal.nome,
        preco: this.artigoOriginal.preco,
        categoriaId: this.artigoOriginal.categoriaId,
        impostoAplicado: this.artigoOriginal.impostoAplicado,
        tipo: this.artigoOriginal.tipo,
        descricao: this.artigoOriginal.descricao,
      };
      const atualizadoComparable = {
        nome: nomeForm,
        preco: precoParsed,
        categoriaId: categoriaIdParsed,
        impostoAplicado: impostoParsed,
        tipo: tipoForm,
        descricao: descricaoForm,
      };
      if (JSON.stringify(originalComparable) === JSON.stringify(atualizadoComparable)) {
        Swal.fire({
          icon: 'info',
          title: 'Sem alterações!',
          text: 'Nenhuma modificação foi detectada nos dados do artigo.',
          timer: 2000,
          showConfirmButton: false,
        });
        this.loading = false;
        return;
      }
    }

    const payload: Partial<Artigo> = {
      nome: nomeForm,
      preco: precoParsed,
      categoriaId: categoriaIdParsed,
      impostoAplicado: impostoParsed,
      tipo: tipoForm,
      descricao: descricaoForm,
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
            showConfirmButton: false,
          });
          this.fecharModal('exampleModal');
          this.resetarFormulario();
          this.carregarArtigos();
        },
        error: err => {
          if (err.error?.message?.includes('No changes detected')) {
            Swal.fire({
              icon: 'info',
              title: 'Sem alterações no servidor!',
              text: 'O servidor não detectou mudanças no artigo.',
              timer: 2000,
              showConfirmButton: false,
            });
          } else {
            console.error('Erro ao atualizar artigo:', err);
            Swal.fire({
              icon: 'error',
              title: 'Erro!',
              text: err.error?.message || 'Erro ao atualizar artigo.',
              timer: 3000,
              showConfirmButton: false,
            });
          }
        }
      });
  }


  abrirModalParaCriarArtigo(): void {
    this.resetarFormulario(); // limpa o formulário de artigo
    this.modoEdicao = false;
    this.artigoSelecionadoId = null;
    this.artigoSelecionado = null;
    this.artigoOriginal = null;
    this.modalModo = 'criar';
    this.form.get('imposto')?.setValue(0);
    this.descricaoRestante = 300;
    // Abre modal de artigo
  }


  excluirArtigo(id: number): void {
    Swal.fire({
      title: 'Tem certeza?',
      text: 'Deseja realmente excluir este artigo?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Sim, excluir!',
      cancelButtonText: 'Cancelar',
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
              showConfirmButton: false,
            });
          },
        });
      }
    });
  }


  resetarFormulario(): void {
    this.form.reset();
    this.artigoSelecionadoId = null;
    this.artigoSelecionado = null;
    this.artigoOriginal = null;
  }

  onCategoriaSubmit(): void {
    if (this.categoriaForm.valid) {
      console.log('Categoria Form Data:', this.categoriaForm.value);
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
        this.form.get('categoria')?.setValue(categoriaCriada.id.toString());
        this.novaCategoria = '';
        this.mostrarCampoNovaCategoria = false;
      },
      error: (err) => {
        console.error('Erro ao criar categoria:', err);
      },
    });
  }
  // Métodos utilitários:
  abrirModal(id: string): void {
    // Garante instância única ou cria nova
    const modalElement = document.getElementById(id);
    if (modalElement) {
      const modalInstance = Modal.getInstance(modalElement) || new Modal(modalElement);
      modalInstance.show();
    } else {
      console.warn(`Modal com id="${id}" não encontrado no DOM.`);
    }
  }

  fecharModal(id: string): void {
    const modalElement = document.getElementById(id);
    if (modalElement) {
      const modalInstance = Modal.getInstance(modalElement);
      modalInstance?.hide();
    } else {
      console.warn(`Modal com id="${id}" não encontrado no DOM.`);
    }
  }

  getNomesImpostos(valor: number): string[] {
    return this.impostos.filter((i) => i.valor === valor).map((i) => i.nome);
  }

    getPrimeiroEUltimoNome(nomeCompleto: string): string {
  const nomes = nomeCompleto.trim().split(/\s+/);
  if (nomes.length === 1) return nomes[0];
  return `${nomes[0]} ${nomes[nomes.length - 1]}`;
}


  onSubmitArtigo(): void {
    if (this.modalModo === 'criar') {
      this.salvarArtigo();
    } else {
      this.atualizarArtigo();
    }
  }
}
