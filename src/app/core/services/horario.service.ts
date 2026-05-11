import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { environment } from '../../../environments/environment';
import { HorarioFuncionamento } from '../models/horario-funcionamento.model';
import { PageResponse, extractCollection } from '../../shared/utils/api-response.util';

@Injectable({ providedIn: 'root' })
export class HorarioService {
  private apiUrl = environment.apiUrl;
  constructor(private http: HttpClient) {}

  listar(): Observable<HorarioFuncionamento[]> {
    return this.http.get<HorarioFuncionamento[] | PageResponse<HorarioFuncionamento>>(`${this.apiUrl}/horarios`).pipe(
      map(extractCollection)
    );
  }

  buscarPorId(id: number): Observable<HorarioFuncionamento> {
    return this.http.get<HorarioFuncionamento>(`${this.apiUrl}/horarios/${id}`);
  }

  criar(horario: Partial<HorarioFuncionamento>): Observable<HorarioFuncionamento> {
    return this.http.post<HorarioFuncionamento>(`${this.apiUrl}/horarios`, horario);
  }

  atualizar(id: number, horario: Partial<HorarioFuncionamento>): Observable<HorarioFuncionamento> {
    return this.http.put<HorarioFuncionamento>(`${this.apiUrl}/horarios/${id}`, horario);
  }

  remover(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/horarios/${id}`);
  }

  getAll(): Observable<HorarioFuncionamento[]> { return this.listar(); }
  getById(id: number): Observable<HorarioFuncionamento> { return this.buscarPorId(id); }
  create(horario: Partial<HorarioFuncionamento>): Observable<HorarioFuncionamento> { return this.criar(horario); }
  update(id: number, horario: Partial<HorarioFuncionamento>): Observable<HorarioFuncionamento> { return this.atualizar(id, horario); }
  delete(id: number): Observable<void> { return this.remover(id); }
}
