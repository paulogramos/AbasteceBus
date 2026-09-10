import { useState } from 'react';
import { useAuth } from '../contextos/Autenticacao';
import { useNavigate } from 'react-router-dom';
import ListaUsuarios from './usuarios/ListaUsuarios';
import ListaMotoristas from './cadastros/ListaMotoristas';
import ListaVeiculos from './cadastros/ListaVeiculos';
import ListaPostos from './cadastros/ListaPostos';
import estilos from './Painel.module.css';

const abasGestor = [
  { chave: 'usuarios', rotulo: 'Usuários' },
  { chave: 'motoristas', rotulo: 'Motoristas' },
  { chave: 'veiculos', rotulo: 'Veículos' },
  { chave: 'postos', rotulo: 'Postos' },
] as const;

type Aba = (typeof abasGestor)[number]['chave'];

const componentesAba: Record<Aba, React.FC> = {
  usuarios: ListaUsuarios,
  motoristas: ListaMotoristas,
  veiculos: ListaVeiculos,
  postos: ListaPostos,
};

export default function PaginaPainel() {
  const { sessao, sair } = useAuth();
  const navegacao = useNavigate();
  const [abaAtiva, setAbaAtiva] = useState<Aba>('usuarios');

  function aoSair() {
    sair();
    navegacao('/login');
  }

  const titulos: Record<string, string> = {
    gestor: 'Painel do Gestor',
    motorista: 'Painel do Motorista',
    frentista: 'Painel do Frentista',
  };

  const ComponenteAba = componentesAba[abaAtiva];

  return (
    <div className={estilos.telaPainel}>
      <header className={estilos.cabecalhoPainel}>
        <h1>{sessao ? titulos[sessao.perfil] || 'Painel' : 'Painel'}</h1>
        <div className={estilos.infoUsuario}>
          <span className={estilos.etiquetaPerfil}>{sessao?.perfil}</span>
          <button onClick={aoSair} className={estilos.botaoSair}>
            Sair
          </button>
        </div>
      </header>
      <main className={estilos.conteudoPainel}>
        {sessao?.perfil === 'gestor' ? (
          <>
            <nav className={estilos.barraAbas}>
              {abasGestor.map((aba) => (
                <button
                  key={aba.chave}
                  className={`${estilos.aba} ${abaAtiva === aba.chave ? estilos.abaAtiva : ''}`}
                  onClick={() => setAbaAtiva(aba.chave)}
                >
                  {aba.rotulo}
                </button>
              ))}
            </nav>
            <ComponenteAba />
          </>
        ) : (
          <div className={estilos.mensagemPlaceholder}>
            As funcionalidades serão adicionadas nas próximas sprints.
          </div>
        )}
      </main>
    </div>
  );
}
