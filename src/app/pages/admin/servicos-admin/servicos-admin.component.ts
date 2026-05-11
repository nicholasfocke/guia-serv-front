import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CategoriaServico } from '../../../core/models/categoria-servico.model';
import { ServicoPublico } from '../../../core/models/servico-publico.model';
import { CategoriaService } from '../../../core/services/categoria.service';
import { ServicoService } from '../../../core/services/servico.service';
import { apiErrorMessage } from '../../../shared/utils/api-response.util';

@Component({
  selector: 'app-servicos-admin',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './servicos-admin.component.html'
})
export class ServicosAdminComponent implements OnInit {
  servicos: ServicoPublico[] = [];
  categorias: CategoriaServico[] = [];
  form: Partial<ServicoPublico> = {};
  categoriaId = '';
  filtro = '';
  exibirFormulario = false;
  erro = '';

  constructor(
    private servicoService: ServicoService,
    private categoriaService: CategoriaService
  ) {}

  ngOnInit(): void {
    this.carregar();
    this.categoriaService.listar().subscribe((categorias) => this.categorias = categorias);
  }

  get servicosFiltrados(): ServicoPublico[] {
    const termo = this.filtro.trim().toLowerCase();
    return this.servicos.filter((servico) => !termo || `${servico.nome} ${servico.descricao}`.toLowerCase().includes(termo));
  }

  carregar(): void {
    this.servicoService.listar().subscribe({
      next: (servicos) => this.servicos = servicos,
      error: (error) => this.erro = apiErrorMessage(error, 'Nao foi possivel carregar servicos.')
    });
  }

  novo(): void {
    this.form = { nome: '', descricao: '', ativo: true };
    this.categoriaId = '';
    this.exibirFormulario = true;
  }

  editar(servico: ServicoPublico): void {
    this.form = { ...servico };
    this.categoriaId = String(servico.categoria?.id ?? servico.categoriaId ?? '');
    this.exibirFormulario = true;
  }

  salvar(): void {
    const categoriaId = Number(this.categoriaId);
    const payload: Partial<ServicoPublico> = {
      ...this.form,
      categoriaId: categoriaId || undefined,
      categoria: categoriaId ? ({ id: categoriaId } as CategoriaServico) : undefined
    };
    const request = this.form.id
      ? this.servicoService.atualizar(this.form.id, payload)
      : this.servicoService.criar(payload);
    request.subscribe({
      next: () => {
        this.cancelar();
        this.carregar();
      },
      error: (error) => this.erro = apiErrorMessage(error, 'Nao foi possivel salvar o servico.')
    });
  }

  excluir(servico: ServicoPublico): void {
    if (!servico.id || !confirm(`Excluir servico "${servico.nome}"?`)) {
      return;
    }
    this.servicoService.remover(servico.id).subscribe({
      next: () => this.carregar(),
      error: (error) => this.erro = apiErrorMessage(error, 'Nao foi possivel excluir o servico.')
    });
  }

  cancelar(): void {
    this.form = {};
    this.categoriaId = '';
    this.exibirFormulario = false;
  }
}
