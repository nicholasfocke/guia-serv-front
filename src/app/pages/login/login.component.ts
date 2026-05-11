import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../core/services/auth.service';
import { apiErrorMessage } from '../../shared/utils/api-response.util';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {
  email = '';
  senha = '';
  carregando = false;
  erro = '';

  constructor(private authService: AuthService, private router: Router) {}

  onSubmit(): void {
    this.carregando = true;
    this.erro = '';
    this.authService.login({ email: this.email, senha: this.senha }).subscribe({
      next: () => {
        this.carregando = false;
        this.router.navigate([this.authService.isAdmin() ? '/admin' : '/']);
      },
      error: (error) => {
        this.erro = apiErrorMessage(error, 'Usuario ou senha invalidos.');
        this.carregando = false;
      }
    });
  }
}
