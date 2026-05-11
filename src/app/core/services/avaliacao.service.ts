import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { environment } from '../../../environments/environment';
import { Avaliacao } from '../models/avaliacao.model';
import { PageResponse, extractCollection } from '../../shared/utils/api-response.util';

@Injectable({ providedIn: 'root' })
export class AvaliacaoService {
  private apiUrl = environment.apiUrl;
  constructor(private http: HttpClient) {}

  getByServico(servicoId: number): Observable<Avaliacao[]> {
    return this.http.get<Avaliacao[] | PageResponse<Avaliacao>>(`${this.apiUrl}/servicos/${servicoId}/avaliacoes`).pipe(
      map(extractCollection)
    );
  }

  criar(avaliacao: Avaliacao): Observable<Avaliacao> {
    return this.http.post<Avaliacao>(`${this.apiUrl}/avaliacoes`, avaliacao);
  }

  listar(): Observable<Avaliacao[]> {
    return this.http.get<Avaliacao[] | PageResponse<Avaliacao>>(`${this.apiUrl}/avaliacoes`).pipe(
      map(extractCollection)
    );
  }
}

