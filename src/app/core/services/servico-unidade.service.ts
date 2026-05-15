import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { forkJoin, Observable, of, throwError } from 'rxjs';
import { map, switchMap } from 'rxjs/operators';
import { environment } from '../../../environments/environment';
import { ServicoPublico } from '../models/servico-publico.model';
import { ServicoUnidade } from '../models/servico-unidade.model';
import { UnidadeAtendimento } from '../models/unidade-atendimento.model';
import { PageResponse, extractCollection } from '../../shared/utils/api-response.util';

interface ServicoUnidadeResponse {
  id?: number;
  servicoId?: number;
  servicoNome?: string;
  unidadeId?: number;
  unidadeNome?: string;
  endereco?: string;
  bairro?: string;
  cidade?: string;
  estado?: string;
  cep?: string;
  telefone?: string;
  observacoes?: string;
}

@Injectable({ providedIn: 'root' })
export class ServicoUnidadeService {
  private apiUrl = environment.apiUrl;
  constructor(private http: HttpClient) {}

  listar(): Observable<ServicoUnidade[]> {
    return this.http.get<ServicoPublico[] | PageResponse<ServicoPublico>>(`${this.apiUrl}/servicos`).pipe(
      map(extractCollection),
      switchMap((servicos) => {
        const consultas = servicos
          .filter((servico) => Boolean(servico.id))
          .map((servico) => this.listarPorServico(servico.id as number));

        return consultas.length ? forkJoin(consultas) : of([]);
      }),
      map((grupos) => grupos.flat())
    );
  }

  buscarPorId(id: number): Observable<ServicoUnidade> {
    return this.listar().pipe(
      map((vinculos) => {
        const vinculo = vinculos.find((item) => item.id === id);
        if (!vinculo) {
          throw new Error('Vinculo nao encontrado.');
        }
        return vinculo;
      })
    );
  }

  listarPorServico(servicoId: number): Observable<ServicoUnidade[]> {
    return this.http.get<ServicoUnidadeResponse[]>(`${this.apiUrl}/servicos/${servicoId}/unidades`).pipe(
      map((response) => response.map((vinculo) => this.toModel(vinculo)))
    );
  }

  listarPorUnidade(unidadeId: number): Observable<ServicoUnidade[]> {
    return this.http.get<ServicoUnidadeResponse[]>(`${this.apiUrl}/unidades/${unidadeId}/servicos`).pipe(
      map((response) => response.map((vinculo) => this.toModel(vinculo)))
    );
  }

  criar(vinculo: Partial<ServicoUnidade>): Observable<ServicoUnidade> {
    const servicoId = vinculo.servicoId ?? vinculo.servico?.id;
    const unidadeId = vinculo.unidadeId ?? vinculo.unidade?.id;

    if (!servicoId || !unidadeId) {
      return throwError(() => new Error('Servico e unidade sao obrigatorios.'));
    }

    return this.http.post<ServicoUnidadeResponse>(
      `${this.apiUrl}/servicos/${servicoId}/unidades/${unidadeId}`,
      { observacoes: vinculo.observacoes }
    ).pipe(
      map((response) => this.toModel(response))
    );
  }

  atualizar(id: number, vinculo: Partial<ServicoUnidade>): Observable<ServicoUnidade> {
    return this.criar(vinculo);
  }

  remover(id: number): Observable<void> {
    return this.buscarPorId(id).pipe(
      switchMap((vinculo) => this.desvincular(
        vinculo.servicoId ?? vinculo.servico?.id,
        vinculo.unidadeId ?? vinculo.unidade?.id
      ))
    );
  }

  desvincular(servicoId?: number, unidadeId?: number): Observable<void> {
    if (!servicoId || !unidadeId) {
      return throwError(() => new Error('Servico e unidade sao obrigatorios.'));
    }

    return this.http.delete<void>(`${this.apiUrl}/servicos/${servicoId}/unidades/${unidadeId}`);
  }

  private toModel(response: ServicoUnidadeResponse): ServicoUnidade {
    const servicoId = response.servicoId;
    const unidadeId = response.unidadeId;

    return {
      id: response.id,
      servicoId,
      unidadeId,
      observacoes: response.observacoes,
      servico: servicoId ? {
        id: servicoId,
        nome: response.servicoNome ?? 'Servico vinculado',
        descricao: ''
      } as ServicoPublico : undefined,
      unidade: unidadeId ? {
        id: unidadeId,
        nome: response.unidadeNome ?? 'Unidade vinculada',
        endereco: response.endereco ?? '',
        bairro: response.bairro,
        cidade: response.cidade,
        estado: response.estado,
        cep: response.cep,
        telefone: response.telefone
      } as UnidadeAtendimento : undefined
    };
  }

  getAll(): Observable<ServicoUnidade[]> { return this.listar(); }
  getById(id: number): Observable<ServicoUnidade> { return this.buscarPorId(id); }
  create(vinculo: Partial<ServicoUnidade>): Observable<ServicoUnidade> { return this.criar(vinculo); }
  update(id: number, vinculo: Partial<ServicoUnidade>): Observable<ServicoUnidade> { return this.atualizar(id, vinculo); }
  delete(id: number): Observable<void> { return this.remover(id); }
}
