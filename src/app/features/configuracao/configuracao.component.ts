import { CommonModule } from '@angular/common';
import { Component, ElementRef, OnInit, QueryList, ViewChildren } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { TitleService } from '../../core/services/title.service';
import { RouterModule } from '@angular/router';
import { EmpresaService } from './services/empresa.service';
import { Observable } from 'rxjs';
import { Empresa } from './interface/empresa';
import { provideNgxMask } from 'ngx-mask';


@Component({
  selector: 'app-configuracao',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule, ReactiveFormsModule],
  templateUrl: './configuracao.component.html',
  styleUrl: './configuracao.component.scss',
})
export class ConfiguracaoComponent implements OnInit{
  empresa!: Empresa;
  loading = false;
   form: FormGroup;
   formConta: FormGroup;
     aba: 'configuracao' | 'subscribe' | 'contas' | 'ajuda' | 'tutoriais' | 'termos' = 'configuracao';

     constructor(
    private titleService: TitleService,
    private empresaService: EmpresaService,
    private formBuilder: FormBuilder,
  ) {
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


    // Inicializa o formulário com os dados da empresa
      this.formConta = this.formBuilder.group({
      // campos originais do artigo...
      nome: ['', Validators.required],
      categoria: ['', Validators.required],
      tipo: ['', Validators.required],

      imposto: ['', Validators.required],
      precoUnitario: ['', Validators.required],
      descricao: [''],

      // novos campos bancários
      banco: ['', Validators.required],
      iban: [''],
      numeroConta: [''],
      titular: [''],
      gestorConta: [''],
      telefone: [''],
      email: ['', Validators.email],
      dependencia: [''],
      endereco: [''],
      bancoPadrao: [false]
    });


  }

