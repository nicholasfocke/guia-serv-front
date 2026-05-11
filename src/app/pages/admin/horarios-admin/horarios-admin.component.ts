import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HorarioFuncionamento } from '../../../core/models/horario-funcionamento.model';
import { UnidadeAtendimento } from '../../../core/models/unidade-atendimento.model';
import { HorarioService } from '../../../core/services/horario.service';
import { UnidadeService } from '../../../core/services/unidade.service';
import { apiErrorMessage } from '../../../shared/utils/api-response.util';

@Component({
  selector: 'app-horarios-admin',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <section class="page admin-page">
      <div class="page-header">
        <div><p class="eyebrow">CRUD</p><h1>Horarios de funcionamento</h1></div>
        <button class="btn btn-primary" type="button" (click)="novo()">Novo horario</button>
      </div>
      <div class="empty-state" *ngIf="erro">{{ erro }}</div>

      <form class="surface form-grid" *ngIf="exibirFormulario" (ngSubmit)="salvar()" style="margin-bottom: 1rem;">
        <label class="form-field">
          <span>Unidade</span>
          <select name="unidadeId" [(ngModel)]="unidadeId" required>
            <option value="">Selecione</option>
            <option *ngFor="let unidade of unidades" [value]="unidade.id">{{ unidade.nome }}</option>
          </select>
        </label>
        <label class="form-field">
          <span>Dia da semana</span>
          <select name="diaSemana" [(ngModel)]="form.diaSemana" required>
            <option *ngFor="let dia of diasSemana" [value]="dia">{{ dia }}</option>
          </select>
        </label>
        <label class="form-field"><span>Abertura</span><input type="time" name="horarioAbertura" [(ngModel)]="form.horarioAbertura"></label>
        <label class="form-field"><span>Fechamento</span><input type="time" name="horarioFechamento" [(ngModel)]="form.horarioFechamento"></label>
        <label class="form-field">
          <span>Fechado</span>
          <select name="fechado" [(ngModel)]="form.fechado">
            <option [ngValue]="false">Nao</option>
            <option [ngValue]="true">Sim</option>
          </select>
        </label>
        <div class="actions form-field full">
          <button class="btn btn-teal" type="submit">Salvar</button>
          <button class="btn btn-muted" type="button" (click)="cancelar()">Cancelar</button>
        </div>
      </form>

      <div class="surface table-wrap">
        <table>
          <thead><tr><th>Unidade</th><th>Dia</th><th>Horario</th><th>Acoes</th></tr></thead>
          <tbody>
            <tr *ngFor="let horario of horarios">
              <td>{{ horario.unidade?.nome || '-' }}</td>
              <td>{{ horario.diaSemana }}</td>
              <td>{{ horario.fechado ? 'Fechado' : (horario.horarioAbertura + ' as ' + horario.horarioFechamento) }}</td>
              <td class="actions">
                <button class="btn btn-muted" type="button" (click)="editar(horario)">Editar</button>
                <button class="btn btn-danger" type="button" (click)="excluir(horario)">Excluir</button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </section>
  `
})
export class HorariosAdminComponent implements OnInit {
  horarios: HorarioFuncionamento[] = [];
  unidades: UnidadeAtendimento[] = [];
  form: Partial<HorarioFuncionamento> = {};
  unidadeId = '';
  exibirFormulario = false;
  erro = '';
  diasSemana = ['SEGUNDA', 'TERCA', 'QUARTA', 'QUINTA', 'SEXTA', 'SABADO', 'DOMINGO'];

  constructor(
    private horarioService: HorarioService,
    private unidadeService: UnidadeService
  ) {}

  ngOnInit(): void {
    this.carregar();
    this.unidadeService.listar().subscribe((unidades) => this.unidades = unidades);
  }

  carregar(): void {
    this.horarioService.listar().subscribe({
      next: (horarios) => this.horarios = horarios,
      error: (error) => this.erro = apiErrorMessage(error, 'Nao foi possivel carregar horarios.')
    });
  }

  novo(): void {
    this.form = { diaSemana: 'SEGUNDA', horarioAbertura: '08:00', horarioFechamento: '17:00', fechado: false };
    this.unidadeId = '';
    this.exibirFormulario = true;
  }

  editar(horario: HorarioFuncionamento): void {
    this.form = { ...horario };
    this.unidadeId = String(horario.unidade?.id ?? horario.unidadeId ?? '');
    this.exibirFormulario = true;
  }

  salvar(): void {
    const unidadeId = Number(this.unidadeId);
    const payload: Partial<HorarioFuncionamento> = {
      ...this.form,
      unidadeId,
      unidade: { id: unidadeId } as UnidadeAtendimento
    };
    const request = this.form.id ? this.horarioService.atualizar(this.form.id, payload) : this.horarioService.criar(payload);
    request.subscribe({
      next: () => { this.cancelar(); this.carregar(); },
      error: (error) => this.erro = apiErrorMessage(error, 'Nao foi possivel salvar o horario.')
    });
  }

  excluir(horario: HorarioFuncionamento): void {
    if (!horario.id || !confirm('Excluir horario?')) { return; }
    this.horarioService.remover(horario.id).subscribe({
      next: () => this.carregar(),
      error: (error) => this.erro = apiErrorMessage(error, 'Nao foi possivel excluir o horario.')
    });
  }

  cancelar(): void {
    this.form = {};
    this.unidadeId = '';
    this.exibirFormulario = false;
  }
}
