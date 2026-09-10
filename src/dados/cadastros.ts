import { Motorista, Veiculo, Posto } from '../tipos';

// ==================== MOTORISTAS ====================
let proximoIdMotorista = 4;

export const motoristas: Motorista[] = [
  { id: 1, nome: 'Carlos Silva', cnh: '12345678901', telefone: '11999990001', ativo: true },
  { id: 2, nome: 'Ana Souza', cnh: '12345678902', telefone: '11999990002', ativo: true },
  { id: 3, nome: 'Pedro Lima', cnh: '12345678903', telefone: '11999990003', ativo: true },
];

export function buscarTodosMotoristas(): Motorista[] {
  return [...motoristas];
}

export function buscarMotoristaPorId(id: number): Motorista | undefined {
  return motoristas.find((m) => m.id === id);
}

export function cadastrarMotorista(dados: Omit<Motorista, 'id' | 'ativo'>): Motorista {
  const novo: Motorista = { ...dados, id: proximoIdMotorista++, ativo: true };
  motoristas.push(novo);
  return novo;
}

export function editarMotorista(id: number, dados: Partial<Omit<Motorista, 'id' | 'ativo'>>): Motorista | undefined {
  const m = buscarMotoristaPorId(id);
  if (!m) return undefined;
  Object.assign(m, dados);
  return m;
}

export function alternarStatusMotorista(id: number, ativo: boolean): Motorista | undefined {
  const m = buscarMotoristaPorId(id);
  if (!m) return undefined;
  m.ativo = ativo;
  return m;
}

export function cnhUnica(cnh: string, ignorarId?: number): boolean {
  return !motoristas.some((m) => m.cnh === cnh && m.id !== ignorarId);
}

// ==================== VEICULOS ====================
let proximoIdVeiculo = 4;

export const veiculos: Veiculo[] = [
  { id: 1, placa: 'ABC1D23', modelo: 'Fiat Uno', tipo: 'Leve', ano: 2020, ativo: true },
  { id: 2, placa: 'EFG4H56', modelo: 'Volkswagen Gol', tipo: 'Leve', ano: 2021, ativo: true },
  { id: 3, placa: 'IJK7L89', modelo: 'Mercedes Atego', tipo: 'Pesado', ano: 2019, ativo: true },
];

export function buscarTodosVeiculos(): Veiculo[] {
  return [...veiculos];
}

export function buscarVeiculoPorId(id: number): Veiculo | undefined {
  return veiculos.find((v) => v.id === id);
}

export function cadastrarVeiculo(dados: Omit<Veiculo, 'id' | 'ativo'>): Veiculo {
  const novo: Veiculo = { ...dados, id: proximoIdVeiculo++, ativo: true };
  veiculos.push(novo);
  return novo;
}

export function editarVeiculo(id: number, dados: Partial<Omit<Veiculo, 'id' | 'ativo'>>): Veiculo | undefined {
  const v = buscarVeiculoPorId(id);
  if (!v) return undefined;
  Object.assign(v, dados);
  return v;
}

export function alternarStatusVeiculo(id: number, ativo: boolean): Veiculo | undefined {
  const v = buscarVeiculoPorId(id);
  if (!v) return undefined;
  v.ativo = ativo;
  return v;
}

export function placaUnica(placa: string, ignorarId?: number): boolean {
  return !veiculos.some((v) => v.placa === placa && v.id !== ignorarId);
}

// ==================== POSTOS ====================
let proximoIdPosto = 4;

export const postos: Posto[] = [
  { id: 1, nome: 'Posto Ipiranga', endereco: 'Rua A, 100', cnpj: '12345678000190', ativo: true },
  { id: 2, nome: 'Posto Shell', endereco: 'Rua B, 200', cnpj: '12345678000271', ativo: true },
  { id: 3, nome: 'Posto Petrobras', endereco: 'Rua C, 300', cnpj: '12345678000352', ativo: true },
];

export function buscarTodosPostos(): Posto[] {
  return [...postos];
}

export function buscarPostoPorId(id: number): Posto | undefined {
  return postos.find((p) => p.id === id);
}

export function cadastrarPosto(dados: Omit<Posto, 'id' | 'ativo'>): Posto {
  const novo: Posto = { ...dados, id: proximoIdPosto++, ativo: true };
  postos.push(novo);
  return novo;
}

export function editarPosto(id: number, dados: Partial<Omit<Posto, 'id' | 'ativo'>>): Posto | undefined {
  const p = buscarPostoPorId(id);
  if (!p) return undefined;
  Object.assign(p, dados);
  return p;
}

export function alternarStatusPosto(id: number, ativo: boolean): Posto | undefined {
  const p = buscarPostoPorId(id);
  if (!p) return undefined;
  p.ativo = ativo;
  return p;
}

export function cnpjUnico(cnpj: string, ignorarId?: number): boolean {
  return !postos.some((p) => p.cnpj === cnpj && p.id !== ignorarId);
}
