import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { TitleService } from '../../core/services/title.service';


@Component({
  selector: 'app-configuracao',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './configuracao.component.html',
  styleUrl: './configuracao.component.scss',
})
export class ConfiguracaoComponent {
constructor(private titleService: TitleService){}
ngOnInit(): void {
  this.titleService.setTitle('Configurações');
}


  dadosEmpresa = {
    nome: 'Nextech Lda',
    nif: '999999999',
    endereco: 'Luanda - Angola',
    regimeIva: 'Regime Geral',
    telefone: '923000000',
    email: 'contato@nextech.com',
    logoUrl: 'assets/logo.png'
  };


onFileSelected($event: Event) {
throw new Error('Method not implemented.');
}
onSubmit() {
throw new Error('Method not implemented.');
}
aba: string = 'configuracao';

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
    open: i === index ? !faq.open : false, // só abre um por vez
  }));
}


}
