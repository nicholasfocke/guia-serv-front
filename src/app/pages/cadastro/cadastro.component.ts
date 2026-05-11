import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../core/services/auth.service';
import { apiErrorMessage } from '../../shared/utils/api-response.util';

@Component({
  selector: 'app-cadastro',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  templateUrl: './cadastro.component.html',
  styleUrls: ['./cadastro.component.css']
})
export class CadastroComponent {
  nome = '';
  email = '';
  senha = '';
  carregando = false;
  erro = '';

  constructor(private authService: AuthService, private router: Router) {}

  onSubmit(): void {
    this.carregando = true;
    this.erro = '';
    this.authService.cadastro({ nome: this.nome, email: this.email, senha: this.senha }).subscribe({
      next: () => {
        this.carregando = false;
        this.router.navigate(['/login']);
      },
      error: (error) => {
        this.erro = apiErrorMessage(error, 'Nao foi possivel criar a conta.');
        this.carregando = false;
      }
    });
  }
}
