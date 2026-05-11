import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { UnidadeAtendimento } from '../../core/models/unidade-atendimento.model';
import { UnidadeService } from '../../core/services/unidade.service';
import { apiErrorMessage } from '../../shared/utils/api-response.util';

@Component({
  selector: 'app-unidades',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  templateUrl: './unidades.component.html',
  styleUrls: ['./unidades.component.css']
})
export class UnidadesComponent implements OnInit {
  unidades: UnidadeAtendimento[] = [];
  filtro = '';
  carregando = true;
  erro = '';

  constructor(private unidadeService: UnidadeService) {}

  ngOnInit(): void {
    this.unidadeService.listar().subscribe({
      next: (unidades) => {
        this.unidades = unidades;
        this.carregando = false;
      },
      error: (error) => {
        this.erro = apiErrorMessage(error, 'Nao foi possivel carregar as unidades.');
        this.carregando = false;
      }
    });
  }

  get unidadesFiltradas(): UnidadeAtendimento[] {
    const termo = this.filtro.trim().toLowerCase();
    return this.unidades.filter((unidade) => !termo || `${unidade.nome} ${unidade.endereco} ${unidade.bairro ?? ''}`.toLowerCase().includes(termo));
  }
}
