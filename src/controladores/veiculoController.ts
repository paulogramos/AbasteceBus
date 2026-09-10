import { Request, Response } from 'express';
import {
  buscarTodosVeiculos,
  buscarVeiculoPorId,
  cadastrarVeiculo,
  editarVeiculo,
  alternarStatusVeiculo,
  placaUnica,
} from '../dados/cadastros';

export class ControladorVeiculo {
  static listar(req: Request, res: Response) {
    const lista = buscarTodosVeiculos();
    res.status(200).json(lista);
  }

  static buscarPorId(req: Request, res: Response) {
    const id = Number(req.params.id);
    if (isNaN(id)) {
      res.status(400).json({ mensagem: 'ID inválido' });
      return;
    }

    const veiculo = buscarVeiculoPorId(id);
    if (!veiculo) {
      res.status(404).json({ mensagem: 'Veículo não encontrado' });
      return;
    }

    res.status(200).json(veiculo);
  }

  static cadastrar(req: Request, res: Response) {
    const { placa, modelo, tipo, ano } = req.body;

    if (!placa || !modelo || !tipo || !ano) {
      res.status(400).json({ mensagem: 'Placa, modelo, tipo e ano são obrigatórios' });
      return;
    }

    if (!placaUnica(placa)) {
      res.status(409).json({ mensagem: 'Esta placa já está cadastrada' });
      return;
    }

    const novo = cadastrarVeiculo({ placa, modelo, tipo, ano: Number(ano) });
    res.status(201).json(novo);
  }

  static editar(req: Request, res: Response) {
    const id = Number(req.params.id);
    if (isNaN(id)) {
      res.status(400).json({ mensagem: 'ID inválido' });
      return;
    }

    const { placa, modelo, tipo, ano } = req.body;
    if (!placa && !modelo && !tipo && !ano) {
      res.status(400).json({ mensagem: 'Envie ao menos um campo para atualizar' });
      return;
    }

    if (placa && !placaUnica(placa, id)) {
      res.status(409).json({ mensagem: 'Esta placa já está cadastrada' });
      return;
    }

    const dados: Record<string, any> = {};
    if (placa) dados.placa = placa;
    if (modelo) dados.modelo = modelo;
    if (tipo) dados.tipo = tipo;
    if (ano) dados.ano = Number(ano);

    const atualizado = editarVeiculo(id, dados);
    if (!atualizado) {
      res.status(404).json({ mensagem: 'Veículo não encontrado' });
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

    const atualizado = alternarStatusVeiculo(id, ativo);
    if (!atualizado) {
      res.status(404).json({ mensagem: 'Veículo não encontrado' });
      return;
    }

    res.status(200).json(atualizado);
  }
}
