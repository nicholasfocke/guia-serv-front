import { Usuario } from './usuario.model';
import { ServicoPublico } from './servico-publico.model';

export interface Avaliacao {
  id?: number;
  usuario?: Usuario;
  servico?: ServicoPublico;
  servicoId?: number;
  nota: number;
  comentario?: string;
  data?: string;
}
