import { UnidadeAtendimento } from './unidade-atendimento.model';
import { ServicoPublico } from './servico-publico.model';

export interface HorarioFuncionamento {
  id?: number;
  servico?: ServicoPublico;
  servicoId?: number;
  servicoUnidadeId?: number;
  unidade?: UnidadeAtendimento;
  unidadeId?: number;
  diaSemana: string;
  horarioAbertura: string;
  horarioFechamento: string;
  fechado?: boolean;
}
