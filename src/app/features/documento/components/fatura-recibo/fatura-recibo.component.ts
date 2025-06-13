import { FacturaRecibo } from './interface/facturarecibo';
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
import { ActivatedRoute, Router } from '@angular/router';
import Swal from 'sweetalert2';

import { FacturareciboService } from './service/facturarecibo.service';


@Component({
  selector: 'app-fatura-recibo',
  standalone: true,
  imports: [CommonModule,FormsModule],
  templateUrl: './fatura-recibo.component.html',
  styleUrls: ['./fatura-recibo.component.scss']
})
export class FaturaReciboComponent {
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
dataValidadeISO: string = '';
dataValidadeFormatada: string = '';

form: FormGroup;
  isLoading: boolean = false;

  constructor(
    private FacturareciboService: FacturareciboService,
    private ClienteService: ClienteService,
    private artigoService: ArtigoService,
    private categoriaService: CategoriaService,
    private titleService: TitleService,
    private cdr: ChangeDetectorRef,
    private ngZone: NgZone,
    private empresaService: EmpresaService,
    private toastr: ToastrService,
     private formBuilder: FormBuilder,
    private router: Router,
  private route: ActivatedRoute) {
    this.form = this.formBuilder.group({
      nome: ['', [Validators.required, Validators.minLength(3)]],
      email: ['', [Validators.required, Validators.email]],
     nif: ['', [
    Validators.required,
    Validators.pattern(/^\d{9}[A-Z]{2}\d{3}$/)
  ]],
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
    Swal.fire({
      icon: 'warning',
      title: 'Atenção',
      text: 'Selecione um cliente para continuar.'
    });
    return false;
  }
  return true;
}

validarItens(): boolean {
  if (this.itens.length === 0) {
    Swal.fire({
      icon: 'warning',
      title: 'Atenção',
      text: 'Adicione pelo menos um item.'
    });
    return false;
  }

  for (const [index, item] of this.itens.entries()) {
    if (!item.categoriaId) {
      Swal.fire({
        icon: 'warning',
        title: 'Atenção',
        text: `Selecione uma categoria no item ${index + 1}.`
      });
      return false;
    }
    if (!item.artigoId) {
      Swal.fire({
        icon: 'warning',
        title: 'Atenção',
        text: `Selecione um artigo no item ${index + 1}.`
      });
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
    Swal.fire({
      icon: 'warning',
      title: 'Atenção',
      text: 'Complete os dados da empresa antes de continuar.',
      showCancelButton: true,
      confirmButtonText: 'Configurar agora',
      cancelButtonText: 'Cancelar'
    }).then((result) => {
      if (result.isConfirmed) {
        this.redirecionarParaConfiguracoes();
      }
    });
    return;
  }

  // Valida cliente
  if (!this.clienteSelecionado || !this.clienteSelecionado.id) {
    Swal.fire({
      icon: 'warning',
      title: 'Cliente não selecionado',
      text: 'Por favor, selecione um cliente antes de salvar.'
    });
    return;
  }

  // Valida se há itens
  if (!this.itens.length) {
    Swal.fire({
      icon: 'warning',
      title: 'Sem itens',
      text: 'Adicione ao menos um item à fatura.'
    });
    return;
  }

  // Verifica se algum item está incompleto
  const itemInvalido = this.itens.find(item =>
    !item.artigoId || item.quantidade <= 0 || item.total <= 0
  );

  if (itemInvalido) {
    Swal.fire({
      icon: 'warning',
      title: 'Item inválido',
      text: 'Todos os itens devem conter um artigo, quantidade maior que zero e total válido.'
    });
    return;
  }

  this.isLoading = true;

  // Recalcula totais
  this.recalcularTotais();

  // Monta objeto FacturaRecibo
  const facturaRecibo: FacturaRecibo = {
    tipo: 'FACTURA_RECIBO',
    numero: this.numeroFatura,
    clienteId: this.clienteSelecionado.id,
    dataValidade: this.dataValidadeISO,
    subTotal: this.subtotal,
    totalDescontos: this.descontoValor,
    totalImpostos: this.iva,
    total: this.totalGeral,
    descontoPercentual: this.desconto,
    criadoPor: 'Usuário Atual',
    itensFactura: this.itens.map(item => ({
      artigoId: item.artigoId!,
      quantidade: item.quantidade,
      total: item.total
    }))
  };

  // Envia para API
  this.FacturareciboService.criarFaturaRecibo(facturaRecibo).subscribe({
    next: (res) => {
      this.isLoading = false;
      Swal.fire({
        icon: 'success',
        title: 'Factura Recibo criada com sucesso!',
        timer: 2000,
        showConfirmButton: false
      }).then(() => {
        this.router.navigate(['/documento']);
      });
    },
    error: (err) => {
      this.isLoading = false;
      Swal.fire({
        icon: 'error',
        title: 'Erro ao salvar',
        text: 'Não foi possível criar a Factura Recibo. Tente novamente.'
      });
      console.error(err);
    }
  });
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
  const sequencial = Math.floor(Math.random() * 9000) + 1000;
  this.numeroFatura = `FR ${ano}/${sequencial}`;
}

definirValidade(): void {
  const hoje = new Date();
  const validade = new Date(hoje);
  validade.setDate(validade.getDate() + 30);


 this.dataValidadeISO = validade.toISOString();
this.dataValidadeFormatada = validade.toLocaleDateString('pt-AO', {
  day: '2-digit',
  month: 'short',
  year: 'numeric'
});
}




 ngOnInit(): void {
  this.route.paramMap.subscribe(params => {
    const numero = params.get('numero');
    if (numero) {
      this.numeroFatura = decodeURIComponent(numero);
      console.log('Número recebido (Fatura Recibo):', this.numeroFatura);
    } else {
      console.warn('Nenhum número recebido. Redirecionando...');
      this.router.navigate(['/documento']);
      return;
    }

    this.dados();
    this.definirValidade();
    this.carregarClientes();
    this.titleService.setTitle('Criar uma Fatura Recibo');

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
    this.itens = [...this.itens, novoItem];
    this.cdr.detectChanges();
  }

  removerItem(index: number): void {
    this.itens.splice(index, 1);
    this.itens = [...this.itens];
    this.recalcularTotais();
    this.cdr.detectChanges();
  }

 onCategoriaChange(item: ItemProforma): void {
  item.artigoId = null;
  item.artigoSelecionado = null;
  item.quantidade = 1;
  item.total = 0;
  this.recalcularTotais();
  this.cdr.detectChanges();
}


 onArtigoChange(item: any) {
  item.artigoSelecionado = this.getArtigoById(item.artigoId);
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

