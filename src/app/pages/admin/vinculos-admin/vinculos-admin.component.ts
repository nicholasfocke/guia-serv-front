import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ServicoPublico } from '../../../core/models/servico-publico.model';
import { ServicoUnidade } from '../../../core/models/servico-unidade.model';
import { UnidadeAtendimento } from '../../../core/models/unidade-atendimento.model';
import { ServicoUnidadeService } from '../../../core/services/servico-unidade.service';
import { ServicoService } from '../../../core/services/servico.service';
import { UnidadeService } from '../../../core/services/unidade.service';
import { apiErrorMessage } from '../../../shared/utils/api-response.util';

@Component({
  selector: 'app-vinculos-admin',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <section class="page admin-page">
      <div class="page-header">
        <div><p class="eyebrow">CRUD</p><h1>Vinculos servico-unidade</h1></div>
        <button class="btn btn-primary" type="button" (click)="novo()">Novo vinculo</button>
      </div>
      <div class="empty-state" *ngIf="erro">{{ erro }}</div>

      <form class="surface form-grid" *ngIf="exibirFormulario" (ngSubmit)="salvar()" style="margin-bottom: 1rem;">
        <label class="form-field">
          <span>Servico</span>
          <select name="servicoId" [(ngModel)]="servicoId" required>
            <option value="">Selecione</option>
            <option *ngFor="let servico of servicos" [value]="servico.id">{{ servico.nome }}</option>
          </select>
        </label>
        <label class="form-field">
          <span>Unidade</span>
          <select name="unidadeId" [(ngModel)]="unidadeId" required>
            <option value="">Selecione</option>
            <option *ngFor="let unidade of unidades" [value]="unidade.id">{{ unidade.nome }}</option>
          </select>
        </label>
        <label class="form-field full"><span>Observacoes</span><textarea name="observacoes" [(ngModel)]="form.observacoes"></textarea></label>
        <div class="actions form-field full">
          <button class="btn btn-teal" type="submit">Salvar</button>
          <button class="btn btn-muted" type="button" (click)="cancelar()">Cancelar</button>
        </div>
      </form>

      <div class="surface table-wrap">
        <table>
          <thead><tr><th>Servico</th><th>Unidade</th><th>Observacoes</th><th>Acoes</th></tr></thead>
          <tbody>
            <tr *ngFor="let vinculo of vinculos">
              <td>{{ vinculo.servico?.nome || '-' }}</td>
              <td>{{ vinculo.unidade?.nome || '-' }}</td>
              <td>{{ vinculo.observacoes || '-' }}</td>
              <td class="actions">
                <button class="btn btn-danger" type="button" (click)="excluir(vinculo)">Excluir</button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </section>
  `
})
export class VinculosAdminComponent implements OnInit {
  vinculos: ServicoUnidade[] = [];
  servicos: ServicoPublico[] = [];
  unidades: UnidadeAtendimento[] = [];
  form: Partial<ServicoUnidade> = {};
  servicoId = '';
  unidadeId = '';
  exibirFormulario = false;
  erro = '';

  constructor(
    private vinculoService: ServicoUnidadeService,
    private servicoService: ServicoService,
    private unidadeService: UnidadeService
  ) {}

  ngOnInit(): void {
    this.carregar();
    this.servicoService.listar().subscribe((servicos) => this.servicos = servicos);
    this.unidadeService.listar().subscribe((unidades) => this.unidades = unidades);
  }

  carregar(): void {
    this.vinculoService.listar().subscribe({
      next: (vinculos) => {
        this.vinculos = vinculos;
        this.erro = '';
      },
      error: (error) => this.erro = apiErrorMessage(error, 'Nao foi possivel carregar vinculos.')
    });
  }

  novo(): void {
    this.form = {};
    this.servicoId = '';
    this.unidadeId = '';
    this.exibirFormulario = true;
  }

  editar(vinculo: ServicoUnidade): void {
    this.form = { ...vinculo };
    this.servicoId = String(vinculo.servico?.id ?? vinculo.servicoId ?? '');
    this.unidadeId = String(vinculo.unidade?.id ?? vinculo.unidadeId ?? '');
    this.exibirFormulario = true;
  }

  salvar(): void {
    this.erro = '';
    const servicoId = Number(this.servicoId);
    const unidadeId = Number(this.unidadeId);

    if (!servicoId || !unidadeId) {
      this.erro = 'Selecione um servico e uma unidade.';
      return;
    }

    const payload: Partial<ServicoUnidade> = {
      servicoId,
      unidadeId,
      observacoes: this.form.observacoes
    };
    this.vinculoService.criar(payload).subscribe({
      next: () => { this.cancelar(); this.carregar(); },
      error: (error) => this.erro = apiErrorMessage(error, 'Nao foi possivel salvar o vinculo.')
    });
  }

  excluir(vinculo: ServicoUnidade): void {
    const servicoId = vinculo.servico?.id ?? vinculo.servicoId;
    const unidadeId = vinculo.unidade?.id ?? vinculo.unidadeId;

    if (!servicoId || !unidadeId || !confirm('Excluir vinculo?')) { return; }
    this.vinculoService.desvincular(servicoId, unidadeId).subscribe({
      next: () => {
        this.erro = '';
        this.carregar();
      },
      error: (error) => this.erro = apiErrorMessage(error, 'Nao foi possivel excluir o vinculo.')
    });
  }

  cancelar(): void {
    this.form = {};
    this.servicoId = '';
    this.unidadeId = '';
    this.exibirFormulario = false;
  }
}
