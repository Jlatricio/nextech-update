import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { AuthService } from './Auth/auth.service';
import { Router } from '@angular/router';
import { TitleService } from '../../core/services/title.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss'
})
export class LoginComponent {
  email: string = '';
  senha: string = '';

  constructor(private authService: AuthService, private router: Router,  private titleService: TitleService) {}
  ngOnInit(): void {
    this.titleService.setTitle('Login');
  }


  login() {
    this.authService.login(this.email, this.senha, { email: this.email, senha: this.senha }).subscribe(
      (response) => {
        // Handle successful login here
        console.log('Login successful', response);
        this.router.navigate(['/home']); // Redirect to home or another page
      },
      (error) => {
        // Handle login error here
        console.error('Login failed', error);
      }
    );
}

ngAfterViewInit() {
  const signInBtn = document.querySelector("#sign-in-btn") as HTMLElement;
  const signUpBtn = document.querySelector("#sign-up-btn") as HTMLElement;
  const container = document.querySelector(".container") as HTMLElement;

  if (signUpBtn && container) {
    signUpBtn.addEventListener("click", () => {
      container.classList.add("sign-up-mode");
    });
  }

  if (signInBtn && container) {
    signInBtn.addEventListener("click", () => {
      container.classList.remove("sign-up-mode");
    });
  }
}



}
