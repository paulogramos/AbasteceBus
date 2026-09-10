import { Request, Response, NextFunction } from 'express';
import { extrairTokenDoHeader, verificarToken } from '../autenticacao/auth';
import { buscarUsuarioPorId } from '../dados/usuarios';
import type { Perfil } from '../tipos';

export function exigirPerfil(...perfisAceitos: Perfil[]) {
  return (req: Request, res: Response, next: NextFunction) => {
    const token = extrairTokenDoHeader(req.headers.authorization);

    if (!token) {
      res.status(401).json({ mensagem: 'Token não fornecido' });
      return;
    }

    let dadosToken;
    try {
      dadosToken = verificarToken(token);
    } catch {
      res.status(401).json({ mensagem: 'Token inválido ou expirado' });
      return;
    }

    const usuario = buscarUsuarioPorId(dadosToken.idUsuario);
    if (!usuario || !usuario.ativo) {
      res.status(401).json({ mensagem: 'Usuário não encontrado ou inativo' });
      return;
    }

    if (!perfisAceitos.includes(usuario.perfil)) {
      res.status(403).json({ mensagem: 'Sem permissão para acessar este recurso' });
      return;
    }

    (req as any).usuarioLogado = usuario;
    next();
  };
}

export function verificarTokenMiddleware(req: Request, res: Response, next: NextFunction) {
  const token = extrairTokenDoHeader(req.headers.authorization);

  if (!token) {
    res.status(401).json({ mensagem: 'Token não fornecido' });
    return;
  }

  try {
    const dados = verificarToken(token);
    const usuario = buscarUsuarioPorId(dados.idUsuario);

    if (!usuario || !usuario.ativo) {
      res.status(401).json({ mensagem: 'Usuário não encontrado ou inativo' });
      return;
    }

    (req as any).usuarioLogado = usuario;
    next();
  } catch {
    res.status(401).json({ mensagem: 'Token inválido ou expirado' });
  }
}
