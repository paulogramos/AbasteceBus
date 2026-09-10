import { Request, Response } from 'express';
import {
  buscarTodosPostos,
  buscarPostoPorId,
  cadastrarPosto,
  editarPosto,
  alternarStatusPosto,
  cnpjUnico,
} from '../dados/cadastros';

export class ControladorPosto {
  static listar(req: Request, res: Response) {
    const lista = buscarTodosPostos();
    res.status(200).json(lista);
  }

  static buscarPorId(req: Request, res: Response) {
    const id = Number(req.params.id);
    if (isNaN(id)) {
      res.status(400).json({ mensagem: 'ID inválido' });
      return;
    }

    const posto = buscarPostoPorId(id);
    if (!posto) {
      res.status(404).json({ mensagem: 'Posto não encontrado' });
      return;
    }

    res.status(200).json(posto);
  }

  static cadastrar(req: Request, res: Response) {
    const { nome, endereco, cnpj } = req.body;

    if (!nome || !endereco || !cnpj) {
      res.status(400).json({ mensagem: 'Nome, endereço e CNPJ são obrigatórios' });
      return;
    }

    if (!cnpjUnico(cnpj)) {
      res.status(409).json({ mensagem: 'Este CNPJ já está cadastrado' });
      return;
    }

    const novo = cadastrarPosto({ nome, endereco, cnpj });
    res.status(201).json(novo);
  }

  static editar(req: Request, res: Response) {
    const id = Number(req.params.id);
    if (isNaN(id)) {
      res.status(400).json({ mensagem: 'ID inválido' });
      return;
    }

    const { nome, endereco, cnpj } = req.body;
    if (!nome && !endereco && !cnpj) {
      res.status(400).json({ mensagem: 'Envie ao menos um campo para atualizar' });
      return;
    }

    if (cnpj && !cnpjUnico(cnpj, id)) {
      res.status(409).json({ mensagem: 'Este CNPJ já está cadastrado' });
      return;
    }

    const atualizado = editarPosto(id, { nome, endereco, cnpj });
    if (!atualizado) {
      res.status(404).json({ mensagem: 'Posto não encontrado' });
      return;
    }

    res.status(200).json(atualizado);
  }

  static alternarStatus(req: Request, res: Response) {
    const id = Number(req.params.id);
    if (isNaN(id)) {
      res.status(400).json({ mensagem: 'ID inválido' });
      return;
    }

    const { ativo } = req.body;
    if (typeof ativo !== 'boolean') {
      res.status(400).json({ mensagem: 'O campo "ativo" deve ser true ou false' });
      return;
    }

    const atualizado = alternarStatusPosto(id, ativo);
    if (!atualizado) {
      res.status(404).json({ mensagem: 'Posto não encontrado' });
      return;
    }

    res.status(200).json(atualizado);
  }
}
