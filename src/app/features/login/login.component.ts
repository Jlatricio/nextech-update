import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators, AbstractControl, ReactiveFormsModule, FormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { AuthService } from './Auth/auth.service';
import { TitleService } from '../../core/services/title.service';
import { CadastroService } from '../../core/services/cadastro.service';
import Swal from 'sweetalert2';
import { get } from 'node:http';

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
  login: ['', [Validators.required, this.emailOrPhoneValidator]],
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

  return emailPattern.test(value) || phonePattern.test(value) ? null : { invalidInput: true };
}


  get loginemail() { return this.loginForm.get('email'); }
  get loginsenha() { return this.loginForm.get('senha'); }

  get registerName() { return this.registerForm.get('nome'); }
  get registerEmail() { return this.registerForm.get('email'); }
  get registerTelefone() { return this.registerForm.get('telefone'); }
  get registerPassword() { return this.registerForm.get('senha'); }


  get loginlogin() {
  return this.loginForm.get('login');
}

onEmailOrPhoneInput(event: Event): void {
  const input = event.target as HTMLInputElement;
  let value = input.value.trim();

  // Se o valor começa com + ou é só números, trata como número
  if (/^\+?\d+$/.test(value)) {
    const onlyNumbers = value.replace(/\D/g, '').slice(-9); // últimos 9 dígitos
   this.loginlogin?.setValue(onlyNumbers, { emitEvent: false });

  } else {
    // Se for email, deixa como está
    this.loginemail?.setValue(value, { emitEvent: false });
  }
}


  onSubmit(): void {
  if (this.loginForm.invalid) {
    this.loginForm.markAllAsTouched();
    this.errorMessage = 'Preencha todos os campos do login corretamente.';
    return;
  }

 const loginValue = this.loginForm.value.login.trim();
const senhaLogin = this.loginForm.value.senha;

const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const isEmail = emailPattern.test(loginValue);

const credenciais: any = { senha: senhaLogin };

if (isEmail) {
  credenciais.email = loginValue;
} else {
  credenciais.telefone = '+244' + loginValue.replace(/\D/g, '').slice(-9);
}

this.authService.login(credenciais).subscribe({
  next: () => {
    Swal.fire({
      title: 'Entrando...',
      didOpen: () => Swal.showLoading(),
      allowOutsideClick: false,
      showConfirmButton: false,
      timer: 1200
    }).then(() => {
      Swal.fire({
        icon: 'success',
        title: 'Login bem-sucedido!',
        showConfirmButton: false,
        timer: 1500
      }).then(() => {
        this.router.navigate(['/inicio']);
      });
    });
  },
  error: (error) => {
    this.isLoading = false;
    if (error.status === 401) {
      this.errorMessage = 'Credenciais inválidas. Verifique seu email ou telefone e senha.';
    } else {
      this.errorMessage = error.error?.message || 'Erro ao fazer login.';
    }
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

  const payload = {
    nome: this.registerForm.value.nome,
    email: this.registerForm.value.email,
    telefone: '+244' + this.registerForm.value.telefone.replace(/\s+/g, ''),
    senha: this.registerForm.value.senha
  };

  this.isLoading = true;
  this.errorMessage = '';

  this.cadastroService.cadastrarUsuario(payload).subscribe({
    next: () => {
      // Após cadastro, realiza o login automaticamente
   this.authService.login({ email: payload.email, senha: payload.senha }).subscribe({

        next: () => {
          Swal.fire({
            title: 'Entrando...',
            didOpen: () => Swal.showLoading(),
            allowOutsideClick: false,
            showConfirmButton: false,
            timer: 1200
          }).then(() => {
            Swal.fire({
              icon: 'success',
              title: 'Conta criada e login bem-sucedido!',
              showConfirmButton: false,
              timer: 1500
            }).then(() => {
              this.router.navigate(['/inicio']);
            });
          });
        },
        error: (error) => {
          this.isLoading = false;
          this.errorMessage = 'Conta criada, mas não foi possível fazer login automaticamente.';
        },
        complete: () => {
          this.isLoading = false;
        }
      });
    },
    error: (error) => {
      this.isLoading = false;
      this.errorMessage = error.error?.message || 'Erro ao criar conta.';
    }
  });
}

  ngOnInit() {
    this.titleService.setTitle('Login');
  }

  permitirApenasNumeros(event: KeyboardEvent): void {
  const charCode = event.key;
  if (!/^\d$/.test(charCode)) {
    event.preventDefault();
  }
}

}
