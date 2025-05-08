import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { TitleService } from '../../../../core/services/title.service';

@Component({
  selector: 'app-factura',
  imports: [],
  templateUrl: './factura.component.html',
  styleUrl: './factura.component.scss'
})
export class FacturaComponent {
  constructor(private router: Router, private titleService: TitleService) {}


  ngOnInit(): void {
    this.titleService.setTitle('Criar uma Factura');
  }
}
