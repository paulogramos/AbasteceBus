export type Perfil = 'gestor' | 'motorista' | 'frentista';

export interface Usuario {
  id: number;
  nome: string;
  login: string;
  hashSenha: string;
  perfil: Perfil;
  ativo: boolean;
}

export interface DadosAutenticacao {
  idUsuario: number;
  perfil: Perfil;
}

export interface Motorista {
  id: number;
  nome: string;
  cnh: string;
  telefone: string;
  ativo: boolean;
}

export interface Veiculo {
  id: number;
  placa: string;
  modelo: string;
  tipo: string;
  ano: number;
  ativo: boolean;
}

export interface Posto {
  id: number;
  nome: string;
  endereco: string;
  cnpj: string;
  ativo: boolean;
}
