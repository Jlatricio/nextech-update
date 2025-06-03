
import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { TitleService } from '../../../../core/services/title.service';

@Component({
  selector: 'app-documentos',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './documento.component.html',
  styleUrl: './documento.component.scss',
})
export class DocumentosComponent {
  desativarBotoes = true;
  aba: string = 'facturas';
  constructor(private router: Router, private titleService: TitleService) {}


  ngOnInit(): void {
    this.titleService.setTitle('Documentos');
  }

}
