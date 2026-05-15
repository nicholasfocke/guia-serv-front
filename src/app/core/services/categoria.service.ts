import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { environment } from '../../../environments/environment';
import { CategoriaServico } from '../models/categoria-servico.model';
import { PageResponse, extractCollection } from '../../shared/utils/api-response.util';

interface CategoriaServicoResponse {
  id?: number;
  nome: string;
  descricao: string;
  ativa?: boolean;
}

@Injectable({ providedIn: 'root' })
export class CategoriaService {
  private apiUrl = environment.apiUrl;
  constructor(private http: HttpClient) {}

  listar(): Observable<CategoriaServico[]> {
    return this.http.get<CategoriaServicoResponse[] | PageResponse<CategoriaServicoResponse>>(`${this.apiUrl}/categorias`).pipe(
      map(extractCollection),
      map((categorias) => categorias.map((categoria) => this.toModel(categoria)))
    );
  }

  buscarPorId(id: number): Observable<CategoriaServico> {
    return this.http.get<CategoriaServicoResponse>(`${this.apiUrl}/categorias/${id}`).pipe(
      map((categoria) => this.toModel(categoria))
    );
  }

  criar(categoria: Partial<CategoriaServico>): Observable<CategoriaServico> {
    return this.http.post<CategoriaServicoResponse>(`${this.apiUrl}/categorias`, this.toRequest(categoria)).pipe(
      map((response) => this.toModel(response))
    );
  }

  atualizar(id: number, categoria: Partial<CategoriaServico>): Observable<CategoriaServico> {
    return this.http.put<CategoriaServicoResponse>(`${this.apiUrl}/categorias/${id}`, this.toRequest(categoria)).pipe(
      map((response) => this.toModel(response))
    );
  }

  remover(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/categorias/${id}`);
  }

  getAll(): Observable<CategoriaServico[]> { return this.listar(); }
  getById(id: number): Observable<CategoriaServico> { return this.buscarPorId(id); }
  create(categoria: Partial<CategoriaServico>): Observable<CategoriaServico> { return this.criar(categoria); }
  update(id: number, categoria: Partial<CategoriaServico>): Observable<CategoriaServico> { return this.atualizar(id, categoria); }
  delete(id: number): Observable<void> { return this.remover(id); }

  private toModel(response: CategoriaServicoResponse): CategoriaServico {
    return {
      id: response.id,
      nome: response.nome,
      descricao: response.descricao,
      ativo: response.ativa
    };
  }

  private toRequest(categoria: Partial<CategoriaServico>): object {
    return {
      nome: categoria.nome,
      descricao: categoria.descricao
    };
  }
}
