import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { environment } from '../../../environments/environment';
import { ServicoUnidade } from '../models/servico-unidade.model';
import { PageResponse, extractCollection } from '../../shared/utils/api-response.util';

@Injectable({ providedIn: 'root' })
export class ServicoUnidadeService {
  private apiUrl = environment.apiUrl;
  constructor(private http: HttpClient) {}

  listar(): Observable<ServicoUnidade[]> {
    return this.http.get<ServicoUnidade[] | PageResponse<ServicoUnidade>>(`${this.apiUrl}/vinculos`).pipe(
      map(extractCollection)
    );
  }

  buscarPorId(id: number): Observable<ServicoUnidade> {
    return this.http.get<ServicoUnidade>(`${this.apiUrl}/vinculos/${id}`);
  }

  criar(vinculo: Partial<ServicoUnidade>): Observable<ServicoUnidade> {
    return this.http.post<ServicoUnidade>(`${this.apiUrl}/vinculos`, vinculo);
  }

  atualizar(id: number, vinculo: Partial<ServicoUnidade>): Observable<ServicoUnidade> {
    return this.http.put<ServicoUnidade>(`${this.apiUrl}/vinculos/${id}`, vinculo);
  }

  remover(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/vinculos/${id}`);
  }

  getAll(): Observable<ServicoUnidade[]> { return this.listar(); }
  getById(id: number): Observable<ServicoUnidade> { return this.buscarPorId(id); }
  create(vinculo: Partial<ServicoUnidade>): Observable<ServicoUnidade> { return this.criar(vinculo); }
  update(id: number, vinculo: Partial<ServicoUnidade>): Observable<ServicoUnidade> { return this.atualizar(id, vinculo); }
  delete(id: number): Observable<void> { return this.remover(id); }
}
