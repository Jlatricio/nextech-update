<<<<<<< HEAD
import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet],
=======
import { ApplicationModule, Component } from '@angular/core';
import { NavigationEnd, Router, RouterModule, RouterOutlet } from '@angular/router';
import { SidebarComponent } from "./shared/components/sidebar/sidebar.component";
import { HeaderComponent } from "./shared/components/header/header.component";
import { filter } from 'rxjs';
import { CommonModule } from '@angular/common';


@Component({
  selector: 'app-root',
  imports: [CommonModule,RouterOutlet, SidebarComponent, HeaderComponent, RouterModule],
>>>>>>> minha-nova-feature
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent {
<<<<<<< HEAD
  title = 'nextech-front';
=======
  mostrarLayout = true;

  constructor(private router: Router) {
    this.router.events
      .pipe(filter(event => event instanceof NavigationEnd))
      .subscribe((event: any) => {
        const rotaAtual = event.url;
        this.mostrarLayout = rotaAtual !== '/login', '/criar-conta';
      });
  }
>>>>>>> minha-nova-feature
}
