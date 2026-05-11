import { UnidadeAtendimento } from './unidade-atendimento.model';

export interface HorarioFuncionamento {
  id?: number;
  unidade?: UnidadeAtendimento;
  unidadeId?: number;
  diaSemana: string;
  horarioAbertura: string;
  horarioFechamento: string;
  fechado?: boolean;
}
