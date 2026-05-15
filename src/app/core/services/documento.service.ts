import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { forkJoin, Observable, of } from 'rxjs';
import { map, switchMap } from 'rxjs/operators';
import { environment } from '../../../environments/environment';
import { Documento } from '../models/documento.model';
import { ServicoPublico } from '../models/servico-publico.model';
import { PageResponse, extractCollection } from '../../shared/utils/api-response.util';

interface DocumentoResponse {
  id?: number;
  nome: string;
  descricao?: string;
}

interface ServicoDocumentoResponse {
  id?: number;
  servicoId?: number;
  servicoNome?: string;
  documentoId?: number;
  documentoNome?: string;
  documentoDescricao?: string;
  obrigatorio?: boolean;
  observacoes?: string;
}

@Injectable({ providedIn: 'root' })
export class DocumentoService {
  private apiUrl = environment.apiUrl;
  constructor(private http: HttpClient) {}

  listar(): Observable<Documento[]> {
    return forkJoin({
      documentos: this.http.get<DocumentoResponse[] | PageResponse<DocumentoResponse>>(`${this.apiUrl}/documentos`).pipe(
        map(extractCollection),
        map((documentos) => documentos.map((documento) => this.toModel(documento)))
      ),
      servicos: this.http.get<ServicoPublico[] | PageResponse<ServicoPublico>>(`${this.apiUrl}/servicos`).pipe(
        map(extractCollection)
      )
    }).pipe(
      switchMap(({ documentos, servicos }) => {
        const consultas = servicos
          .filter((servico) => Boolean(servico.id))
          .map((servico) => this.listarPorServico(servico.id as number));

        return consultas.length
          ? forkJoin(consultas).pipe(map((grupos) => ({ documentos, vinculos: grupos.flat() })))
          : of({ documentos, vinculos: [] as Documento[] });
      }),
      map(({ documentos, vinculos }) => documentos.map((documento) => {
        const vinculosDoDocumento = vinculos.filter((vinculo) => vinculo.id === documento.id);
        const servicos = vinculosDoDocumento
          .map((vinculo) => vinculo.servico)
          .filter((servico): servico is NonNullable<typeof servico> => Boolean(servico));

        return {
          ...documento,
          obrigatorio: vinculosDoDocumento.some((vinculo) => vinculo.obrigatorio),
          servicos,
          servicoIds: servicos.map((servico) => servico.id).filter((id): id is number => Boolean(id))
        };
      }))
    );
  }

  buscarPorId(id: number): Observable<Documento> {
    return this.listar().pipe(
      map((documentos) => {
        const documento = documentos.find((item) => item.id === id);
        if (!documento) {
          throw new Error('Documento nao encontrado.');
        }
        return documento;
      })
    );
  }

  listarPorServico(servicoId: number): Observable<Documento[]> {
    return this.http.get<ServicoDocumentoResponse[]>(`${this.apiUrl}/servicos/${servicoId}/documentos`).pipe(
      map((response) => response.map((documento) => this.toModelFromVinculo(documento)))
    );
  }

  criar(documento: Partial<Documento>): Observable<Documento> {
    return this.http.post<DocumentoResponse>(`${this.apiUrl}/documentos`, this.toRequest(documento)).pipe(
      map((response) => this.toModel(response))
    );
  }

  atualizar(id: number, documento: Partial<Documento>): Observable<Documento> {
    return this.http.put<DocumentoResponse>(`${this.apiUrl}/documentos/${id}`, this.toRequest(documento)).pipe(
      map((response) => this.toModel(response))
    );
  }

  remover(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/documentos/${id}`);
  }

  vincular(servicoId: number, documentoId: number, obrigatorio: boolean): Observable<Documento> {
    return this.http.post<ServicoDocumentoResponse>(
      `${this.apiUrl}/servicos/${servicoId}/documentos/${documentoId}`,
      { obrigatorio }
    ).pipe(
      map((response) => this.toModelFromVinculo(response))
    );
  }

  atualizarVinculo(servicoId: number, documentoId: number, obrigatorio: boolean): Observable<Documento> {
    return this.http.put<ServicoDocumentoResponse>(
      `${this.apiUrl}/servicos/${servicoId}/documentos/${documentoId}`,
      { obrigatorio }
    ).pipe(
      map((response) => this.toModelFromVinculo(response))
    );
  }

  desvincular(servicoId: number, documentoId: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/servicos/${servicoId}/documentos/${documentoId}`);
  }

  getAll(): Observable<Documento[]> { return this.listar(); }
  getById(id: number): Observable<Documento> { return this.buscarPorId(id); }
  create(documento: Partial<Documento>): Observable<Documento> { return this.criar(documento); }
  update(id: number, documento: Partial<Documento>): Observable<Documento> { return this.atualizar(id, documento); }
  delete(id: number): Observable<void> { return this.remover(id); }

  private toModel(response: DocumentoResponse): Documento {
    return {
      id: response.id,
      nome: response.nome,
      descricao: response.descricao
    };
  }

  private toModelFromVinculo(response: ServicoDocumentoResponse): Documento {
    return {
      id: response.documentoId,
      nome: response.documentoNome ?? 'Documento',
      descricao: response.documentoDescricao,
      obrigatorio: response.obrigatorio,
      servicoId: response.servicoId,
      servicoIds: response.servicoId ? [response.servicoId] : [],
      servico: response.servicoId ? {
        id: response.servicoId,
        nome: response.servicoNome ?? 'Servico',
        descricao: ''
      } as ServicoPublico : undefined,
      servicos: response.servicoId ? [{
        id: response.servicoId,
        nome: response.servicoNome ?? 'Servico',
        descricao: ''
      } as ServicoPublico] : []
    };
  }

  private toRequest(documento: Partial<Documento>): object {
    return {
      nome: documento.nome,
      descricao: documento.descricao
    };
  }
}
