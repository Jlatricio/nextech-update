import { ChangeDetectorRef, Component, OnInit, NgZone } from '@angular/core';
import { TitleService } from '../../../../core/services/title.service';
import { CategoriaService } from '../../../artigo/service/categoria.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ArtigoService } from '../../../artigo/service/artigo.service';
import { Artigo } from '../../../artigo/interface/artigo';
import { ItemProforma } from '../../../documento/interface/ItemProforma';
import { ClienteService } from '../../../clientes/service/cliente.service';
import { Cliente } from '../../../clientes/interface/cliente';

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

  subtotal = 0;
iva = 0;
descontoValor = 0;
totalGeral = 0;

  constructor(
    private ClienteService: ClienteService,
    private artigoService: ArtigoService,
    private categoriaService: CategoriaService,
    private titleService: TitleService,
    private cdr: ChangeDetectorRef,
    private ngZone: NgZone
  ) {}



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
  this.dataValidade = validade.toLocaleDateString('pt-BR', opcoes);
}

  ngOnInit(): void {
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
