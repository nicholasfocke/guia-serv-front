import { ServicoPublico } from './servico-publico.model';
import { UnidadeAtendimento } from './unidade-atendimento.model';

export interface ServicoUnidade {
  id?: number;
  servico?: ServicoPublico;
  unidade?: UnidadeAtendimento;
  servicoId?: number;
  unidadeId?: number;
  observacoes?: string;
}
