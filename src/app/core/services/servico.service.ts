import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { environment } from '../../../environments/environment';
import { ServicoPublico } from '../models/servico-publico.model';
import { PageResponse, extractCollection } from '../../shared/utils/api-response.util';

@Injectable({ providedIn: 'root' })
export class ServicoService {
  private apiUrl = environment.apiUrl;
  constructor(private http: HttpClient) {}

  listar(): Observable<ServicoPublico[]> {
    return this.http.get<ServicoPublico[] | PageResponse<ServicoPublico>>(`${this.apiUrl}/servicos`).pipe(
      map(extractCollection)
    );
  }

  buscarPorId(id: number): Observable<ServicoPublico> {
    return this.http.get<ServicoPublico>(`${this.apiUrl}/servicos/${id}`);
  }

  criar(servico: Partial<ServicoPublico>): Observable<ServicoPublico> {
    return this.http.post<ServicoPublico>(`${this.apiUrl}/servicos`, servico);
  }

  atualizar(id: number, servico: Partial<ServicoPublico>): Observable<ServicoPublico> {
    return this.http.put<ServicoPublico>(`${this.apiUrl}/servicos/${id}`, servico);
  }

  remover(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/servicos/${id}`);
  }

  getAll(): Observable<ServicoPublico[]> { return this.listar(); }
  getById(id: number): Observable<ServicoPublico> { return this.buscarPorId(id); }
  create(servico: Partial<ServicoPublico>): Observable<ServicoPublico> { return this.criar(servico); }
  update(id: number, servico: Partial<ServicoPublico>): Observable<ServicoPublico> { return this.atualizar(id, servico); }
  delete(id: number): Observable<void> { return this.remover(id); }
}

