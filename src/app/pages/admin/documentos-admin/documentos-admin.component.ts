import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { forkJoin, of } from 'rxjs';
import { switchMap } from 'rxjs/operators';
import { Documento } from '../../../core/models/documento.model';
import { ServicoPublico } from '../../../core/models/servico-publico.model';
import { DocumentoService } from '../../../core/services/documento.service';
import { ServicoService } from '../../../core/services/servico.service';
import { apiErrorMessage } from '../../../shared/utils/api-response.util';

@Component({
  selector: 'app-documentos-admin',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <section class="page admin-page">
      <div class="page-header">
        <div><p class="eyebrow">CRUD</p><h1>Documentos</h1></div>
        <button class="btn btn-primary" type="button" (click)="novo()">Novo documento</button>
      </div>
      <div class="empty-state" *ngIf="erro">{{ erro }}</div>

      <form class="surface form-grid" *ngIf="exibirFormulario" (ngSubmit)="salvar()" style="margin-bottom: 1rem;">
        <label class="form-field"><span>Nome</span><input name="nome" [(ngModel)]="form.nome" required></label>
        <label class="form-field">
          <span>Servicos</span>
          <div class="checkbox-box">
            <label class="checkbox-option" *ngFor="let servico of servicos">
              <input
                type="checkbox"
                [name]="'servico-' + servico.id"
                [checked]="servicoSelecionado(servico.id)"
                (change)="alternarServico(servico.id, $event)"
              >
              <span>{{ servico.nome }}</span>
            </label>
          </div>
        </label>
        <label class="form-field full"><span>Descricao</span><textarea name="descricao" [(ngModel)]="form.descricao" required minlength="5"></textarea></label>
        <label class="form-field">
          <span>Obrigatorio</span>
          <select name="obrigatorio" [(ngModel)]="form.obrigatorio">
            <option [ngValue]="true">Sim</option>
            <option [ngValue]="false">Nao</option>
          </select>
        </label>
        <div class="actions form-field full">
          <button class="btn btn-teal" type="submit">Salvar</button>
          <button class="btn btn-muted" type="button" (click)="cancelar()">Cancelar</button>
        </div>
      </form>

      <div class="surface table-wrap">
        <table>
          <thead><tr><th>Documento</th><th>Servicos</th><th>Obrigatorio</th><th>Acoes</th></tr></thead>
          <tbody>
            <tr *ngFor="let documento of documentos">
              <td><strong>{{ documento.nome }}</strong><br><span class="muted">{{ documento.descricao || '-' }}</span></td>
              <td>{{ nomesServicos(documento) }}</td>
              <td>{{ documento.obrigatorio ? 'Sim' : 'Nao' }}</td>
              <td class="actions">
                <button class="btn btn-muted" type="button" (click)="editar(documento)">Editar</button>
                <button class="btn btn-danger" type="button" (click)="excluir(documento)">Excluir</button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </section>
  `,
  styles: [`
    .checkbox-box {
      background: var(--branco);
      border: 1px solid var(--borda);
      border-radius: 10px;
      display: grid;
      gap: 0.35rem;
      max-height: 180px;
      min-height: 112px;
      overflow-y: auto;
      padding: 0.7rem;
    }

    .checkbox-option {
      align-items: center;
      border-radius: 8px;
      color: var(--texto);
      cursor: pointer;
      display: flex;
      gap: 0.55rem;
      padding: 0.45rem 0.5rem;
    }

    .checkbox-option:hover {
      background: var(--cinza-claro);
    }

    .checkbox-option input {
      flex: 0 0 auto;
      min-height: auto;
      width: auto;
    }

    .form-field input:not([type="checkbox"]) {
      height: 42px;
      min-height: 42px;
    }
  `]
})
export class DocumentosAdminComponent implements OnInit {
  documentos: Documento[] = [];
  servicos: ServicoPublico[] = [];
  form: Partial<Documento> = {};
  servicoIds: number[] = [];
  exibirFormulario = false;
  erro = '';

  constructor(
    private documentoService: DocumentoService,
    private servicoService: ServicoService
  ) {}

  ngOnInit(): void {
    this.carregar();
    this.servicoService.listar().subscribe((servicos) => this.servicos = servicos);
  }

  carregar(): void {
    this.documentoService.listar().subscribe({
      next: (documentos) => {
        this.documentos = documentos;
        this.erro = '';
      },
      error: (error) => this.erro = apiErrorMessage(error, 'Nao foi possivel carregar documentos.')
    });
  }

  novo(): void {
    this.form = { nome: '', descricao: '', obrigatorio: true };
    this.servicoIds = [];
    this.exibirFormulario = true;
  }

  editar(documento: Documento): void {
    this.form = { ...documento };
    this.servicoIds = [...(documento.servicoIds ?? [])];
    this.exibirFormulario = true;
  }

  salvar(): void {
    this.erro = '';
    const servicoIds = this.servicoIds.map(Number).filter(Boolean);
    const obrigatorio = this.form.obrigatorio ?? true;
    const idsAtuais = this.form.id ? [...(this.form.servicoIds ?? [])] : [];
    const request = (this.form.id ? this.documentoService.atualizar(this.form.id, this.form) : this.documentoService.criar(this.form)).pipe(
      switchMap((documento) => this.sincronizarVinculos(documento.id, idsAtuais, servicoIds, obrigatorio))
    );

    request.subscribe({
      next: () => { this.cancelar(); this.carregar(); },
      error: (error) => this.erro = apiErrorMessage(error, 'Nao foi possivel salvar o documento.')
    });
  }

  excluir(documento: Documento): void {
    if (!documento.id || !confirm(`Excluir documento "${documento.nome}"?`)) { return; }
    this.documentoService.remover(documento.id).subscribe({
      next: () => {
        this.erro = '';
        this.carregar();
      },
      error: (error) => this.erro = apiErrorMessage(error, 'Nao foi possivel excluir o documento.')
    });
  }

  cancelar(): void {
    this.form = {};
    this.servicoIds = [];
    this.exibirFormulario = false;
  }

  nomesServicos(documento: Documento): string {
    return documento.servicos?.length ? documento.servicos.map((servico) => servico.nome).join(', ') : '-';
  }

  servicoSelecionado(servicoId?: number): boolean {
    return Boolean(servicoId && this.servicoIds.includes(servicoId));
  }

  alternarServico(servicoId: number | undefined, event: Event): void {
    if (!servicoId) {
      return;
    }

    const checked = (event.target as HTMLInputElement).checked;
    this.servicoIds = checked
      ? Array.from(new Set([...this.servicoIds, servicoId]))
      : this.servicoIds.filter((id) => id !== servicoId);
  }

  private sincronizarVinculos(
    documentoId: number | undefined,
    idsAtuais: number[],
    idsSelecionados: number[],
    obrigatorio: boolean
  ) {
    if (!documentoId) {
      return of(null);
    }

    const atuais = new Set(idsAtuais);
    const selecionados = new Set(idsSelecionados);
    const criar = idsSelecionados
      .filter((servicoId) => !atuais.has(servicoId))
      .map((servicoId) => this.documentoService.vincular(servicoId, documentoId, obrigatorio));
    const atualizar = idsSelecionados
      .filter((servicoId) => atuais.has(servicoId))
      .map((servicoId) => this.documentoService.atualizarVinculo(servicoId, documentoId, obrigatorio));
    const remover = idsAtuais
      .filter((servicoId) => !selecionados.has(servicoId))
      .map((servicoId) => this.documentoService.desvincular(servicoId, documentoId));
    const operacoes = [...criar, ...atualizar, ...remover];

    return operacoes.length ? forkJoin(operacoes) : of(null);
  }
}
