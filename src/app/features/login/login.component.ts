import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators, AbstractControl, ReactiveFormsModule, FormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { AuthService } from './Auth/auth.service';
import { TitleService } from '../../core/services/title.service';
import { CadastroService } from '../../core/services/cadastro.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [FormsModule, RouterModule, CommonModule, ReactiveFormsModule],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent {
  loginForm: FormGroup;
  registerForm: FormGroup;

  signUpMode = false;
  isLoading = false;
  errorMessage = '';

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router,
    private titleService: TitleService,
    private cadastroService: CadastroService,
  ) {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      senha: ['', Validators.required]
    });

   this.registerForm = this.fb.group({
  nome: ['', Validators.required],
  email: ['', [Validators.required, Validators.email]],
  telefone: ['', [Validators.required, Validators.pattern(/^\d{9}$/)]],
  senha: ['', Validators.required]
});
  }

  toggleSignUpMode(): void {
    this.signUpMode = !this.signUpMode;
    this.errorMessage = '';
  }

  emailOrPhoneValidator(control: AbstractControl) {
    const value = control.value?.trim();
    if (!value) return null;

    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const phonePattern = /^\d{9}$/;

    if (emailPattern.test(value) || phonePattern.test(value)) {
      return null;
    }

    return { invalidInput: true };
  }

  get loginemail() { return this.loginForm.get('email'); }
  get loginsenha() { return this.loginForm.get('senha'); }

  get registerName() { return this.registerForm.get('nome'); }
  get registerEmail() { return this.registerForm.get('email'); }
  get registerTelefone() { return this.registerForm.get('telefone'); }
  get registerPassword() { return this.registerForm.get('senha'); }

  onEmailOrPhoneInput(event: Event): void {
    const input = event.target as HTMLInputElement;
    const value = input.value;

    if (/^\d*$/.test(value)) {
      const onlyNumbers = value.replace(/\D/g, '').slice(0, 9);
      this.loginemail?.setValue(onlyNumbers, { emitEvent: false });
    } else {
      this.loginemail?.setValue(value, { emitEvent: false });
    }
  }
onSubmit(): void {
  const emailLogin = this.loginForm.value.email;
  const senhaLogin = this.loginForm.value.senha;

  this.isLoading = true;
  this.errorMessage = '';

  this.authService.login(emailLogin, senhaLogin).subscribe({
    next: (response) => {
      this.router.navigate(['/inicio']);
    },
    error: (error) => {
      console.error('Login Error:', error);

      if (error.status === 401) {
        this.errorMessage = 'Credenciais inválidas. Verifique seu email e senha.';
      } else {
        this.errorMessage = error.error?.message || 'Erro ao fazer login.';
      }

      this.isLoading = false;
    },
    complete: () => {
      this.isLoading = false;
    }
  });
}


 onRegister(): void {
  if (!this.signUpMode) return;

  if (this.registerForm.invalid) {
    this.registerForm.markAllAsTouched();
    this.errorMessage = 'Preencha todos os campos do cadastro corretamente.';
    return;
  }

  // EXTRA: monte manualmente o payload (evita surpresas com nomes)
  const payload = {
    nome: this.registerForm.value.nome,
    email: this.registerForm.value.email,
    telefone: this.registerForm.value.telefone,
    senha: this.registerForm.value.senha
  };


  this.isLoading = true;
  this.errorMessage = '';

  this.cadastroService.cadastrarUsuario(payload).subscribe({
    next: (response) => {
      alert('Cadastro realizado com sucesso!');
      this.toggleSignUpMode();
      this.isLoading = false;
    },
    error: (error) => {
      this.errorMessage = error.error?.message || 'Erro ao cadastrar. Tente novamente.';
      this.isLoading = false;
    }
  });
}


  ngOnInit() {
    this.titleService.setTitle('Login');
  }
}
