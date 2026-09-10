import express from 'express';
import cors from 'cors';
import autenticacaoRouter from './rotas/auth';
import usuariosRouter from './rotas/usuarios';
import cadastrosRouter from './rotas/cadastros';
import { exigirPerfil } from './middlewares/verificarPerfil';

const app = express();

app.use(cors());
app.use(express.json());

app.use('/api/autenticacao', autenticacaoRouter);
app.use('/api/usuarios', exigirPerfil('gestor'), usuariosRouter);
app.use('/api/cadastros', exigirPerfil('gestor'), cadastrosRouter);

app.get('/api/saude', (req, res) => {
  res.status(200).json({ mensagem: 'Serviço funcionando' });
});

export default app;
