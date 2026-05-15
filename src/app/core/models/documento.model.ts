import { ServicoPublico } from './servico-publico.model';

export interface Documento {
  id?: number;
  nome: string;
  descricao?: string;
  obrigatorio?: boolean;
  servico?: ServicoPublico;
  servicoId?: number;
  servicos?: ServicoPublico[];
  servicoIds?: number[];
}
