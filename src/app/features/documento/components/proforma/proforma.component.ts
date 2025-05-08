import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { TitleService } from '../../../../core/services/title.service';

@Component({
  selector: 'app-proforma',
  imports: [],
  templateUrl: './proforma.component.html',
  styleUrl: './proforma.component.scss'
})
export class ProformaComponent {
  constructor(private router: Router, private titleService: TitleService) {}


  ngOnInit(): void {
    this.titleService.setTitle('Criar uma Proforma');
  }
}
