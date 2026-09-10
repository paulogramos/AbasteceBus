import { Usuario, Perfil, DadosAutenticacao } from '../tipos';
import bcrypt from 'bcrypt';

const hashPadrao = bcrypt.hashSync('admin123', 10);

export const usuarios: Usuario[] = [
  {
    id: 1,
    nome: 'Admin Gestor',
    login: 'admin',
    hashSenha: hashPadrao,
    perfil: 'gestor',
    ativo: true,
  },
  {
    id: 2,
    nome: 'João Motorista',
    login: 'joao',
    hashSenha: hashPadrao,
    perfil: 'motorista',
    ativo: true,
  },
  {
    id: 3,
    nome: 'Maria Frentista',
    login: 'maria',
    hashSenha: hashPadrao,
    perfil: 'frentista',
    ativo: true,
  },
];

export function buscarUsuarioPorLogin(login: string): Usuario | undefined {
  return usuarios.find((user) => user.login === login);
}

export function buscarUsuarioPorId(id: number): Usuario | undefined {
  return usuarios.find((user) => user.id === id);
}

export function criarUsuario(
  dados: Omit<Usuario, 'id' | 'hashSenha'> & { senha: string }
): Usuario {
  const newUser: Usuario = {
    id: usuarios.length + 1,
    nome: dados.nome,
    login: dados.login,
    hashSenha: bcrypt.hashSync(dados.senha, 10),
    perfil: dados.perfil,
    ativo: true,
  };
  usuarios.push(newUser);
  return newUser;
}

export function atualizarUsuario(
  usuarioId: number,
  atualizacoes: Partial<Omit<Usuario, 'id' | 'hashSenha'>>
): Usuario | undefined {
  const usuario = buscarUsuarioPorId(usuarioId);
  if (!usuario) return undefined;

  Object.assign(usuario, atualizacoes);
  return usuario;
}

export function atualizarStatusUsuario(usuarioId: number, ativo: boolean): Usuario | undefined {
  const usuario = buscarUsuarioPorId(usuarioId);
  if (!usuario) return undefined;

  usuario.ativo = ativo;
  return usuario;
}

export function loginEhUnico(login: string): boolean {
  return !usuarios.some((user) => user.login === login);
}