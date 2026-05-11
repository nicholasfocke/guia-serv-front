import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
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
          <span>Servico</span>
          <select name="servicoId" [(ngModel)]="servicoId">
            <option value="">Nao vinculado</option>
            <option *ngFor="let servico of servicos" [value]="servico.id">{{ servico.nome }}</option>
          </select>
        </label>
        <label class="form-field full"><span>Descricao</span><textarea name="descricao" [(ngModel)]="form.descricao"></textarea></label>
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
          <thead><tr><th>Documento</th><th>Servico</th><th>Obrigatorio</th><th>Acoes</th></tr></thead>
          <tbody>
            <tr *ngFor="let documento of documentos">
              <td><strong>{{ documento.nome }}</strong><br><span class="muted">{{ documento.descricao || '-' }}</span></td>
              <td>{{ documento.servico?.nome || '-' }}</td>
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
  `
})
export class DocumentosAdminComponent implements OnInit {
  documentos: Documento[] = [];
  servicos: ServicoPublico[] = [];
  form: Partial<Documento> = {};
  servicoId = '';
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
      next: (documentos) => this.documentos = documentos,
      error: (error) => this.erro = apiErrorMessage(error, 'Nao foi possivel carregar documentos.')
    });
  }

  novo(): void {
    this.form = { nome: '', descricao: '', obrigatorio: true };
    this.servicoId = '';
    this.exibirFormulario = true;
  }

  editar(documento: Documento): void {
    this.form = { ...documento };
    this.servicoId = String(documento.servico?.id ?? documento.servicoId ?? '');
    this.exibirFormulario = true;
  }

  salvar(): void {
    const servicoId = Number(this.servicoId);
    const payload: Partial<Documento> = {
      ...this.form,
      servicoId: servicoId || undefined,
      servico: servicoId ? ({ id: servicoId } as ServicoPublico) : undefined
    };
    const request = this.form.id ? this.documentoService.atualizar(this.form.id, payload) : this.documentoService.criar(payload);
    request.subscribe({
      next: () => { this.cancelar(); this.carregar(); },
      error: (error) => this.erro = apiErrorMessage(error, 'Nao foi possivel salvar o documento.')
    });
  }

  excluir(documento: Documento): void {
    if (!documento.id || !confirm(`Excluir documento "${documento.nome}"?`)) { return; }
    this.documentoService.remover(documento.id).subscribe({
      next: () => this.carregar(),
      error: (error) => this.erro = apiErrorMessage(error, 'Nao foi possivel excluir o documento.')
    });
  }

  cancelar(): void {
    this.form = {};
    this.servicoId = '';
    this.exibirFormulario = false;
  }
}
