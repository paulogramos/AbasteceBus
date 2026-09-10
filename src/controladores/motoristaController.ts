import { Request, Response } from 'express';
import {
  buscarTodosMotoristas,
  buscarMotoristaPorId,
  cadastrarMotorista,
  editarMotorista,
  alternarStatusMotorista,
  cnhUnica,
} from '../dados/cadastros';

export class ControladorMotorista {
  static listar(req: Request, res: Response) {
    const lista = buscarTodosMotoristas();
    res.status(200).json(lista);
  }

  static buscarPorId(req: Request, res: Response) {
    const id = Number(req.params.id);
    if (isNaN(id)) {
      res.status(400).json({ mensagem: 'ID inválido' });
      return;
    }

    const motorista = buscarMotoristaPorId(id);
    if (!motorista) {
      res.status(404).json({ mensagem: 'Motorista não encontrado' });
      return;
    }

    res.status(200).json(motorista);
  }

  static cadastrar(req: Request, res: Response) {
    const { nome, cnh, telefone } = req.body;

    if (!nome || !cnh || !telefone) {
      res.status(400).json({ mensagem: 'Nome, CNH e telefone são obrigatórios' });
      return;
    }

    if (!cnhUnica(cnh)) {
      res.status(409).json({ mensagem: 'Esta CNH já está cadastrada' });
      return;
    }

    const novo = cadastrarMotorista({ nome, cnh, telefone });
    res.status(201).json(novo);
  }

  static editar(req: Request, res: Response) {
    const id = Number(req.params.id);
    if (isNaN(id)) {
      res.status(400).json({ mensagem: 'ID inválido' });
      return;
    }

    const { nome, cnh, telefone } = req.body;
    if (!nome && !cnh && !telefone) {
      res.status(400).json({ mensagem: 'Envie ao menos um campo para atualizar' });
      return;
    }

    if (cnh && !cnhUnica(cnh, id)) {
      res.status(409).json({ mensagem: 'Esta CNH já está cadastrada' });
      return;
    }

    const atualizado = editarMotorista(id, { nome, cnh, telefone });
    if (!atualizado) {
      res.status(404).json({ mensagem: 'Motorista não encontrado' });
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

    const atualizado = alternarStatusMotorista(id, ativo);
    if (!atualizado) {
      res.status(404).json({ mensagem: 'Motorista não encontrado' });
      return;
    }

    res.status(200).json(atualizado);
  }
}
