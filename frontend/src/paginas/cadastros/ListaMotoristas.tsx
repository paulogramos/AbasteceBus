import { useState, useEffect } from 'react';
import api from '../../servicos/api';
import estilos from './Cadastro.module.css';

interface Motorista {
  id: number;
  nome: string;
  cnh: string;
  telefone: string;
  ativo: boolean;
}

interface Formulario {
  nome: string;
  cnh: string;
  telefone: string;
}

const valoresIniciais: Formulario = { nome: '', cnh: '', telefone: '' };

export default function ListaMotoristas() {
  const [lista, setLista] = useState<Motorista[]>([]);
  const [carregando, setCarregando] = useState(true);
  const [modalAberto, setModalAberto] = useState(false);
  const [editandoId, setEditandoId] = useState<number | null>(null);
  const [formulario, setFormulario] = useState<Formulario>(valoresIniciais);
  const [erro, setErro] = useState('');

  async function carregar() {
    try {
      const { data } = await api.get<Motorista[]>('/cadastros/motoristas');
      setLista(data);
    } catch {
      // silencioso
    } finally {
      setCarregando(false);
    }
  }

  useEffect(() => { carregar(); }, []);

  function abrirNovo() {
    setEditandoId(null);
    setFormulario(valoresIniciais);
    setErro('');
    setModalAberto(true);
  }

  function abrirEditar(m: Motorista) {
    setEditandoId(m.id);
    setFormulario({ nome: m.nome, cnh: m.cnh, telefone: m.telefone });
    setErro('');
    setModalAberto(true);
  }

  async function salvar() {
    try {
      if (editandoId) {
        const { data } = await api.put(`/cadastros/motoristas/${editandoId}`, formulario);
        setLista((antigos) => antigos.map((m) => (m.id === editandoId ? data : m)));
      } else {
        const { data } = await api.post('/cadastros/motoristas', formulario);
        setLista((antigos) => [...antigos, data]);
      }
      setModalAberto(false);
    } catch (err: any) {
      setErro(err?.response?.data?.mensagem || 'Erro ao salvar');
    }
  }

  async function alternarStatus(id: number, ativoAtual: boolean) {
    try {
      const { data } = await api.patch(`/cadastros/motoristas/${id}/status`, { ativo: !ativoAtual });
      setLista((antigos) => antigos.map((m) => (m.id === id ? data : m)));
    } catch {
      // silencioso
    }
  }

  if (carregando) return <div className={estilos.vazio}>Carregando...</div>;

  return (
    <div className={estilos.pagina}>
      <div className={estilos.topo}>
        <h2 className={estilos.titulo}>Motoristas</h2>
        <button className={estilos.botaoNovo} onClick={abrirNovo}>+ Novo</button>
      </div>

      {lista.length === 0 ? (
        <p className={estilos.vazio}>Nenhum motorista cadastrado.</p>
      ) : (
        <table className={estilos.tabela}>
          <thead>
            <tr>
              <th>ID</th>
              <th>Nome</th>
              <th>CNH</th>
              <th>Telefone</th>
              <th>Status</th>
              <th>Ações</th>
            </tr>
          </thead>
          <tbody>
            {lista.map((m) => (
              <tr key={m.id}>
                <td>{m.id}</td>
                <td>{m.nome}</td>
                <td>{m.cnh}</td>
                <td>{m.telefone}</td>
                <td>
                  <span className={`${estilos.badge} ${m.ativo ? estilos.badgeAtivo : estilos.badgeInativo}`}>
                    {m.ativo ? 'Ativo' : 'Inativo'}
                  </span>
                </td>
                <td>
                  <div className={estilos.acoes}>
                    <button className={`${estilos.botaoAcao} ${estilos.botaoEditar}`} onClick={() => abrirEditar(m)}>Editar</button>
                    <button
                      className={`${estilos.botaoAcao} ${m.ativo ? estilos.botaoDesativar : estilos.botaoAtivar}`}
                      onClick={() => alternarStatus(m.id, m.ativo)}
                    >
                      {m.ativo ? 'Desativar' : 'Ativar'}
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}

      {modalAberto && (
        <div className={estilos.modalOverlay} onClick={() => setModalAberto(false)}>
          <div className={estilos.modal} onClick={(e) => e.stopPropagation()}>
            <h3 className={estilos.modalTitulo}>{editandoId ? 'Editar Motorista' : 'Novo Motorista'}</h3>
            {erro && <div className={estilos.erro}>{erro}</div>}
            <div className={estilos.formulario}>
              <div className={estilos.campo}>
                <label>Nome</label>
                <input value={formulario.nome} onChange={(e) => setFormulario((f) => ({ ...f, nome: e.target.value }))} required />
              </div>
              <div className={estilos.campo}>
                <label>CNH</label>
                <input value={formulario.cnh} onChange={(e) => setFormulario((f) => ({ ...f, cnh: e.target.value }))} required />
              </div>
              <div className={estilos.campo}>
                <label>Telefone</label>
                <input value={formulario.telefone} onChange={(e) => setFormulario((f) => ({ ...f, telefone: e.target.value }))} required />
              </div>
              <div className={estilos.botoesModal}>
                <button className={estilos.botaoCancelar} onClick={() => setModalAberto(false)}>Cancelar</button>
                <button className={estilos.botaoSalvar} onClick={salvar}>Salvar</button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
