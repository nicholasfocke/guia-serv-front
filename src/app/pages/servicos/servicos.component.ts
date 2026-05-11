import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { CategoriaServico } from '../../core/models/categoria-servico.model';
import { ServicoPublico } from '../../core/models/servico-publico.model';
import { CategoriaService } from '../../core/services/categoria.service';
import { ServicoService } from '../../core/services/servico.service';
import { apiErrorMessage } from '../../shared/utils/api-response.util';

@Component({
  selector: 'app-servicos',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  templateUrl: './servicos.component.html',
  styleUrls: ['./servicos.component.css']
})
export class ServicosComponent implements OnInit {
  servicos: ServicoPublico[] = [];
  categorias: CategoriaServico[] = [];
  filtro = '';
  categoriaId = '';
  carregando = true;
  erro = '';

  constructor(
    private servicoService: ServicoService,
    private categoriaService: CategoriaService
  ) {}

  ngOnInit(): void {
    this.carregar();
    this.categoriaService.listar().subscribe((categorias) => this.categorias = categorias);
  }

  get servicosFiltrados(): ServicoPublico[] {
    const termo = this.filtro.trim().toLowerCase();
    const categoria = Number(this.categoriaId);
    return this.servicos.filter((servico) => {
      const texto = `${servico.nome} ${servico.descricao}`.toLowerCase();
      const bateTexto = !termo || texto.includes(termo);
      const bateCategoria = !categoria || servico.categoria?.id === categoria || servico.categoriaId === categoria;
      return bateTexto && bateCategoria;
    });
  }

  carregar(): void {
    this.carregando = true;
    this.servicoService.listar().subscribe({
      next: (servicos) => {
        this.servicos = servicos;
        this.carregando = false;
      },
      error: (error) => {
        this.erro = apiErrorMessage(error, 'Nao foi possivel carregar os servicos.');
        this.carregando = false;
      }
    });
  }
}
