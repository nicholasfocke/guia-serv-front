import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CategoriaServico } from '../../../core/models/categoria-servico.model';
import { CategoriaService } from '../../../core/services/categoria.service';
import { apiErrorMessage } from '../../../shared/utils/api-response.util';

@Component({
  selector: 'app-categorias-admin',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <section class="page admin-page">
      <div class="page-header">
        <div><p class="eyebrow">CRUD</p><h1>Categorias</h1></div>
        <button class="btn btn-primary" type="button" (click)="novo()">Nova categoria</button>
      </div>

      <div class="empty-state" *ngIf="erro">{{ erro }}</div>

      <form class="surface form-grid" *ngIf="exibirFormulario" (ngSubmit)="salvar()">
        <label class="form-field">
          Nome
          <input name="nome" [(ngModel)]="form.nome" required>
        </label>
        <label class="form-field full">
          Descricao
          <textarea name="descricao" [(ngModel)]="form.descricao"></textarea>
        </label>
        <label class="form-field">
          <span>Ativa</span>
          <select name="ativo" [(ngModel)]="form.ativo">
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
          <thead><tr><th>Nome</th><th>Descricao</th><th>Status</th><th>Acoes</th></tr></thead>
          <tbody>
            <tr *ngFor="let categoria of categorias">
              <td>{{ categoria.nome }}</td>
              <td>{{ categoria.descricao || '-' }}</td>
              <td>{{ categoria.ativo === false ? 'Inativa' : 'Ativa' }}</td>
              <td class="actions">
                <button class="btn btn-muted" type="button" (click)="editar(categoria)">Editar</button>
                <button class="btn btn-danger" type="button" (click)="excluir(categoria)">Excluir</button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </section>
  `
})
export class CategoriasAdminComponent implements OnInit {
  categorias: CategoriaServico[] = [];
  form: Partial<CategoriaServico> = {};
  exibirFormulario = false;
  erro = '';

  constructor(private categoriaService: CategoriaService) {}

  ngOnInit(): void {
    this.carregar();
  }

  carregar(): void {
    this.categoriaService.listar().subscribe({
      next: (categorias) => this.categorias = categorias,
      error: (error) => this.erro = apiErrorMessage(error, 'Nao foi possivel carregar categorias.')
    });
  }

  novo(): void {
    this.form = { nome: '', descricao: '', ativo: true };
    this.exibirFormulario = true;
  }

  editar(categoria: CategoriaServico): void {
    this.form = { ...categoria };
    this.exibirFormulario = true;
  }

  salvar(): void {
    const request = this.form.id
      ? this.categoriaService.atualizar(this.form.id, this.form)
      : this.categoriaService.criar(this.form);
    request.subscribe({
      next: () => {
        this.cancelar();
        this.carregar();
      },
      error: (error) => this.erro = apiErrorMessage(error, 'Nao foi possivel salvar a categoria.')
    });
  }

  excluir(categoria: CategoriaServico): void {
    if (!categoria.id || !confirm(`Excluir categoria "${categoria.nome}"?`)) {
      return;
    }
    this.categoriaService.remover(categoria.id).subscribe({
      next: () => this.carregar(),
      error: (error) => this.erro = apiErrorMessage(error, 'Nao foi possivel excluir a categoria.')
    });
  }

  cancelar(): void {
    this.form = {};
    this.exibirFormulario = false;
  }
}
