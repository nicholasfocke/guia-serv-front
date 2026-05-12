import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { Avaliacao } from '../../core/models/avaliacao.model';
import { CategoriaServico } from '../../core/models/categoria-servico.model';
import { ServicoPublico } from '../../core/models/servico-publico.model';
import { UnidadeAtendimento } from '../../core/models/unidade-atendimento.model';
import { AvaliacaoService } from '../../core/services/avaliacao.service';
import { CategoriaService } from '../../core/services/categoria.service';
import { ServicoService } from '../../core/services/servico.service';
import { UnidadeService } from '../../core/services/unidade.service';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {
  servicos: ServicoPublico[] = [];
  unidades: UnidadeAtendimento[] = [];
  categorias: CategoriaServico[] = [];
  totalServicos = 0;
  totalUnidades = 0;
  totalCategorias = 0;
  mediaAvaliacoes = 0;
  busca = '';

  constructor(
    private servicoService: ServicoService,
    private unidadeService: UnidadeService,
    private categoriaService: CategoriaService,
    private avaliacaoService: AvaliacaoService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.servicoService.listar().subscribe((servicos) => {
      this.totalServicos = servicos.length;
      this.servicos = servicos.slice(0, 3);
    });
    this.unidadeService.listar().subscribe((unidades) => {
      this.totalUnidades = unidades.length;
      this.unidades = unidades.slice(0, 2);
    });
    this.categoriaService.listar().subscribe((categorias) => {
      this.totalCategorias = categorias.length;
      this.categorias = categorias.slice(0, 4);
    });
    this.avaliacaoService.listar().subscribe((avaliacoes) => this.mediaAvaliacoes = this.calcularMedia(avaliacoes));
  }

  buscar(): void {
    this.router.navigate(['/servicos'], {
      queryParams: this.busca.trim() ? { q: this.busca.trim() } : undefined
    });
  }

  private calcularMedia(avaliacoes: Avaliacao[]): number {
    if (!avaliacoes.length) {
      return 0;
    }
    const total = avaliacoes.reduce((soma, avaliacao) => soma + Number(avaliacao.nota || 0), 0);
    return Math.round((total / avaliacoes.length) * 10) / 10;
  }
}
