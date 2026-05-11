import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { environment } from '../../../environments/environment';
import { Documento } from '../models/documento.model';
import { PageResponse, extractCollection } from '../../shared/utils/api-response.util';

@Injectable({ providedIn: 'root' })
export class DocumentoService {
  private apiUrl = environment.apiUrl;
  constructor(private http: HttpClient) {}

  listar(): Observable<Documento[]> {
    return this.http.get<Documento[] | PageResponse<Documento>>(`${this.apiUrl}/documentos`).pipe(
      map(extractCollection)
    );
  }

  buscarPorId(id: number): Observable<Documento> {
    return this.http.get<Documento>(`${this.apiUrl}/documentos/${id}`);
  }

  criar(documento: Partial<Documento>): Observable<Documento> {
    return this.http.post<Documento>(`${this.apiUrl}/documentos`, documento);
  }

  atualizar(id: number, documento: Partial<Documento>): Observable<Documento> {
    return this.http.put<Documento>(`${this.apiUrl}/documentos/${id}`, documento);
  }

  remover(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/documentos/${id}`);
  }

  getAll(): Observable<Documento[]> { return this.listar(); }
  getById(id: number): Observable<Documento> { return this.buscarPorId(id); }
  create(documento: Partial<Documento>): Observable<Documento> { return this.criar(documento); }
  update(id: number, documento: Partial<Documento>): Observable<Documento> { return this.atualizar(id, documento); }
  delete(id: number): Observable<void> { return this.remover(id); }
}
