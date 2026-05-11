import { CategoriaServico } from './categoria-servico.model';
import { Documento } from './documento.model';
import { UnidadeAtendimento } from './unidade-atendimento.model';

export interface ServicoPublico {
  id?: number;
  nome: string;
  descricao: string;
  categoria?: CategoriaServico;
  categoriaId?: number;
  documentos?: Documento[];
  unidades?: UnidadeAtendimento[];
  prazoEstimado?: string;
  orientacoes?: string;
  ativo?: boolean;
}
