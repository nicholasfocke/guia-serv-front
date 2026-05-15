import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { environment } from '../../../environments/environment';
import { Avaliacao } from '../models/avaliacao.model';
import { ServicoPublico } from '../models/servico-publico.model';
import { UnidadeAtendimento } from '../models/unidade-atendimento.model';
import { PageResponse, extractCollection } from '../../shared/utils/api-response.util';

interface AvaliacaoResponse {
  id?: number;
  nota: number;
  comentario?: string;
  servicoId?: number;
  servicoNome?: string;
  unidadeId?: number;
  unidadeNome?: string;
  criadoEm?: string;
}

@Injectable({ providedIn: 'root' })
export class AvaliacaoService {
  private apiUrl = environment.apiUrl;
  constructor(private http: HttpClient) {}

  getByServico(servicoId: number): Observable<Avaliacao[]> {
    return this.http.get<AvaliacaoResponse[] | PageResponse<AvaliacaoResponse>>(`${this.apiUrl}/servicos/${servicoId}/avaliacoes`).pipe(
      map(extractCollection),
      map((avaliacoes) => avaliacoes.map((avaliacao) => this.toModel(avaliacao)))
    );
  }

  getByUnidade(unidadeId: number): Observable<Avaliacao[]> {
    return this.http.get<AvaliacaoResponse[] | PageResponse<AvaliacaoResponse>>(`${this.apiUrl}/unidades/${unidadeId}/avaliacoes`).pipe(
      map(extractCollection),
      map((avaliacoes) => avaliacoes.map((avaliacao) => this.toModel(avaliacao)))
    );
  }

  criar(avaliacao: Avaliacao): Observable<Avaliacao> {
    return this.http.post<AvaliacaoResponse>(`${this.apiUrl}/avaliacoes`, avaliacao).pipe(
      map((response) => this.toModel(response))
    );
  }

  listar(): Observable<Avaliacao[]> {
    return this.http.get<AvaliacaoResponse[] | PageResponse<AvaliacaoResponse>>(`${this.apiUrl}/avaliacoes`).pipe(
      map(extractCollection),
      map((avaliacoes) => avaliacoes.map((avaliacao) => this.toModel(avaliacao)))
    );
  }

  private toModel(response: AvaliacaoResponse): Avaliacao {
    return {
      id: response.id,
      nota: response.nota,
      comentario: response.comentario,
      servicoId: response.servicoId,
      unidadeId: response.unidadeId,
      data: response.criadoEm,
      servico: response.servicoId ? {
        id: response.servicoId,
        nome: response.servicoNome ?? 'Servico',
        descricao: ''
      } as ServicoPublico : undefined,
      unidade: response.unidadeId ? {
        id: response.unidadeId,
        nome: response.unidadeNome ?? 'Unidade',
        endereco: ''
      } as UnidadeAtendimento : undefined
    };
  }
}

