import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { UnidadeAtendimento } from '../../../core/models/unidade-atendimento.model';
import { UnidadeService } from '../../../core/services/unidade.service';
import { apiErrorMessage } from '../../../shared/utils/api-response.util';

@Component({
  selector: 'app-unidades-admin',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <section class="page admin-page">
      <div class="page-header">
        <div><p class="eyebrow">CRUD</p><h1>Unidades</h1></div>
        <button class="btn btn-primary" type="button" (click)="novo()">Nova unidade</button>
      </div>
      <div class="empty-state" *ngIf="erro">{{ erro }}</div>

      <form class="surface form-grid" *ngIf="exibirFormulario" (ngSubmit)="salvar()" style="margin-bottom: 1rem;">
        <label class="form-field"><span>Nome</span><input name="nome" [(ngModel)]="form.nome" required></label>
        <label class="form-field"><span>Telefone</span><input name="telefone" [(ngModel)]="form.telefone"></label>
        <label class="form-field full"><span>Endereco</span><input name="endereco" [(ngModel)]="form.endereco" required></label>
        <label class="form-field"><span>Bairro</span><input name="bairro" [(ngModel)]="form.bairro"></label>
        <label class="form-field"><span>Cidade</span><input name="cidade" [(ngModel)]="form.cidade"></label>
        <label class="form-field"><span>Estado</span><input name="estado" [(ngModel)]="form.estado" maxlength="2"></label>
        <label class="form-field"><span>CEP</span><input name="cep" [(ngModel)]="form.cep"></label>
        <label class="form-field full"><span>Email</span><input type="email" name="email" [(ngModel)]="form.email"></label>
        <div class="actions form-field full">
          <button class="btn btn-teal" type="submit">Salvar</button>
          <button class="btn btn-muted" type="button" (click)="cancelar()">Cancelar</button>
        </div>
      </form>

      <div class="surface table-wrap">
        <table>
          <thead><tr><th>Nome</th><th>Endereco</th><th>Contato</th><th>Acoes</th></tr></thead>
          <tbody>
            <tr *ngFor="let unidade of unidades">
              <td>{{ unidade.nome }}</td>
              <td>{{ unidade.endereco }}</td>
              <td>{{ unidade.telefone || unidade.email || '-' }}</td>
              <td class="actions">
                <button class="btn btn-muted" type="button" (click)="editar(unidade)">Editar</button>
                <button class="btn btn-danger" type="button" (click)="excluir(unidade)">Excluir</button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </section>
  `
})
export class UnidadesAdminComponent implements OnInit {
  unidades: UnidadeAtendimento[] = [];
  form: Partial<UnidadeAtendimento> = {};
  exibirFormulario = false;
  erro = '';

  constructor(private unidadeService: UnidadeService) {}

  ngOnInit(): void { this.carregar(); }

  carregar(): void {
    this.unidadeService.listar().subscribe({
      next: (unidades) => this.unidades = unidades,
      error: (error) => this.erro = apiErrorMessage(error, 'Nao foi possivel carregar unidades.')
    });
  }

  novo(): void {
    this.form = { nome: '', endereco: '', ativo: true };
    this.exibirFormulario = true;
  }

  editar(unidade: UnidadeAtendimento): void {
    this.form = { ...unidade };
    this.exibirFormulario = true;
  }

  salvar(): void {
    const request = this.form.id ? this.unidadeService.atualizar(this.form.id, this.form) : this.unidadeService.criar(this.form);
    request.subscribe({
      next: () => { this.cancelar(); this.carregar(); },
      error: (error) => this.erro = apiErrorMessage(error, 'Nao foi possivel salvar a unidade.')
    });
  }

  excluir(unidade: UnidadeAtendimento): void {
    if (!unidade.id || !confirm(`Excluir unidade "${unidade.nome}"?`)) { return; }
    this.unidadeService.remover(unidade.id).subscribe({
      next: () => this.carregar(),
      error: (error) => this.erro = apiErrorMessage(error, 'Nao foi possivel excluir a unidade.')
    });
  }

  cancelar(): void {
    this.form = {};
    this.exibirFormulario = false;
  }
}
