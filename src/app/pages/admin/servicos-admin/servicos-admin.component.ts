import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CategoriaServico } from '../../../core/models/categoria-servico.model';
import { ServicoPublico } from '../../../core/models/servico-publico.model';
import { CategoriaService } from '../../../core/services/categoria.service';
import { ServicoService } from '../../../core/services/servico.service';
import { apiErrorMessage } from '../../../shared/utils/api-response.util';

interface ServicoForm {
  id?: number;
  nome: string;
  descricao: string;
  ativo: boolean;
}

@Component({
  selector: 'app-servicos-admin',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './servicos-admin.component.html'
})
export class ServicosAdminComponent implements OnInit {
  servicos: ServicoPublico[] = [];
  categorias: CategoriaServico[] = [];
  form: ServicoForm = this.novoForm();
  public palavrasChave: string = '';
  public precisaAgendamento: boolean = false;
  public orientacoes: string = '';
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
      next: (servicos) => {
        this.servicos = servicos;
        this.erro = '';
      },
      error: (error) => this.erro = apiErrorMessage(error, 'Nao foi possivel carregar servicos.')
    });
  }

  novo(): void {
    this.form = this.novoForm();
    this.palavrasChave = '';
    this.precisaAgendamento = false;
    this.orientacoes = '';
    this.categoriaId = '';
    this.exibirFormulario = true;
  }

  editar(servico: ServicoPublico): void {
    this.form = {
      id: servico.id,
      nome: servico.nome,
      descricao: servico.descricao,
      ativo: servico.ativo ?? true
    };
    this.palavrasChave = servico.palavrasChave ?? '';
    this.precisaAgendamento = servico.precisaAgendamento ?? false;
    this.orientacoes = servico.orientacoes ?? '';
    this.categoriaId = String(servico.categoria?.id ?? servico.categoriaId ?? '');
    this.exibirFormulario = true;
  }

  salvar(): void {
    this.erro = '';
    const categoriaId = Number(this.categoriaId);
    const payload: Partial<ServicoPublico> = {
      ...this.form,
      palavrasChave: this.palavrasChave,
      precisaAgendamento: this.precisaAgendamento,
      orientacoes: this.orientacoes,
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
      next: () => {
        this.erro = '';
        this.carregar();
      },
      error: (error) => this.erro = apiErrorMessage(error, 'Nao foi possivel excluir o servico.')
    });
  }

  cancelar(): void {
    this.form = this.novoForm();
    this.palavrasChave = '';
    this.precisaAgendamento = false;
    this.orientacoes = '';
    this.categoriaId = '';
    this.exibirFormulario = false;
  }

  private novoForm(): ServicoForm {
    return {
      nome: '',
      descricao: '',
      ativo: true
    };
  }
}
