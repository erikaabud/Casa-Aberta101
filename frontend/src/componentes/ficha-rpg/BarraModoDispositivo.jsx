import './BarraModoDispositivo.css';

export function BarraModoDispositivo({ 
  territorios, 
  territorioAtual, 
  aoMudarTerritorio 
}) {
  
  // Função para voltar sem recarregar a página
  function handleVoltar() {
    // Se você estiver usando React Router, use: navigate('/')
    // Se for apenas uma página única (SPA), isso apenas executa a função de "voltar" do navegador:
    window.history.back(); 
  }

  return (
    <div className="barra-modo-dispositivo">
      <div className="barra-modo-dispositivo__conteudo">
        
        {/* Botão voltar que NÃO recarrega a página */}
        <button 
          type="button" 
          className="barra-modo-dispositivo__voltar" 
          onClick={handleVoltar}
        >
          <span>⬅</span> Voltar
        </button>

        {/* Título que NÃO é mais um link, apenas texto bonito */}
        <div className="barra-modo-dispositivo__titulo">
          <span>✨</span>
          <span>Painel da Ficha RPG</span>
        </div>

        {/* Menu Dropdown */}
        <div className="territorio-dropdown">
          <select 
            value={territorioAtual} 
            onChange={(e) => aoMudarTerritorio(e.target.value)}
            className="territorio-select"
          >
            {Object.keys(territorios).map((key) => (
              <option key={key} value={key}>
                {territorios[key].icone} {territorios[key].nome}
              </option>
            ))}
          </select>
        </div>

      </div>
    </div>
  );
}