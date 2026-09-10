import { useState, useEffect } from 'react';
import api from '../../servicos/api';
import estilos from './Cadastro.module.css';

interface Posto {
  id: number;
  nome: string;
  endereco: string;
  cnpj: string;
  ativo: boolean;
}

interface Formulario {
  nome: string;
  endereco: string;
  cnpj: string;
}

const valoresIniciais: Formulario = { nome: '', endereco: '', cnpj: '' };

export default function ListaPostos() {
  const [lista, setLista] = useState<Posto[]>([]);
  const [carregando, setCarregando] = useState(true);
  const [modalAberto, setModalAberto] = useState(false);
  const [editandoId, setEditandoId] = useState<number | null>(null);
  const [formulario, setFormulario] = useState<Formulario>(valoresIniciais);
  const [erro, setErro] = useState('');

  async function carregar() {
    try {
      const { data } = await api.get<Posto[]>('/cadastros/postos');
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

  function abrirEditar(p: Posto) {
    setEditandoId(p.id);
    setFormulario({ nome: p.nome, endereco: p.endereco, cnpj: p.cnpj });
    setErro('');
    setModalAberto(true);
  }

  async function salvar() {
    try {
      if (editandoId) {
        const { data } = await api.put(`/cadastros/postos/${editandoId}`, formulario);
        setLista((antigos) => antigos.map((p) => (p.id === editandoId ? data : p)));
      } else {
        const { data } = await api.post('/cadastros/postos', formulario);
        setLista((antigos) => [...antigos, data]);
      }
      setModalAberto(false);
    } catch (err: any) {
      setErro(err?.response?.data?.mensagem || 'Erro ao salvar');
    }
  }

  async function alternarStatus(id: number, ativoAtual: boolean) {
    try {
      const { data } = await api.patch(`/cadastros/postos/${id}/status`, { ativo: !ativoAtual });
      setLista((antigos) => antigos.map((p) => (p.id === id ? data : p)));
    } catch {
      // silencioso
    }
  }

  if (carregando) return <div className={estilos.vazio}>Carregando...</div>;

  return (
    <div className={estilos.pagina}>
      <div className={estilos.topo}>
        <h2 className={estilos.titulo}>Postos</h2>
        <button className={estilos.botaoNovo} onClick={abrirNovo}>+ Novo</button>
      </div>

      {lista.length === 0 ? (
        <p className={estilos.vazio}>Nenhum posto cadastrado.</p>
      ) : (
        <table className={estilos.tabela}>
          <thead>
            <tr>
              <th>ID</th>
              <th>Nome</th>
              <th>Endereço</th>
              <th>CNPJ</th>
              <th>Status</th>
              <th>Ações</th>
            </tr>
          </thead>
          <tbody>
            {lista.map((p) => (
              <tr key={p.id}>
                <td>{p.id}</td>
                <td>{p.nome}</td>
                <td>{p.endereco}</td>
                <td>{p.cnpj}</td>
                <td>
                  <span className={`${estilos.badge} ${p.ativo ? estilos.badgeAtivo : estilos.badgeInativo}`}>
                    {p.ativo ? 'Ativo' : 'Inativo'}
                  </span>
                </td>
                <td>
                  <div className={estilos.acoes}>
                    <button className={`${estilos.botaoAcao} ${estilos.botaoEditar}`} onClick={() => abrirEditar(p)}>Editar</button>
                    <button
                      className={`${estilos.botaoAcao} ${p.ativo ? estilos.botaoDesativar : estilos.botaoAtivar}`}
                      onClick={() => alternarStatus(p.id, p.ativo)}
                    >
                      {p.ativo ? 'Desativar' : 'Ativar'}
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
            <h3 className={estilos.modalTitulo}>{editandoId ? 'Editar Posto' : 'Novo Posto'}</h3>
            {erro && <div className={estilos.erro}>{erro}</div>}
            <div className={estilos.formulario}>
              <div className={estilos.campo}>
                <label>Nome</label>
                <input value={formulario.nome} onChange={(e) => setFormulario((f) => ({ ...f, nome: e.target.value }))} required />
              </div>
              <div className={estilos.campo}>
                <label>Endereço</label>
                <input value={formulario.endereco} onChange={(e) => setFormulario((f) => ({ ...f, endereco: e.target.value }))} required />
              </div>
              <div className={estilos.campo}>
                <label>CNPJ</label>
                <input value={formulario.cnpj} onChange={(e) => setFormulario((f) => ({ ...f, cnpj: e.target.value }))} required />
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
