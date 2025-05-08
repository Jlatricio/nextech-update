import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { TitleService } from '../../../../core/services/title.service';

@Component({
  selector: 'app-recibo',
  imports: [],
  templateUrl: './recibo.component.html',
  styleUrl: './recibo.component.scss'
})
export class ReciboComponent {
  constructor(private router: Router, private titleService: TitleService) {}


  ngOnInit(): void {
    this.titleService.setTitle('Criar um recibo');
  }
}
