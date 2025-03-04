import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    FormsModule,
    MatSnackBarModule
  ],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent {
  apiUrl = 'https://script.google.com/macros/s/AKfycbwTE0BWwlCTkk54mXx1-735wZHnrpABli-STRs_CNDqMKgriylz6iqtoOVNzNhd3j5C/exec';
  email: string = '';
  name: string = '';
  isEmailValid: boolean = false;
  hasBlurred: boolean = false;

  constructor(private snackBar: MatSnackBar) {}

  validateEmail() {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    this.isEmailValid = emailRegex.test(this.email);
  }

  sendData() {
    const body = JSON.stringify({
      Email: this.email,
      Name: this.name,
      Status: 'pending'
    });
    this.email = '';
    this.name = '';
    this.isEmailValid = false;
    this.hasBlurred = false;
    fetch(this.apiUrl, {
      redirect: 'follow',
      method: 'POST',
      body: body,
      headers: {
        'Content-Type': 'text/plain;charset=utf-8'
      }
    })
      .then(response => {
        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }
        return response.text();
      })
      .then(result => {
        try {
          const res = JSON.parse(result);
          console.log('Respuesta exitosa:', res);
        } catch (error) {
          console.error('Error al analizar la respuesta:', error);
        }
      })
      .catch(error => {
        console.error('Error al enviar la solicitud:', error);
      });
  }

  submitForm() {
    this.snackBar.open(
      'Muchas gracias por registrarse. Por favor, confirme el correo electrónico que se ha enviado a su dirección de correo electrónico.',
      '',
      {
        duration: 8000,
        panelClass: ['success-snackbar']
      }
    );
    this.sendData();
  }
}
