import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { Validators, FormBuilder, FormGroup } from '@angular/forms';
import { MdbCardBodyComponent, MdbCardComponent } from 'angular-bootstrap-md';
import { AuthService } from '../../shared/services/auth.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
})
export class LoginComponent {

  readonly emailRegex: RegExp = new RegExp(/^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/); // tslint:disable-line
  form: FormGroup;

  constructor(
    public fb: FormBuilder,
    private authService: AuthService,
    private router: Router
  ) {
    this.form = fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', Validators.required],
    });
    // this.dummylogin();
  }

  async dummylogin() {
    // const success = await this.authService.login('santiagommejia@gmail.com', 'firecatcher');
    this.router.navigate(['monitor']);
  }

  async login() {
    if (this.form.valid) {
      const email = this.form.get('email').value;
      const password = this.form.get('password').value;
      const success = await this.authService.login(email, password);
      if (success) {
        this.router.navigate(['monitor']);
      } else {
        alert('Credenciales invalidas, por favor intentelo de nuevo.');
      }
    } else {
      alert('Datos incorrectos, por favor intentelo de nuevo.');
    }
  }

  forgotPassword() {
    const currentEmail = this.form.get('email').value;
    const email = prompt('Introduce la dirección de correo.', currentEmail);
    if (email !== null) {
      const isValidEmail = this.emailRegex.test(email);
      if (isValidEmail) {
        this.authService.sendPasswordResetEmail(email);
        alert('Se ha enviado un email para reestablecer la contraseña a ' + email + ', por favor revisa tu bandeja de entrada.');
      } else if (!isValidEmail && email === '') {
        alert('El campo dirección de correo esta vacío.');
      } else {
        alert('La dirección de correo "' + email + '" no es valida.');
      }
    }
    return false;
  }

}
