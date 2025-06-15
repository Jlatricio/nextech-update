import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { NavigationEnd, Router, RouterModule, RouterOutlet } from '@angular/router';
import { SidebarComponent } from './shared/components/sidebar/sidebar.component';
import { HeaderComponent } from './shared/components/header/header.component';
import { filter } from 'rxjs';
import { StartupComponentComponent } from "./shared/startup-component/startup-component.component";
import { TopLoadingBarComponent } from './shared/top-loading-bar/top-loading-bar/top-loading-bar.component';
import { NetworkService } from './core/services/network.service';
import Swal from 'sweetalert2';


@Component({
  selector: 'app-root',
  imports: [TopLoadingBarComponent,CommonModule, RouterOutlet, SidebarComponent, HeaderComponent, RouterModule, StartupComponentComponent],
   standalone: true,
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  carregando = true;
    private alertShown = false;


  title = 'nextech-front';

  mostrarLayout = true;

  constructor(private router: Router,
    private networkService: NetworkService

  ) {
    this.router.events
      .pipe(filter(event => event instanceof NavigationEnd))
      .subscribe((event: any) => {
        const rotaAtual = event.url;
        this.mostrarLayout = rotaAtual !== '/login';
      });
  }



ngOnInit() {
  setTimeout(() => {
    this.carregando = false;
  }, 1500);

   this.networkService.isOnline.subscribe(status => {
      if (!status && !this.alertShown) {
        this.alertShown = true;
        Swal.fire({
          icon: 'warning',
          title: 'Sem Conexão',
          text: 'Você está offline. Verifique sua conexão com a internet.',
          allowOutsideClick: false,
          allowEscapeKey: false,
          showConfirmButton: false
        });
      } else if (status && this.alertShown) {
        this.alertShown = false;
        Swal.fire({
          icon: 'success',
          title: 'Conectado!',
          text: 'A conexão com a internet foi restabelecida.',
          timer: 2000,
          showConfirmButton: false
        });
      }
    });
  }
}
