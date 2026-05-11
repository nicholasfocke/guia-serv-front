import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { RouterLink } from '@angular/router';
import { CategoriaService } from '../../../core/services/categoria.service';
import { DocumentoService } from '../../../core/services/documento.service';
import { ServicoService } from '../../../core/services/servico.service';
import { UnidadeService } from '../../../core/services/unidade.service';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, RouterLink],
  template: `
    <section class="page admin-page">
      <div class="page-header">
        <div>
          <p class="eyebrow">Painel</p>
          <h1>Administracao do GuiaServ</h1>
          <p class="lead">Gerencie cadastros, vinculos e horarios publicados para o cidadao.</p>
        </div>
      </div>

      <div class="grid">
        <a class="card metric" routerLink="/admin/categorias"><span>{{ categorias }}</span><strong>Categorias</strong></a>
        <a class="card metric" routerLink="/admin/servicos"><span>{{ servicos }}</span><strong>Servicos</strong></a>
        <a class="card metric" routerLink="/admin/unidades"><span>{{ unidades }}</span><strong>Unidades</strong></a>
        <a class="card metric" routerLink="/admin/documentos"><span>{{ documentos }}</span><strong>Documentos</strong></a>
      </div>
    </section>
  `,
  styles: [`
    .admin-page { padding: 0; }
    .metric { color: var(--azul-escuro); display: grid; gap: .4rem; text-decoration: none; }
    .metric span { color: var(--teal); font-size: 2.5rem; font-weight: 900; line-height: 1; }
  `]
})
export class DashboardComponent implements OnInit {
  categorias = 0;
  servicos = 0;
  unidades = 0;
  documentos = 0;

  constructor(
    private categoriaService: CategoriaService,
    private servicoService: ServicoService,
    private unidadeService: UnidadeService,
    private documentoService: DocumentoService
  ) {}

  ngOnInit(): void {
    this.categoriaService.listar().subscribe((items) => this.categorias = items.length);
    this.servicoService.listar().subscribe((items) => this.servicos = items.length);
    this.unidadeService.listar().subscribe((items) => this.unidades = items.length);
    this.documentoService.listar().subscribe((items) => this.documentos = items.length);
  }
}
