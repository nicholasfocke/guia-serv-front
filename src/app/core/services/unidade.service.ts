import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { environment } from '../../../environments/environment';
import { UnidadeAtendimento } from '../models/unidade-atendimento.model';
import { PageResponse, extractCollection } from '../../shared/utils/api-response.util';

interface UnidadeAtendimentoResponse {
  id?: number;
  nome: string;
  endereco: string;
  bairro?: string;
  cidade?: string;
  estado?: string;
  cep?: string;
  telefone?: string;
  ativo?: boolean;
}

@Injectable({ providedIn: 'root' })
export class UnidadeService {
  private apiUrl = environment.apiUrl;
  constructor(private http: HttpClient) {}

  listar(): Observable<UnidadeAtendimento[]> {
    return this.http.get<UnidadeAtendimentoResponse[] | PageResponse<UnidadeAtendimentoResponse>>(`${this.apiUrl}/unidades`).pipe(
      map(extractCollection),
      map((unidades) => unidades.map((unidade) => this.toModel(unidade)))
    );
  }

  buscarPorId(id: number): Observable<UnidadeAtendimento> {
    return this.http.get<UnidadeAtendimentoResponse>(`${this.apiUrl}/unidades/${id}`).pipe(
      map((unidade) => this.toModel(unidade))
    );
  }

  criar(unidade: Partial<UnidadeAtendimento>): Observable<UnidadeAtendimento> {
    return this.http.post<UnidadeAtendimentoResponse>(`${this.apiUrl}/unidades`, this.toRequest(unidade)).pipe(
      map((response) => this.toModel(response))
    );
  }

  atualizar(id: number, unidade: Partial<UnidadeAtendimento>): Observable<UnidadeAtendimento> {
    return this.http.put<UnidadeAtendimentoResponse>(`${this.apiUrl}/unidades/${id}`, this.toRequest(unidade)).pipe(
      map((response) => this.toModel(response))
    );
  }

  remover(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/unidades/${id}`);
  }

  getAll(): Observable<UnidadeAtendimento[]> { return this.listar(); }
  getById(id: number): Observable<UnidadeAtendimento> { return this.buscarPorId(id); }
  create(unidade: Partial<UnidadeAtendimento>): Observable<UnidadeAtendimento> { return this.criar(unidade); }
  update(id: number, unidade: Partial<UnidadeAtendimento>): Observable<UnidadeAtendimento> { return this.atualizar(id, unidade); }
  delete(id: number): Observable<void> { return this.remover(id); }

  private toModel(response: UnidadeAtendimentoResponse): UnidadeAtendimento {
    return {
      id: response.id,
      nome: response.nome,
      endereco: response.endereco,
      bairro: response.bairro,
      cidade: response.cidade,
      estado: response.estado,
      cep: response.cep,
      telefone: response.telefone,
      ativo: response.ativo
    };
  }

  private toRequest(unidade: Partial<UnidadeAtendimento>): object {
    return {
      nome: unidade.nome,
      endereco: unidade.endereco,
      bairro: unidade.bairro,
      cidade: unidade.cidade,
      estado: unidade.estado,
      cep: unidade.cep,
      telefone: unidade.telefone
    };
  }
}
