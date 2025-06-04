import { ChangeDetectorRef, Component, OnInit, NgZone } from '@angular/core';
import { TitleService } from '../../../../core/services/title.service';
import { CategoriaService } from '../../../artigo/service/categoria.service';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, FormsModule, Validators } from '@angular/forms';
import { ArtigoService } from '../../../artigo/service/artigo.service';
import { Artigo } from '../../../artigo/interface/artigo';
import { ItemProforma } from '../../../documento/interface/ItemProforma';
import { ClienteService } from '../../../clientes/service/cliente.service';
import { Cliente } from '../../../clientes/interface/cliente';
import { EmpresaService } from '../../../configuracao/services/empresa.service';
import { Empresa } from '../../../configuracao/interface/empresa';
import { ToastrService } from 'ngx-toastr';
import { Router } from '@angular/router';

@Component({
  selector: 'app-proforma',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './proforma.component.html',
  styleUrls: ['./proforma.component.scss']
})
export class ProformaComponent implements OnInit {
  categorias: { id: number, nome: string }[] = [];
  cliente: Cliente[] = [];
  clienteSelecionado: Cliente | null = null;
  artigos: Artigo[] = [];
  itens: ItemProforma[] = [];
  desconto: number = 0;
  numeroFatura: string = '';
dataValidade: string = '';
empresa!: Empresa;
  subtotal = 0;
iva = 0;
descontoValor = 0;
totalGeral = 0;
form: FormGroup;

  constructor(
    private ClienteService: ClienteService,
    private artigoService: ArtigoService,
    private categoriaService: CategoriaService,
    private titleService: TitleService,
    private cdr: ChangeDetectorRef,
    private ngZone: NgZone,
    private empresaService: EmpresaService,
    private toastr: ToastrService,
     private formBuilder: FormBuilder,
    private router: Router) {
    this.form = this.formBuilder.group({
      nome: ['', [Validators.required, Validators.minLength(3)]],
      email: ['', [Validators.required, Validators.email]],
      nif: ['', [Validators.required, Validators.pattern(/^\d{9}$/)]],
      endereco: ['', Validators.required],
      telefone: ['', [Validators.required, Validators.pattern(/^\d{9}$/)]],
    });
  }

  verificarDadosEmpresa(): boolean {
  const empresa = this.empresa;
  return !!empresa &&
    empresa.nome !== undefined && empresa.nome !== '' &&
    empresa.email !== undefined && empresa.email !== '' &&
    empresa.nif !== undefined && empresa.nif !== '' &&
    empresa.endereco !== undefined && empresa.endereco !== '' &&
    empresa.telefone !== undefined && empresa.telefone !== '';
}

validarCliente(): boolean {
  if (!this.clienteSelecionado) {
    this.toastr.warning('Selecione um cliente para continuar.', 'Atenção');
    return false;
  }
  return true;
}

validarItens(): boolean {
  if (this.itens.length === 0) {
    this.toastr.warning('Adicione pelo menos um item.', 'Atenção');
    return false;
  }

  for (const [index, item] of this.itens.entries()) {
    if (!item.categoriaId) {
      this.toastr.warning(`Selecione uma categoria no item ${index + 1}.`, 'Atenção');
      return false;
    }
    if (!item.artigoId) {
      this.toastr.warning(`Selecione um artigo no item ${index + 1}.`, 'Atenção');
      return false;
    }
    if (!item.quantidade || item.quantidade < 1) {
      this.toastr.warning(`Informe uma quantidade válida no item ${index + 1}.`, 'Atenção');
      return false;
    }
  }
  return true;
}


salvarFatura(): void {
  if (!this.verificarDadosEmpresa()) {
    this.toastr.warning('Complete os dados da empresa antes de continuar.', 'Atenção');
    this.mostrarBotaoRedirecionamento = true;
    return;
  }

  if (!this.validarCliente()) {
    return;
  }

  if (!this.validarItens()) {
    return;
  }

  // Caso passe todas as validações, prossiga para salvar a fatura
  // Aqui você pode chamar sua API, mostrar loading, etc.
}


mostrarBotaoRedirecionamento = false;

redirecionarParaConfiguracoes(): void {
  this.ngZone.run(() => {
     this.router.navigate(['/configuracao']);
  });
}






dados(): void {
  this.empresaService.empresadados().subscribe({
    next: (res: Empresa) => {
      if (res) {
        this.empresa = res;
        this.form.patchValue(this.empresa);
      }
    },
    error: (err: any) => {
      console.error('Erro ao buscar dados da empresa:', err);
    }
  });
}


