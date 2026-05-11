import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { RouterLink } from '@angular/router';
import { CategoriaServico } from '../../core/models/categoria-servico.model';
import { ServicoPublico } from '../../core/models/servico-publico.model';
import { UnidadeAtendimento } from '../../core/models/unidade-atendimento.model';
import { CategoriaService } from '../../core/services/categoria.service';
import { ServicoService } from '../../core/services/servico.service';
import { UnidadeService } from '../../core/services/unidade.service';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {
  servicos: ServicoPublico[] = [];
  unidades: UnidadeAtendimento[] = [];
  categorias: CategoriaServico[] = [];

  constructor(
    private servicoService: ServicoService,
    private unidadeService: UnidadeService,
    private categoriaService: CategoriaService
  ) {}

  ngOnInit(): void {
    this.servicoService.listar().subscribe((servicos) => this.servicos = servicos.slice(0, 6));
    this.unidadeService.listar().subscribe((unidades) => this.unidades = unidades.slice(0, 3));
    this.categoriaService.listar().subscribe((categorias) => this.categorias = categorias.slice(0, 6));
  }
}
