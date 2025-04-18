import { Component } from '@angular/core';
import { Observable } from 'rxjs/internal/Observable';

import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';

import { CommonModule } from '@angular/common';
import { Usuario } from '../interface/usuario';
import { usuarioServices } from '../../service/usuario.service';
import { TitleService } from '../../../../core/services/title.service';
import { RouterModule } from '@angular/router';


@Component({
  selector: 'app-usuarios',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterModule],
  templateUrl: './usuario.component.html',
  styleUrl: './usuario.component.scss',
})
export class UsuariosComponent {
  usuario$!: Observable<[Usuario]>;
  form: FormGroup;
  populateForm(usuario: any): void {
    this.form.patchValue({
      nome: usuario.nome,
      tipo: usuario.tipo,
      telefone: usuario.telefone,
      email: usuario.email,
      senha: usuario.senha
    });
  }

  constructor(
    private formBuilder: FormBuilder,
    private usuarioService: usuarioServices,
    private titleService: TitleService
  ) {
    this.usuario$ != this.usuarioService.listaUsuario();

    this.form = this.formBuilder.group({
      nome: ['', Validators.required],
      tipo: ['', Validators.required],
      telefone: ['', Validators.required],
      email: ['', Validators.required, Validators.email],
      senha: ['', Validators.required, Validators.max(8)],
    });
  }

  ngOnInit(): void {
    this.titleService.setTitle('Usuários');

  }


  onSubmit() {
    this.usuarioService
      .salvarUsuario(this.form.value)
      .subscribe((result) => console.log(result));
  }


  deleteUsuario(id: number | undefined) {
    if (id !== undefined) {
      this.usuarioService.deleteUsuario(id).subscribe(() => {
        console.log(`Usuario Com ID ${id} deleted`);
        this.usuario$ != this.usuarioService.listaUsuario();
      });
    }
  }

  updateUsuario(id: number) {
    if (this.form.valid) {
      this.usuarioService
        .atualizarUsuario(id, this.form.value)
        .subscribe((updatedUsuario) => {
          console.log(`Usuario Com ID ${id} updated`, updatedUsuario);
          this.form.reset(); // Clear the form
          this.usuario$ != this.usuarioService.listaUsuario(); // Refresh the list
        });
    }
  }
}