  getArtigoById(id: number | null): any {
  if (id === null || id === undefined) return null;
  return this.artigos.find(artigo => artigo.id === id) || null;
}

carregarClientes(): void {
  this.ClienteService.getCliente().subscribe({
    next: clientes => {
      this.ngZone.run(() => {
        this.cliente = clientes;
        this.cdr.markForCheck();
        this.cdr.detectChanges();
      });
    },
    error: err => console.error('Erro ao carregar clientes:', err)
  });
}

gerarNumeroFatura(): void {
  const ano = new Date().getFullYear();
  const sequencial = Math.floor(Math.random() * 9000) + 1000; // Ex: 4372
  this.numeroFatura = `PP ${ano}/${sequencial}`;
}

definirValidade(): void {
  const hoje = new Date();
  const validade = new Date(hoje);
  validade.setDate(validade.getDate() + 30);
  const opcoes = { day: '2-digit', month: 'short', year: 'numeric' } as const;
  this.dataValidade = validade.toLocaleDateString('pt-AO', opcoes);
}

  ngOnInit(): void {
  this.dados();
      this.gerarNumeroFatura();
  this.definirValidade();
      this.carregarClientes();
    this.titleService.setTitle('Criar uma Proforma');

    this.categoriaService.listarCategorias().subscribe({
      next: categorias => {
        this.ngZone.run(() => {
          this.categorias = categorias;
          this.carregarArtigos();
          this.adicionarItem();
          this.cdr.markForCheck();
          this.cdr.detectChanges();
        });
      },
      error: err => console.error('Erro ao carregar categorias:', err)
    });
  }

  carregarArtigos(): void {
    this.artigoService.listarArtigo().subscribe({
      next: artigos => {
        this.ngZone.run(() => {
          this.artigos = artigos.map(a => ({
            ...a,
            categoria: this.categorias.find(c => c.id === a.categoriaId)
          }));

          this.itens.forEach(item => {
            if (item.artigoId !== null && item.artigoId !== undefined) {
              item.artigoSelecionado = this.artigos.find(a => a.id === Number(item.artigoId)) || null;
              this.calcularTotalItem(item);
            }
          });

          this.recalcularTotais();
          this.cdr.markForCheck();
          this.cdr.detectChanges();
        });
      },
      error: err => console.error('Erro ao carregar artigos:', err)
    });
  }

  getArtigosFiltradosPorCategoria(categoriaId?: number | null): Artigo[] {
    if (!categoriaId) return [];
    return this.artigos.filter(a => a.categoria?.id === categoriaId);
  }

  adicionarItem(): void {
    const novoItem: ItemProforma = {
      categoriaId: null,
      artigoId: null,
      artigoSelecionado: null,
      quantidade: 1,
      total: 0,
      imposto: 0
    };
    this.itens = [...this.itens, novoItem]; // cria novo array (detecção)
    this.cdr.detectChanges();
  }

  removerItem(index: number): void {
    this.itens.splice(index, 1);
    this.itens = [...this.itens]; // recria o array para forçar detecção
    this.recalcularTotais();
    this.cdr.detectChanges();
  }

  onCategoriaChange(item: ItemProforma): void {
    item.artigoId = null;
    item.artigoSelecionado = null;
    item.quantidade = 1;
    item.total = 0;
    this.cdr.detectChanges();
  }

 onArtigoChange(item: any) {
  item.artigoSelecionado = this.getArtigoById(item.artigoId); // ou outra forma de obter o artigo
  this.atualizarTotalItem(item);
  this.recalcularTotais();
}

atualizarQuantidade(item: any, delta: number) {
  const novaQuantidade = item.quantidade + delta;
  if (novaQuantidade < 1) return;
  item.quantidade = novaQuantidade;
  this.atualizarTotalItem(item);
  this.recalcularTotais();
}

atualizarTotalItem(item: any) {
  const preco = item.artigoSelecionado?.preco ?? 0;
  item.total = preco * item.quantidade;
}


  calcularTotalItem(item: ItemProforma): void {
    if (item.artigoSelecionado) {
      const preco = item.artigoSelecionado.preco || 0;
      item.total = preco * item.quantidade;
    } else {
      item.total = 0;
    }
  }

  getSubtotal(): number {
    return this.itens.reduce((sum, item) => sum + item.total, 0);
  }

  getIva(): number {
    return this.getSubtotal() * 0.14;
  }

  getDescontoValor(): number {
    return this.getSubtotal() * (this.desconto / 100);
  }

  getTotalGeral(): number {
    return this.getSubtotal() + this.getIva() - this.getDescontoValor();
  }

recalcularTotais() {
  this.subtotal = this.itens.reduce((acc, item) => acc + (item.total || 0), 0);

  this.iva = this.subtotal * 0.14; // exemplo 14% de imposto

  this.descontoValor = (this.subtotal + this.iva) * (this.desconto / 100);

  this.totalGeral = (this.subtotal + this.iva) - this.descontoValor;
}



  trackByFn(index: number, item: ItemProforma): any {
    return item.artigoId ?? index;
  }
}
