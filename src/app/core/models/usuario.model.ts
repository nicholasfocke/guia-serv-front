import { Perfil } from './perfil.model';

export interface Usuario {
  id?: number;
  nome: string;
  email: string;
  perfil?: Perfil | string;
  token?: string;
}
