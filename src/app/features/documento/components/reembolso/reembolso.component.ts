import { Component } from '@angular/core';
import { DocumentoService } from '../../service/documento.service';

@Component({
  selector: 'app-reembolso',
  imports: [],
  templateUrl: './reembolso.component.html',
  styleUrl: './reembolso.component.scss'
})
export class ReembolsoComponent {
constructor(private DocumentoService: DocumentoService) { }


}
