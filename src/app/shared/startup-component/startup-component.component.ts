import { Component, OnInit } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import  {jwtDecode} from 'jwt-decode';

@Component({
  selector: 'app-startup-component',
  standalone: true,
  imports: [RouterModule],
  templateUrl: './startup-component.component.html',
  styleUrls: ['./startup-component.component.scss']
})
export class StartupComponentComponent implements OnInit {
  loading = true;

  constructor(private router: Router) {}

  ngOnInit(): void {
    if (typeof window !== 'undefined') {
      const token = localStorage.getItem('token');

      if (token) {
        try {
          const decoded: any = jwtDecode(token);
          const exp = decoded.exp;
          const now = Math.floor(Date.now() / 1000);

          if (exp > now) {
            // Token válido
            this.router.navigate(['/inicio'], { replaceUrl: true });
            return;
          } else {
            // Token expirado
            this.router.navigate(['/login'], { replaceUrl: true });
            return;
          }
        } catch (e) {
          // Token inválido
          this.router.navigate(['/login'], { replaceUrl: true });
          return;
        }
      } else {
        // Sem token
        this.router.navigate(['/login'], { replaceUrl: true });
        return;
      }
    }

    // Se chegou aqui, não redirecionou, então para loading
    this.loading = false;
  }
}
