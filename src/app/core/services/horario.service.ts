import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { forkJoin, Observable, of } from 'rxjs';
import { map, switchMap } from 'rxjs/operators';
import { environment } from '../../../environments/environment';
import { HorarioFuncionamento } from '../models/horario-funcionamento.model';
import { ServicoPublico } from '../models/servico-publico.model';
import { UnidadeAtendimento } from '../models/unidade-atendimento.model';
import { ServicoUnidadeService } from './servico-unidade.service';

interface HorarioFuncionamentoResponse {
  id?: number;
  diaSemana: string;
  horaAbertura: string;
  horaFechamento: string;
  servicoUnidadeId?: number;
  servicoId?: number;
  servicoNome?: string;
  unidadeId?: number;
  unidadeNome?: string;
}

@Injectable({ providedIn: 'root' })
export class HorarioService {
  private apiUrl = environment.apiUrl;
  constructor(
    private http: HttpClient,
    private servicoUnidadeService: ServicoUnidadeService
  ) {}

  listar(): Observable<HorarioFuncionamento[]> {
    return this.servicoUnidadeService.listar().pipe(
      switchMap((vinculos) => {
        const consultas = vinculos
          .filter((vinculo) => Boolean(vinculo.id))
          .map((vinculo) => this.listarPorVinculo(vinculo.id as number));

        return consultas.length ? forkJoin(consultas) : of([]);
      }),
      map((grupos) => grupos.flat())
    );
  }

  buscarPorId(id: number): Observable<HorarioFuncionamento> {
    return this.listar().pipe(
      map((horarios) => {
        const horario = horarios.find((item) => item.id === id);
        if (!horario) {
          throw new Error('Horario nao encontrado.');
        }
        return horario;
      })
    );
  }

  listarPorVinculo(servicoUnidadeId: number): Observable<HorarioFuncionamento[]> {
    return this.http.get<HorarioFuncionamentoResponse[]>(`${this.apiUrl}/servicos-unidades/${servicoUnidadeId}/horarios`).pipe(
      map((response) => response.map((horario) => this.toModel(horario)))
    );
  }

  criar(horario: Partial<HorarioFuncionamento>): Observable<HorarioFuncionamento> {
    return this.http.post<HorarioFuncionamentoResponse>(`${this.apiUrl}/horarios`, this.toRequest(horario)).pipe(
      map((response) => this.toModel(response))
    );
  }

  atualizar(id: number, horario: Partial<HorarioFuncionamento>): Observable<HorarioFuncionamento> {
    return this.http.put<HorarioFuncionamentoResponse>(`${this.apiUrl}/horarios/${id}`, this.toRequest(horario)).pipe(
      map((response) => this.toModel(response))
    );
  }

  remover(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/horarios/${id}`);
  }

  getAll(): Observable<HorarioFuncionamento[]> { return this.listar(); }
  getById(id: number): Observable<HorarioFuncionamento> { return this.buscarPorId(id); }
  create(horario: Partial<HorarioFuncionamento>): Observable<HorarioFuncionamento> { return this.criar(horario); }
  update(id: number, horario: Partial<HorarioFuncionamento>): Observable<HorarioFuncionamento> { return this.atualizar(id, horario); }
  delete(id: number): Observable<void> { return this.remover(id); }

  private toModel(response: HorarioFuncionamentoResponse): HorarioFuncionamento {
    return {
      id: response.id,
      diaSemana: response.diaSemana,
      horarioAbertura: response.horaAbertura,
      horarioFechamento: response.horaFechamento,
      fechado: false,
      servicoUnidadeId: response.servicoUnidadeId,
      servicoId: response.servicoId,
      unidadeId: response.unidadeId,
      servico: response.servicoId ? {
        id: response.servicoId,
        nome: response.servicoNome ?? 'Servico',
        descricao: ''
      } as ServicoPublico : undefined,
      unidade: response.unidadeId ? {
        id: response.unidadeId,
        nome: response.unidadeNome ?? 'Unidade',
        endereco: ''
      } as UnidadeAtendimento : undefined
    };
  }

  private toRequest(horario: Partial<HorarioFuncionamento>): object {
    return {
      diaSemana: horario.diaSemana,
      horaAbertura: horario.horarioAbertura,
      horaFechamento: horario.horarioFechamento,
      servicoUnidadeId: horario.servicoUnidadeId
    };
  }
}
