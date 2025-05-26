import { Component, OnInit } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { jwtDecode } from 'jwt-decode';


@Component({
  selector: 'app-startup-component',
  standalone: true,
  imports: [RouterModule],
  templateUrl: './startup-component.component.html',
  styleUrls: ['./startup-component.component.scss']
})
export class StartupComponentComponent implements OnInit {
  constructor(private router: Router) {}

  ngOnInit(): void {
    // Garante que o código só execute no browser
    if (typeof window !== 'undefined') {
      const token = localStorage.getItem('token');

      if (token) {
        try {
          const decoded: any = jwtDecode(token);
          const exp = decoded.exp;
          const now = Math.floor(Date.now() / 1000);

          if (exp > now) {
            this.router.navigate(['/inicio']);
          } else {
            this.router.navigate(['/login']);
          }
        } catch (e) {
          this.router.navigate(['/login']);
        }
      } else {
        this.router.navigate(['/login']);
      }
    }
  }
}
