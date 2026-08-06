import { useEffect, useRef, useState } from 'react';
import jsQR from 'jsqr';
import { IconeEspadaAlada } from './EmblemasMedievais';
import './LeitorQr.css';

export function LeitorQr({ personagem, poderTotal, aoGanharExperiencia, aoResgatarQr, aoAbrirModalQr }) {
  const [modoAtivo, setModoAtivo] = useState('leitura');
  const [cameraAtiva, setCameraAtiva] = useState(false);
  const [erroCamera, setErroCamera] = useState(null);
  const [resultadoLido, setResultadoLido] = useState(null);
  const [copiado, setCopiado] = useState(false);

  const referenciaVideo = useRef(null);
  const referenciaCanvas = useRef(null);
  const referenciaArquivo = useRef(null);
  const referenciaAnimacao = useRef(null);

  async function iniciarCamera() {
    setErroCamera(null);
    setResultadoLido(null);
    try {
      if (!navigator.mediaDevices?.getUserMedia) throw new Error('A câmera não é suportada neste navegador.');
      const fluxo = await navigator.mediaDevices.getUserMedia({ video: { facingMode: 'environment', width: { ideal: 640 }, height: { ideal: 640 } } });
      if (referenciaVideo.current) {
        referenciaVideo.current.srcObject = fluxo;
        referenciaVideo.current.setAttribute('playsinline', 'true');
        await referenciaVideo.current.play();
        setCameraAtiva(true);
      }
    } catch (erro) {
      setErroCamera(erro?.message || 'Não foi possível iniciar a câmera.');
      setCameraAtiva(false);
    }
  }

  function pararCamera() {
    if (referenciaAnimacao.current) {
      cancelAnimationFrame(referenciaAnimacao.current);
      referenciaAnimacao.current = null;
    }
    const video = referenciaVideo.current;
    const fluxo = video?.srcObject;
    if (fluxo) {
      fluxo.getTracks().forEach((trilha) => trilha.stop());
      video.srcObject = null;
    }
    setCameraAtiva(false);
  }

  function escanearQuadro() {
    const video = referenciaVideo.current;
    const canvas = referenciaCanvas.current;
    if (!video || !canvas || video.readyState !== video.HAVE_ENOUGH_DATA) {
      referenciaAnimacao.current = requestAnimationFrame(escanearQuadro);
      return;
    }
    const contexto = canvas.getContext('2d', { willReadFrequently: true });
    if (contexto) {
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;
      contexto.drawImage(video, 0, 0, canvas.width, canvas.height);
      const imagem = contexto.getImageData(0, 0, canvas.width, canvas.height);
      const codigo = jsQR(imagem.data, imagem.width, imagem.height, { inversionAttempts: 'dontInvert' });
      if (codigo?.data) {
        setResultadoLido(codigo.data);
        pararCamera();
        return;
      }
    }
    referenciaAnimacao.current = requestAnimationFrame(escanearQuadro);
  }

  useEffect(() => {
    if (modoAtivo === 'leitura') iniciarCamera();
    else pararCamera();
    return () => pararCamera();
  }, [modoAtivo]);

  useEffect(() => {
    if (cameraAtiva && !resultadoLido) referenciaAnimacao.current = requestAnimationFrame(escanearQuadro);
  }, [cameraAtiva, resultadoLido]);

  function lidarComUpload(evento) {
    const arquivo = evento.target.files?.[0];
    if (!arquivo) return;
    const leitor = new FileReader();
    leitor.onload = (eventoLeitura) => {
      const imagem = new Image();
      imagem.onload = () => {
        const canvas = document.createElement('canvas');
        canvas.width = imagem.width;
        canvas.height = imagem.height;
        const contexto = canvas.getContext('2d');
        if (contexto) {
          contexto.drawImage(imagem, 0, 0);
          const dados = contexto.getImageData(0, 0, canvas.width, canvas.height);
          const codigo = jsQR(dados.data, dados.width, dados.height);
          if (codigo?.data) setResultadoLido(codigo.data);
          else window.alert('Nenhum QR Code válido foi encontrado na imagem selecionada.');
        }
      };
      imagem.src = eventoLeitura.target?.result;
    };
    leitor.readAsDataURL(arquivo);
  }

  function copiarTexto(texto) {
    navigator.clipboard.writeText(texto);
    setCopiado(true);
    setTimeout(() => setCopiado(false), 2000);
  }

  function resgatarRecompensa() {
    aoResgatarQr();
    aoGanharExperiencia();
    window.alert('Recompensa de QR Code resgatada com sucesso.');
    setResultadoLido(null);
    iniciarCamera();
  }

  return (
    <section className="leitor-qr">
      <div className="leitor-qr__abas">
        <button type="button" className={modoAtivo === 'leitura' ? 'ativo' : ''} onClick={() => setModoAtivo('leitura')}>Leitor de câmera</button>
        <button type="button" className={modoAtivo === 'passaporte' ? 'ativo' : ''} onClick={() => setModoAtivo('passaporte')}>Meu passaporte</button>
      </div>

      <canvas ref={referenciaCanvas} className="leitor-qr__canvas" />

      {modoAtivo === 'leitura' && (
        <div className="leitor-qr__caixa">
          {!resultadoLido ? (
            <>
              <div className="leitor-qr__camera">
                <video ref={referenciaVideo} className="leitor-qr__video" />
                {cameraAtiva && <div className="leitor-qr__moldura"><div className="linha-varredura" /></div>}
                {!cameraAtiva && !erroCamera && <div className="leitor-qr__vazio"><span>📷</span><p>Iniciando câmera...</p></div>}
              </div>

              {erroCamera && <div className="leitor-qr__erro"><strong>Falha ao abrir a câmera</strong><p>{erroCamera}</p><button type="button" onClick={iniciarCamera}>Tentar novamente</button></div>}

              <p className="leitor-qr__status">Aproxime a câmera de um QR Code externo para ler.</p>

              <div className="leitor-qr__acoes">
                <button type="button" onClick={() => referenciaArquivo.current?.click()}>Enviar imagem QR</button>
                <button type="button" onClick={() => setResultadoLido('RPG_ITEM_REWARD_EPIC_AMULET_2026')}>Simular prêmio</button>
                <button type="button" onClick={() => setResultadoLido('https://meurpg.com/passaporte/12345')}>Simular link</button>
              </div>

              <input ref={referenciaArquivo} type="file" accept="image/*" className="leitor-qr__arquivo" onChange={lidarComUpload} />
            </>
          ) : (
            <div className="leitor-qr__resultado">
              <h3>QR Code lido com sucesso</h3>
              <pre>{resultadoLido}</pre>
              <div className="leitor-qr__acoes leitor-qr__acoes--resultado">
                {resultadoLido.startsWith('RPG_') && <button type="button" className="primario" onClick={resgatarRecompensa}>Resgatar recompensa</button>}
                <button type="button" onClick={() => copiarTexto(resultadoLido)}>{copiado ? 'Copiado!' : 'Copiar texto'}</button>
                <button type="button" onClick={() => { setResultadoLido(null); iniciarCamera(); }}>Escanear outro</button>
              </div>
            </div>
          )}
        </div>
      )}

      {modoAtivo === 'passaporte' && (
        <div className="leitor-qr__passaporte">
          <IconeEspadaAlada tamanho={54} />
          <h3>Seu QR Code do personagem</h3>
          <button type="button" className="leitor-qr__botao-passaporte" onClick={aoAbrirModalQr}>Abrir passaporte completo</button>
          <div className="leitor-qr__caixa-codigo">
            <svg width="180" height="180" viewBox="0 0 100 100" fill="#070b12" aria-hidden="true">
              <rect width="100" height="100" fill="#ffffff" />
              <rect x="5" y="5" width="25" height="25" fill="#070b12" />
              <rect x="10" y="10" width="15" height="15" fill="#ffffff" />
              <rect x="13" y="13" width="9" height="9" fill="#070b12" />
              <rect x="70" y="5" width="25" height="25" fill="#070b12" />
              <rect x="75" y="10" width="15" height="15" fill="#ffffff" />
              <rect x="78" y="13" width="9" height="9" fill="#070b12" />
              <rect x="5" y="70" width="25" height="25" fill="#070b12" />
              <rect x="10" y="75" width="15" height="15" fill="#ffffff" />
              <rect x="13" y="78" width="9" height="9" fill="#070b12" />
              <rect x="35" y="10" width="10" height="10" fill="#070b12" />
              <rect x="50" y="5" width="5" height="15" fill="#070b12" />
              <rect x="40" y="25" width="15" height="5" fill="#070b12" />
              <rect x="10" y="35" width="20" height="5" fill="#070b12" />
              <rect x="35" y="40" width="30" height="20" fill="#070b12" />
              <rect x="45" y="45" width="10" height="10" fill="#ffffff" />
              <rect x="70" y="35" width="20" height="15" fill="#070b12" />
              <rect x="75" y="55" width="15" height="10" fill="#070b12" />
              <rect x="35" y="70" width="15" height="20" fill="#070b12" />
              <rect x="55" y="75" width="25" height="15" fill="#070b12" />
            </svg>
          </div>
          <div className="leitor-qr__dados-personagem">
            <h4>{personagem.nome}</h4>
            <p>{personagem.classe} • Nível {personagem.nivel}</p>
            <strong>Poder total: {poderTotal.toLocaleString('pt-BR')}</strong>
          </div>
          <button type="button" onClick={() => copiarTexto(window.location.href)}>{copiado ? 'Link copiado!' : 'Copiar link do passaporte'}</button>
        </div>
      )}
    </section>
  );
}
