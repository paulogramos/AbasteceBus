import { useState, useEffect } from 'react';
import api from '../../servicos/api';
import estilos from './Cadastro.module.css';

interface Veiculo {
  id: number;
  placa: string;
  modelo: string;
  tipo: string;
  ano: number;
  ativo: boolean;
}

interface Formulario {
  placa: string;
  modelo: string;
  tipo: string;
  ano: string;
}

const valoresIniciais: Formulario = { placa: '', modelo: '', tipo: 'Leve', ano: '' };

export default function ListaVeiculos() {
  const [lista, setLista] = useState<Veiculo[]>([]);
  const [carregando, setCarregando] = useState(true);
  const [modalAberto, setModalAberto] = useState(false);
  const [editandoId, setEditandoId] = useState<number | null>(null);
  const [formulario, setFormulario] = useState<Formulario>(valoresIniciais);
  const [erro, setErro] = useState('');

  async function carregar() {
    try {
      const { data } = await api.get<Veiculo[]>('/cadastros/veiculos');
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

  function abrirEditar(v: Veiculo) {
    setEditandoId(v.id);
    setFormulario({ placa: v.placa, modelo: v.modelo, tipo: v.tipo, ano: String(v.ano) });
    setErro('');
    setModalAberto(true);
  }

  async function salvar() {
    try {
      const dataEnvio = { ...formulario, ano: Number(formulario.ano) };
      if (editandoId) {
        const { data } = await api.put(`/cadastros/veiculos/${editandoId}`, dataEnvio);
        setLista((antigos) => antigos.map((v) => (v.id === editandoId ? data : v)));
      } else {
        const { data } = await api.post('/cadastros/veiculos', dataEnvio);
        setLista((antigos) => [...antigos, data]);
      }
      setModalAberto(false);
    } catch (err: any) {
      setErro(err?.response?.data?.mensagem || 'Erro ao salvar');
    }
  }

  async function alternarStatus(id: number, ativoAtual: boolean) {
    try {
      const { data } = await api.patch(`/cadastros/veiculos/${id}/status`, { ativo: !ativoAtual });
      setLista((antigos) => antigos.map((v) => (v.id === id ? data : v)));
    } catch {
      // silencioso
    }
  }

  if (carregando) return <div className={estilos.vazio}>Carregando...</div>;

  return (
    <div className={estilos.pagina}>
      <div className={estilos.topo}>
        <h2 className={estilos.titulo}>Veículos</h2>
        <button className={estilos.botaoNovo} onClick={abrirNovo}>+ Novo</button>
      </div>

      {lista.length === 0 ? (
        <p className={estilos.vazio}>Nenhum veículo cadastrado.</p>
      ) : (
        <table className={estilos.tabela}>
          <thead>
            <tr>
              <th>ID</th>
              <th>Placa</th>
              <th>Modelo</th>
              <th>Tipo</th>
              <th>Ano</th>
              <th>Status</th>
              <th>Ações</th>
            </tr>
          </thead>
          <tbody>
            {lista.map((v) => (
              <tr key={v.id}>
                <td>{v.id}</td>
                <td>{v.placa}</td>
                <td>{v.modelo}</td>
                <td>{v.tipo}</td>
                <td>{v.ano}</td>
                <td>
                  <span className={`${estilos.badge} ${v.ativo ? estilos.badgeAtivo : estilos.badgeInativo}`}>
                    {v.ativo ? 'Ativo' : 'Inativo'}
                  </span>
                </td>
                <td>
                  <div className={estilos.acoes}>
                    <button className={`${estilos.botaoAcao} ${estilos.botaoEditar}`} onClick={() => abrirEditar(v)}>Editar</button>
                    <button
                      className={`${estilos.botaoAcao} ${v.ativo ? estilos.botaoDesativar : estilos.botaoAtivar}`}
                      onClick={() => alternarStatus(v.id, v.ativo)}
                    >
                      {v.ativo ? 'Desativar' : 'Ativar'}
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
            <h3 className={estilos.modalTitulo}>{editandoId ? 'Editar Veículo' : 'Novo Veículo'}</h3>
            {erro && <div className={estilos.erro}>{erro}</div>}
            <div className={estilos.formulario}>
              <div className={estilos.campo}>
                <label>Placa</label>
                <input value={formulario.placa} onChange={(e) => setFormulario((f) => ({ ...f, placa: e.target.value }))} required />
              </div>
              <div className={estilos.campo}>
                <label>Modelo</label>
                <input value={formulario.modelo} onChange={(e) => setFormulario((f) => ({ ...f, modelo: e.target.value }))} required />
              </div>
              <div className={estilos.campo}>
                <label>Tipo</label>
                <select value={formulario.tipo} onChange={(e) => setFormulario((f) => ({ ...f, tipo: e.target.value }))}>
                  <option value="Leve">Leve</option>
                  <option value="Pesado">Pesado</option>
                  <option value="Moto">Moto</option>
                </select>
              </div>
              <div className={estilos.campo}>
                <label>Ano</label>
                <input type="number" value={formulario.ano} onChange={(e) => setFormulario((f) => ({ ...f, ano: e.target.value }))} required />
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
