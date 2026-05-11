import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { environment } from '../../../environments/environment';
import { UnidadeAtendimento } from '../models/unidade-atendimento.model';
import { PageResponse, extractCollection } from '../../shared/utils/api-response.util';

@Injectable({ providedIn: 'root' })
export class UnidadeService {
  private apiUrl = environment.apiUrl;
  constructor(private http: HttpClient) {}

  listar(): Observable<UnidadeAtendimento[]> {
    return this.http.get<UnidadeAtendimento[] | PageResponse<UnidadeAtendimento>>(`${this.apiUrl}/unidades`).pipe(
      map(extractCollection)
    );
  }

  buscarPorId(id: number): Observable<UnidadeAtendimento> {
    return this.http.get<UnidadeAtendimento>(`${this.apiUrl}/unidades/${id}`);
  }

  criar(unidade: Partial<UnidadeAtendimento>): Observable<UnidadeAtendimento> {
    return this.http.post<UnidadeAtendimento>(`${this.apiUrl}/unidades`, unidade);
  }

  atualizar(id: number, unidade: Partial<UnidadeAtendimento>): Observable<UnidadeAtendimento> {
    return this.http.put<UnidadeAtendimento>(`${this.apiUrl}/unidades/${id}`, unidade);
  }

  remover(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/unidades/${id}`);
  }

  getAll(): Observable<UnidadeAtendimento[]> { return this.listar(); }
  getById(id: number): Observable<UnidadeAtendimento> { return this.buscarPorId(id); }
  create(unidade: Partial<UnidadeAtendimento>): Observable<UnidadeAtendimento> { return this.criar(unidade); }
  update(id: number, unidade: Partial<UnidadeAtendimento>): Observable<UnidadeAtendimento> { return this.atualizar(id, unidade); }
  delete(id: number): Observable<void> { return this.remover(id); }
}

