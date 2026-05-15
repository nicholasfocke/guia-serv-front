import { Usuario } from './usuario.model';
import { ServicoPublico } from './servico-publico.model';
import { UnidadeAtendimento } from './unidade-atendimento.model';

export interface Avaliacao {
  id?: number;
  usuario?: Usuario;
  servico?: ServicoPublico;
  unidade?: UnidadeAtendimento;
  servicoId?: number;
  unidadeId?: number;
  nota: number;
  comentario?: string;
  data?: string;
}
