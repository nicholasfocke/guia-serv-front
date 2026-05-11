export interface UnidadeAtendimento {
  id?: number;
  nome: string;
  endereco: string;
  telefone?: string;
  email?: string;
  bairro?: string;
  cidade?: string;
  estado?: string;
  cep?: string;
  ativo?: boolean;
}
