import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-artigos',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './artigos.component.html',
  styleUrl: './artigos.component.scss',
})
export class ArtigosComponent {
  activeChoice: string = 'artigo';

  setActive(choice: string) {
    this.activeChoice = choice;
  }
}
