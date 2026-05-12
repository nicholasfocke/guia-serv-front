import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { RouterLink } from '@angular/router';
import { ServicoPublico } from '../../../core/models/servico-publico.model';
import { CategoriaService } from '../../../core/services/categoria.service';
import { DocumentoService } from '../../../core/services/documento.service';
import { ServicoService } from '../../../core/services/servico.service';
import { UnidadeService } from '../../../core/services/unidade.service';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, RouterLink],
  template: `
    <section class="admin-dashboard">
      <div class="admin-title">
        <div>
          <p class="eyebrow">Painel Admin</p>
          <h1>Dashboard</h1>
        </div>
        <a class="btn btn-primary" routerLink="/admin/servicos">Novo servico</a>
      </div>

      <div class="metrics">
        <a class="metric-card" routerLink="/admin/servicos">
          <span>{{ servicos }}</span>
          <strong>Servicos cadastrados</strong>
          <small>Catalogo publico</small>
        </a>
        <a class="metric-card" routerLink="/admin/unidades">
          <span>{{ unidades }}</span>
          <strong>Unidades ativas</strong>
          <small>Rede de atendimento</small>
        </a>
        <a class="metric-card" routerLink="/admin/documentos">
          <span>{{ documentos }}</span>
          <strong>Documentos</strong>
          <small>Requisitos publicados</small>
        </a>
        <a class="metric-card" routerLink="/admin/categorias">
          <span>{{ categorias }}</span>
          <strong>Categorias</strong>
          <small>Areas de servico</small>
        </a>
      </div>

      <div class="surface table-wrap">
        <table>
          <thead>
            <tr><th>Servico</th><th>Categoria</th><th>Status</th></tr>
          </thead>
          <tbody>
            <tr *ngFor="let servico of servicosRecentes">
              <td>{{ servico.nome }}</td>
              <td>{{ servico.categoria?.nome || '-' }}</td>
              <td><span class="status-pill" [class.review]="servico.ativo === false">{{ servico.ativo === false ? 'Inativo' : 'Ativo' }}</span></td>
            </tr>
          </tbody>
        </table>
      </div>
    </section>
  `,
  styles: [`
    .admin-dashboard { display: grid; gap: 1.4rem; }
    .admin-title { align-items: center; display: flex; justify-content: space-between; }
    .admin-title h1 { font-size: 1.65rem; margin: 0; }
    .metrics { display: grid; gap: 1rem; grid-template-columns: repeat(4, minmax(0, 1fr)); }
    .metric-card {
      background: var(--branco);
      border: 1px solid var(--borda);
      border-radius: 12px;
      box-shadow: 0 14px 34px rgba(16, 40, 59, 0.07);
      color: var(--azul-escuro);
      display: grid;
      gap: .35rem;
      min-height: 150px;
      padding: 1.25rem;
      text-decoration: none;
    }
    .metric-card span { font-size: 2rem; font-weight: 950; letter-spacing: 0; line-height: 1; }
    .metric-card strong { font-size: .95rem; }
    .metric-card small { color: var(--texto-suave); }
    .status-pill {
      background: #e7fbf3;
      border-radius: 999px;
      color: #087443;
      display: inline-flex;
      font-size: .8rem;
      font-weight: 900;
      padding: .32rem .65rem;
    }
    .status-pill.review { background: #fff3e0; color: #92540b; }
    @media (max-width: 1000px) { .metrics { grid-template-columns: repeat(2, minmax(0, 1fr)); } }
    @media (max-width: 620px) { .metrics, .admin-title { grid-template-columns: 1fr; } .admin-title { align-items: flex-start; flex-direction: column; gap: 1rem; } }
  `]
})
export class DashboardComponent implements OnInit {
  categorias = 0;
  servicos = 0;
  unidades = 0;
  documentos = 0;
  servicosRecentes: ServicoPublico[] = [];

  constructor(
    private categoriaService: CategoriaService,
    private servicoService: ServicoService,
    private unidadeService: UnidadeService,
    private documentoService: DocumentoService
  ) {}

  ngOnInit(): void {
    this.categoriaService.listar().subscribe((items) => this.categorias = items.length);
    this.servicoService.listar().subscribe((items) => {
      this.servicos = items.length;
      this.servicosRecentes = items.slice(0, 6);
    });
    this.unidadeService.listar().subscribe((items) => this.unidades = items.length);
    this.documentoService.listar().subscribe((items) => this.documentos = items.length);
  }
}