  fields = [
  {
    id: 'nomeEmpresa',
    name: 'nome',
    label: 'Nome da empresa',
    placeholder: 'Ex: Nextech Lda',
    type: 'text',
    error: 'Nome obrigatório (mín. 3 caracteres)'
  },
  {
    id: 'nif',
    name: 'nif',
    label: 'NIF',
    placeholder: 'Ex: 999999999AA999',
    type: 'text',
    error: 'NIF deve ter 9 dígitos, 2 letras e 3 dígitos (Ex: 999999999AA999)'
  },
  {
    id: 'endereco',
    name: 'endereco',
    label: 'Endereço',
    placeholder: 'Ex: Rua Principal, 100',
    type: 'text',
    error: 'Endereço é obrigatório'
  },
  {
    id: 'telefone',
    name: 'telefone',
    label: 'Nº de telefone da empresa',
    placeholder: 'Ex: 923000000',
    type: 'tel',
    error: 'Telefone deve ter 9 dígitos'
  },
  {
    id: 'email',
    name: 'email',
    label: 'Email',
    placeholder: 'Ex: exemplo@empresa.com',
    type: 'email',
    error: 'Email é obrigatório e deve ser válido'
  }
];

isInvalid(controlName: string): boolean {
  const control = this.form.get(controlName);
  return !!(control && control.invalid && (control.touched || control.dirty));
}



dados(): void {
  this.empresaService.empresadados().subscribe({
    next: (res) => {
      if (res) {
        this.empresa = res;
        this.form.patchValue(this.empresa);
      }
    },
    error: (err) => {
      console.error('Erro ao buscar dados da empresa:', err);
    }
  });
}


salvarEmpresa(): void {
  if (this.form.invalid) {
    this.form.markAllAsTouched();
    return;
  }

  // Clona o valor do formulário para evitar modificar o original
  const empresa: Empresa = { ...this.form.value };

  // Adiciona o prefixo +244 ao telefone
  if (empresa.telefone && !empresa.telefone.startsWith('+244')) {
    empresa.telefone = `+244${empresa.telefone}`;
  }

  this.empresaService.atualizadados(empresa).subscribe({
    next: (res) => {
      console.log('Empresa salva com sucesso:', res);
      this.dados(); // Atualiza os dados na tela após salvar
    },
    error: (err) => {
      console.error('Erro ao salvar empresa:', err);
    }
  });
}




ngOnInit(): void {
  this.titleService.setTitle('Configurações');
  this.dados(); // Carrega os dados da empresa ao iniciar o componente
}





onFileSelected($event: Event) {
throw new Error('Method not implemented.');
}
onSubmit() {
throw new Error('Method not implemented.');
}


faqs = [

  {
    question: 'Como posso adquirir uma licença?',
    answer: 'Para obter uma licença, basta entrar em contacto connosco por WhatsApp, email ou chamada. Após escolher o plano ideal, criamos o seu acesso e enviamos um link privado exclusivo para si.',
    open: false
  },
  {
    question: 'Preciso instalar alguma aplicação?',
    answer: 'Não é necessário. O NewTech Contas funciona totalmente online, por meio de um link privado. Não há necessidade de instalar nenhum aplicativo no telemóvel.',
    open: false
  },
  {
    question: 'Tenho que instalar o NewTech Contas no computador?',
    answer: 'Não. O sistema é baseado na nuvem, acessível de qualquer lugar com internet. Para utilizadores sem acesso regular à internet, disponibilizamos uma versão Desktop instalada e configurada pela nossa equipa.',
    open: false
  },
  {
    question: 'Os meus dados estão protegidos?',
    answer: 'Sim. Usamos encriptação de 256 bits para proteger todas as informações, além de backups automáticos semanais para garantir a segurança dos seus dados.',
    open: false
  },
  {
    question: 'Como posso efetuar o pagamento?',
    answer: 'Os pagamentos são feitos por referência EMIS, através do Multicaixa Express, Internet Banking ou diretamente no ATM (Multicaixa).',
    open: false
  },
  {
    question: 'O que acontece se a minha subscrição expirar?',
    answer: 'Caso sua subscrição termine, o acesso será temporariamente suspenso. Basta renovar com qualquer um dos planos disponíveis para recuperar imediatamente o acesso completo.',
    open: false
  },
  {
    question: 'O suporte funciona 24/7?',
    answer: 'Nosso suporte prioritário funciona das 08h às 17h. Fora desse horário, oferecemos suporte secundário via SMS, email ou por meio de respostas automáticas. Também pode contactar o nosso Call Center pelo número +244944272703.',
    open: false
  },
  {
    question: 'Há vídeos explicativos sobre o uso da plataforma?',
    answer: 'Sim, temos um centro de aprendizagem com vídeos tutoriais que ensinam passo a passo como utilizar todas as funcionalidades do NewTech Contas.',
    open: false
  },
  {
    question: 'Quantos utilizadores posso adicionar?',
    answer: 'Pode criar quantos utilizadores forem necessários. Não há limite.',
    open: false
  },
  {
    question: 'Quantos itens posso cadastrar?',
    answer: 'Não impomos limites. Pode cadastrar todos os itens que precisar conforme a sua operação.',
    open: false
  }
];
toggleFaq(index: number) {
  this.faqs = this.faqs.map((faq, i) => ({
    ...faq,
    open: i === index ? !faq.open : false,
  }));
}


  salvarConta() {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    this.loading = true;
    const dados = this.form.value;
    this.loading = false;
  }

  ngAfterViewInit() {
      setTimeout(() => this.updateIndicator(), 0);
    }

    @ViewChildren('tab', { read: ElementRef }) tabs!: QueryList<ElementRef>;

indicatorLeft = '0px';
indicatorWidth = '0px';




selecionarAba( aba: 'configuracao' | 'subscribe' | 'contas' | 'ajuda' | 'tutoriais' | 'termos' = 'configuracao', event: Event) {
  this.aba = aba;

  // Aguarda DOM atualizar para então calcular posição do background
  setTimeout(() => this.updateIndicator(), 0);
}


updateIndicator() {
  const activeIndex = ['proformas', 'facturas', 'fr'].indexOf(this.aba);
  const tabElements = this.tabs.toArray();
  const activeTab = tabElements[activeIndex]?.nativeElement;

  if (activeTab) {
    const parentRect = activeTab.parentElement.getBoundingClientRect();
    const rect = activeTab.getBoundingClientRect();
    this.indicatorLeft = `${rect.left - parentRect.left}px`;
    this.indicatorWidth = `${rect.width}px`;
  }

}

}
