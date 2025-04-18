import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { TitleService } from '../../../../core/services/title.service';

@Component({
  selector: 'app-fatura-recibo',
  imports: [],
  templateUrl: './fatura-recibo.component.html',
  styleUrl: './fatura-recibo.component.scss'
})
export class FaturaReciboComponent {
  constructor(private router: Router, private titleService: TitleService) {}


  ngOnInit(): void {
    this.titleService.setTitle('Criar uma fatura/recibo');
  }
}
