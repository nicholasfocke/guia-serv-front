import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { environment } from '../../../environments/environment';
import { CategoriaServico } from '../models/categoria-servico.model';
import { PageResponse, extractCollection } from '../../shared/utils/api-response.util';

@Injectable({ providedIn: 'root' })
export class CategoriaService {
  private apiUrl = environment.apiUrl;
  constructor(private http: HttpClient) {}

  listar(): Observable<CategoriaServico[]> {
    return this.http.get<CategoriaServico[] | PageResponse<CategoriaServico>>(`${this.apiUrl}/categorias`).pipe(
      map(extractCollection)
    );
  }

  buscarPorId(id: number): Observable<CategoriaServico> {
    return this.http.get<CategoriaServico>(`${this.apiUrl}/categorias/${id}`);
  }

  criar(categoria: Partial<CategoriaServico>): Observable<CategoriaServico> {
    return this.http.post<CategoriaServico>(`${this.apiUrl}/categorias`, categoria);
  }

  atualizar(id: number, categoria: Partial<CategoriaServico>): Observable<CategoriaServico> {
    return this.http.put<CategoriaServico>(`${this.apiUrl}/categorias/${id}`, categoria);
  }

  remover(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/categorias/${id}`);
  }

  getAll(): Observable<CategoriaServico[]> { return this.listar(); }
  getById(id: number): Observable<CategoriaServico> { return this.buscarPorId(id); }
  create(categoria: Partial<CategoriaServico>): Observable<CategoriaServico> { return this.criar(categoria); }
  update(id: number, categoria: Partial<CategoriaServico>): Observable<CategoriaServico> { return this.atualizar(id, categoria); }
  delete(id: number): Observable<void> { return this.remover(id); }
}
