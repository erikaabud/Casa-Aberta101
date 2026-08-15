import { useEffect, useState } from 'react';
import { IconeEscudoPaladino } from './EmblemasMedievais';
import './CabecalhoFicha.css';

const classesDisponiveis = ['Clérigo','Guerreiro', 'Ladino', 'Mago'];

export function CabecalhoFicha({ nome, classePersonagem, aoAtualizarNome, aoAtualizarClasse }) {
  const [estaEditandoNome, setEstaEditandoNome] = useState(false);
  const [nomeTemporario, setNomeTemporario] = useState(nome);
  const [mostrarSeletorClasse, setMostrarSeletorClasse] = useState(false);

  useEffect(() => { setNomeTemporario(nome); }, [nome]);

  function confirmarNome() {
    if (nomeTemporario.trim()) aoAtualizarNome(nomeTemporario.trim());
    setEstaEditandoNome(false);
  }

  return (
    <header className="cabecalho-ficha">
      <div className="cabecalho-ficha__grupo">
        <div className="cabecalho-ficha__linha-nome">
          {estaEditandoNome ? (
            <input autoFocus value={nomeTemporario} onChange={(evento) => setNomeTemporario(evento.target.value)} onBlur={confirmarNome} onKeyDown={(evento) => evento.key === 'Enter' && confirmarNome()} className="cabecalho-ficha__input" />
          ) : (
            <button type="button" className="cabecalho-ficha__nome" onClick={() => setEstaEditandoNome(true)} title="Clique para editar o nome">{nome}</button>
          )}
          <button type="button" className="cabecalho-ficha__botao-edicao" onClick={() => setEstaEditandoNome((valorAtual) => !valorAtual)}>✏️</button>
        </div>

        <div className="cabecalho-ficha__classe-area">
          <button type="button" className="cabecalho-ficha__classe" onClick={() => setMostrarSeletorClasse((valorAtual) => !valorAtual)}>
            <IconeEscudoPaladino tamanho={18} />
            <span>{classePersonagem}</span>
          </button>

          {mostrarSeletorClasse && (
            <div className="cabecalho-ficha__seletor">
              {classesDisponiveis.map((classe) => (
                <button type="button" key={classe} className={classe === classePersonagem ? 'ativo' : ''} onClick={() => { aoAtualizarClasse(classe); setMostrarSeletorClasse(false); }}>
                  {classe}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
