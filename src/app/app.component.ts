import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { NavigationEnd, Router, RouterModule, RouterOutlet } from '@angular/router';
import { SidebarComponent } from './shared/components/sidebar/sidebar.component';
import { HeaderComponent } from './shared/components/header/header.component';
import { filter } from 'rxjs';
import { StartupComponentComponent } from "./shared/startup-component/startup-component.component";
import { LoadingBarModule, LoadingBarService } from '@ngx-loading-bar/core';



@Component({
  selector: 'app-root',
  imports: [CommonModule, LoadingBarModule, RouterOutlet, SidebarComponent, HeaderComponent, RouterModule, StartupComponentComponent],
   standalone: true,
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  carregando = true;

ngOnInit() {
  setTimeout(() => {
    this.carregando = false;
  }, 1500);
}


  title = 'nextech-front';

  mostrarLayout = true;

  constructor(private router: Router,
              public loadingBar: LoadingBarService
  ) {
    this.router.events
      .pipe(filter(event => event instanceof NavigationEnd))
      .subscribe((event: any) => {
        const rotaAtual = event.url;
        this.mostrarLayout = rotaAtual !== '/login';
      });
  }

}
