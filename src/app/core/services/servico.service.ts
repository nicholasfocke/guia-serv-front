import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { environment } from '../../../environments/environment';
import { ServicoPublico } from '../models/servico-publico.model';
import { PageResponse, extractCollection } from '../../shared/utils/api-response.util';

interface ServicoPublicoResponse {
  id?: number;
  nome: string;
  descricao: string;
  palavrasChave?: string;
  precisaAgendamento?: boolean;
  orientacoes?: string;
  ativo?: boolean;
  categoriaId?: number;
  categoriaNome?: string;
}

@Injectable({ providedIn: 'root' })
export class ServicoService {
  private apiUrl = environment.apiUrl;
  constructor(private http: HttpClient) {}

  listar(): Observable<ServicoPublico[]> {
    return this.http.get<ServicoPublicoResponse[] | PageResponse<ServicoPublicoResponse>>(`${this.apiUrl}/servicos`).pipe(
      map(extractCollection),
      map((servicos) => servicos.map((servico) => this.toModel(servico)))
    );
  }

  buscarPorId(id: number): Observable<ServicoPublico> {
    return this.http.get<ServicoPublicoResponse>(`${this.apiUrl}/servicos/${id}`).pipe(
      map((servico) => this.toModel(servico))
    );
  }

  criar(servico: Partial<ServicoPublico>): Observable<ServicoPublico> {
    return this.http.post<ServicoPublicoResponse>(`${this.apiUrl}/servicos`, this.toRequest(servico)).pipe(
      map((response) => this.toModel(response))
    );
  }

  atualizar(id: number, servico: Partial<ServicoPublico>): Observable<ServicoPublico> {
    return this.http.put<ServicoPublicoResponse>(`${this.apiUrl}/servicos/${id}`, this.toRequest(servico)).pipe(
      map((response) => this.toModel(response))
    );
  }

  remover(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/servicos/${id}`);
  }

  getAll(): Observable<ServicoPublico[]> { return this.listar(); }
  getById(id: number): Observable<ServicoPublico> { return this.buscarPorId(id); }
  create(servico: Partial<ServicoPublico>): Observable<ServicoPublico> { return this.criar(servico); }
  update(id: number, servico: Partial<ServicoPublico>): Observable<ServicoPublico> { return this.atualizar(id, servico); }
  delete(id: number): Observable<void> { return this.remover(id); }

  private toModel(response: ServicoPublicoResponse): ServicoPublico {
    return {
      id: response.id,
      nome: response.nome,
      descricao: response.descricao,
      palavrasChave: response.palavrasChave,
      precisaAgendamento: response.precisaAgendamento,
      orientacoes: response.orientacoes,
      ativo: response.ativo,
      categoriaId: response.categoriaId,
      categoria: response.categoriaId ? {
        id: response.categoriaId,
        nome: response.categoriaNome ?? 'Categoria',
        descricao: ''
      } : undefined
    };
  }

  private toRequest(servico: Partial<ServicoPublico>): object {
    return {
      nome: servico.nome,
      descricao: servico.descricao,
      palavrasChave: servico.palavrasChave,
      precisaAgendamento: servico.precisaAgendamento ?? false,
      orientacoes: servico.orientacoes,
      categoriaId: servico.categoriaId ?? servico.categoria?.id
    };
  }
}

