import { useEffect, useMemo, useRef, useState } from 'react';
import './LeitorQr.css';

const URL_AFRAME = 'https://aframe.io/releases/1.6.0/aframe.min.js';
const URL_ARJS = 'https://cdn.jsdelivr.net/gh/AR-js-org/AR.js/aframe/build/aframe-ar.js';

function carregarScript(id, src) {
  return new Promise((resolve, reject) => {
    const scriptExistente = document.getElementById(id);

    if (scriptExistente) {
      if (scriptExistente.dataset.pronto === 'true') {
        resolve();
        return;
      }

      scriptExistente.addEventListener('load', resolve, { once: true });
      scriptExistente.addEventListener(
        'error',
        () => reject(new Error(`Não foi possível carregar ${src}.`)),
        { once: true }
      );
      return;
    }

    const script = document.createElement('script');
    script.id = id;
    script.src = src;
    script.async = true;
    script.onload = () => {
      script.dataset.pronto = 'true';
      resolve();
    };
    script.onerror = () =>
      reject(new Error(`Não foi possível carregar ${src}.`));

    document.body.appendChild(script);
  });
}

function useMotorAr() {
  const [estado, setEstado] = useState({
    pronto: false,
    erro: null,
  });

  useEffect(() => {
    let ativo = true;

    async function carregar() {
      try {
        await carregarScript('aframe-runtime', URL_AFRAME);
        await carregarScript('arjs-runtime', URL_ARJS);

        if (ativo) {
          setEstado({
            pronto: true,
            erro: null,
          });
        }
      } catch (erro) {
        if (ativo) {
          setEstado({
            pronto: false,
            erro:
              erro?.message ||
              'Não foi possível iniciar o motor de realidade aumentada.',
          });
        }
      }
    }

    carregar();

    return () => {
      ativo = false;
    };
  }, []);

  return estado;
}

function ModeloArFallback({ fallback }) {
  const configuracao = fallback || {};
  const primitivo = configuracao.primitivo || 'box';

  if (primitivo === 'octahedron') {
    return (
      <a-entity
        geometry="primitive: octahedron; radius: 0.42"
        material={`color: ${configuracao.cor || '#34d399'}; emissive: ${configuracao.emissive || '#14532d'}; metalness: 0.35; roughness: 0.25;`}
        position={configuracao.posicao || '0 0.35 0'}
        rotation={configuracao.rotacao || '0 45 0'}
        scale={configuracao.escala || '0.45 0.45 0.45'}
        animation="property: rotation; to: 0 405 0; loop: true; dur: 8000; easing: linear"
      />
    );
  }

  if (primitivo === 'dodecahedron') {
    return (
      <a-entity
        geometry="primitive: dodecahedron; radius: 0.38"
        material={`color: ${configuracao.cor || '#f59e0b'}; emissive: ${configuracao.emissive || '#7c2d12'}; metalness: 0.4; roughness: 0.2;`}
        position={configuracao.posicao || '0 0.4 0'}
        rotation={configuracao.rotacao || '0 0 0'}
        scale={configuracao.escala || '0.4 0.4 0.4'}
        animation="property: rotation; to: 360 360 0; loop: true; dur: 6000; easing: linear"
      />
    );
  }

  if (primitivo === 'icosahedron') {
    return (
      <a-entity
        geometry="primitive: icosahedron; radius: 0.42"
        material={`color: ${configuracao.cor || '#7dd3fc'}; emissive: ${configuracao.emissive || '#0c4a6e'}; metalness: 0.28; roughness: 0.24;`}
        position={configuracao.posicao || '0 0.38 0'}
        rotation={configuracao.rotacao || '0 0 0'}
        scale={configuracao.escala || '0.46 0.46 0.46'}
        animation="property: rotation; to: 0 360 360; loop: true; dur: 9000; easing: linear"
      />
    );
  }

  return (
    <a-entity
      geometry="primitive: box; depth: 0.5; height: 0.5; width: 0.5"
      material={`color: ${configuracao.cor || '#d4af37'}; emissive: ${configuracao.emissive || '#5b4400'}; metalness: 0.32; roughness: 0.28;`}
      position={configuracao.posicao || '0 0.35 0'}
      rotation={configuracao.rotacao || '0 45 0'}
      scale={configuracao.escala || '0.45 0.45 0.45'}
      animation="property: rotation; to: 0 405 0; loop: true; dur: 7000; easing: linear"
    />
  );
}

function ConteudoMarcador({ artefato }) {
  if (artefato?.modelo?.caminho) {
    return (
      <a-entity
        gltf-model={`url(${artefato.modelo.caminho})`}
        position={artefato.modelo.posicao || '0 0.35 0'}
        rotation={artefato.modelo.rotacao || '0 0 0'}
        scale={artefato.modelo.escala || '0.45 0.45 0.45'}
        animation="property: rotation; to: 0 360 0; loop: true; dur: 9000; easing: linear"
      />
    );
  }

  return <ModeloArFallback fallback={artefato?.fallback} />;
}

export function LeitorQr({
  dadosTerritorio,
  artefatoAr,
  aoColetarArtefatoAr,
}) {
  const { pronto, erro } = useMotorAr();
  const referenciaCena = useRef(null);
  const [erroCamera, setErroCamera] = useState(null);
  const [cameraAtiva, setCameraAtiva] = useState(false);
  const [coletadoNoPainel, setColetadoNoPainel] = useState(false);

  useEffect(() => {
    setColetadoNoPainel(false);
    setErroCamera(null);
    setCameraAtiva(false);
  }, [dadosTerritorio?.nome, artefatoAr?.item?.chave]);

  function encaixarElementosArNoQuadro() {
    const container = referenciaCena.current;

    if (!container) return false;

    const canvasAlvoNoModal = container.querySelector('.a-canvas.a-grab-cursor');

    const videoAr =
      document.querySelector('#arjs-video') ||
      document.querySelector('body > video');

    const canvasAr =
      canvasAlvoNoModal ||
      document.querySelector('.a-canvas.a-grab-cursor') ||
      document.querySelector('.a-canvas') ||
      document.querySelector('canvas[data-aframe-canvas]');

    if (canvasAr && canvasAr.parentElement !== container) {
      container.appendChild(canvasAr);
    }

    if (videoAr && videoAr.parentElement !== container) {
      if (canvasAr) {
        container.insertBefore(videoAr, canvasAr);
      } else {
        container.appendChild(videoAr);
      }
    }

    [videoAr, canvasAr].filter(Boolean).forEach((elemento) => {
      elemento.style.setProperty('position', 'absolute', 'important');
      elemento.style.setProperty('inset', '0', 'important');
      elemento.style.setProperty('top', '0', 'important');
      elemento.style.setProperty('left', '0', 'important');
      elemento.style.setProperty('width', '100%', 'important');
      elemento.style.setProperty('height', '100%', 'important');
      elemento.style.setProperty('max-width', '100%', 'important');
      elemento.style.setProperty('max-height', '100%', 'important');
      elemento.style.setProperty('display', 'block', 'important');
      elemento.style.setProperty('transform', 'none', 'important');
      elemento.style.setProperty('margin', '0', 'important');
    });

    if (videoAr) {
      videoAr.setAttribute('playsinline', 'true');
      videoAr.muted = true;
      videoAr.dataset.arDentroDoModal = 'true';
      videoAr.style.setProperty('object-fit', 'cover', 'important');
      videoAr.style.setProperty('z-index', '0', 'important');
      videoAr.style.setProperty('opacity', '1', 'important');
      videoAr.style.setProperty('visibility', 'visible', 'important');
    }

    if (canvasAr) {
      canvasAr.dataset.arDentroDoModal = 'true';
      canvasAr.style.setProperty('z-index', '1', 'important');
      canvasAr.style.setProperty('pointer-events', 'none', 'important');
      canvasAr.style.setProperty('background', 'transparent', 'important');
    }

    return !!videoAr;
  }

  // Pré-checagem de permissão: força o prompt de câmera (e captura erro de HTTP/permite negada)
  useEffect(() => {
    let ativo = true;

    async function checarPermissaoCamera() {
      if (!pronto) return;

      if (!navigator.mediaDevices?.getUserMedia) {
        if (ativo) {
          setErroCamera('Este navegador não suporta acesso à câmera (getUserMedia).');
        }
        return;
      }

      try {
        const stream = await navigator.mediaDevices.getUserMedia({
          video: { facingMode: 'environment' },
          audio: false,
        });

        stream.getTracks().forEach((trilha) => trilha.stop());

        if (ativo) {
          setErroCamera(null);
        }
      } catch (erro) {
        const nome = erro?.name || '';
        let mensagem =
          erro?.message ||
          'Não foi possível acessar a câmera. Verifique a permissão do navegador.';

        if (nome === 'NotAllowedError' || nome === 'PermissionDeniedError') {
          mensagem =
            'Permissão de câmera negada. Libere o acesso à câmera para este site e recarregue a página.';
        } else if (nome === 'NotFoundError' || nome === 'DevicesNotFoundError') {
          mensagem =
            'Nenhuma câmera foi encontrada neste dispositivo.';
        } else if (nome === 'NotReadableError') {
          mensagem =
            'A câmera está em uso por outro aplicativo. Feche-o e tente novamente.';
        } else if (nome === 'SecurityError') {
          mensagem =
            'A câmera só funciona em HTTPS ou em localhost. Rode o projeto em um endereço seguro.';
        }

        if (ativo) {
          setErroCamera(mensagem);
        }
      }
    }

    checarPermissaoCamera();

    return () => {
      ativo = false;
    };
  }, [pronto]);

  // Observa o vídeo do AR.js e marca quando a câmera realmente ficou ativa
  useEffect(() => {
    if (!pronto) return undefined;

    let ativo = true;
    let tentativas = 0;
    const maxTentativas = 14; // ~7s
    const observador = new MutationObserver(() => {
      encaixarElementosArNoQuadro();
    });

    observador.observe(document.body, {
      childList: true,
      subtree: true,
    });

    const intervalo = window.setInterval(() => {
      encaixarElementosArNoQuadro();
      tentativas += 1;

      const video = document.querySelector('#arjs-video');
      const canvasNoModal = referenciaCena.current?.querySelector('.a-canvas.a-grab-cursor');

      const estaAtivo =
        !!video &&
        (video.readyState >= 2 || video.videoWidth > 0 || video.videoHeight > 0) &&
        !!canvasNoModal;

      if (ativo && estaAtivo) {
        setCameraAtiva(true);
        window.clearInterval(intervalo);
        return;
      }

      if (tentativas >= maxTentativas) {
        if (ativo) {
          setCameraAtiva(false);
        }
        window.clearInterval(intervalo);
      }
    }, 500);

    return () => {
      ativo = false;
      observador.disconnect();
      window.clearInterval(intervalo);
    };
  }, [pronto, dadosTerritorio?.nome]);

  useEffect(() => {
    return () => {
      const videoAr =
        document.querySelector('#arjs-video') ||
        document.querySelector('body > video');

      const fluxo = videoAr?.srcObject;

      if (fluxo?.getTracks) {
        fluxo.getTracks().forEach((trilha) => trilha.stop());
      }

      if (videoAr) {
        videoAr.srcObject = null;
      }
    };
  }, []);

  const missaoRelacionada = useMemo(() => {
    const nomeMissao =
      artefatoAr?.missaoVinculada?.nome || artefatoAr?.missaoVinculada?.titulo;

    return nomeMissao || 'Missão não vinculada';
  }, [artefatoAr]);

  function lidarComColeta() {
    const itemFoiAdicionado = aoColetarArtefatoAr?.(artefatoAr);

    if (itemFoiAdicionado !== false) {
      setColetadoNoPainel(true);
    }
  }

  if (!dadosTerritorio || !artefatoAr) {
    return (
      <section className="leitor-qr">
        <div className="leitor-qr__caixa">
          <p className="leitor-qr__status">
            Nenhum artefato de realidade aumentada foi configurado para este território.
          </p>
        </div>
      </section>
    );
  }

  return (
    <section className="leitor-qr">
      <div className="leitor-qr__caixa">
        <div className="leitor-qr__cabecalho">
          <span className="leitor-qr__territorio">{dadosTerritorio.icone} {dadosTerritorio.nome}</span>
          <h3>{artefatoAr.titulo}</h3>
          <p>{artefatoAr.descricao}</p>
        </div>

        <div className="leitor-qr__viewport">
          {pronto ? (
            <div ref={referenciaCena} className="leitor-qr__cena">
              <a-scene
                embedded
                arjs="sourceType: webcam; debugUIEnabled: false; trackingMethod: best;"
                renderer="antialias: true; alpha: true; colorManagement: true;"
                vr-mode-ui="enabled: false"
                device-orientation-permission-ui="enabled: false"
              >
                <a-marker preset="hiro">
                  <ConteudoMarcador artefato={artefatoAr} />
                </a-marker>
                <a-entity camera />
              </a-scene>
            </div>
          ) : (
            <div className="leitor-qr__placeholder">
              <div className="leitor-qr__placeholder-modelo">
                <span>Marcador `hiro`</span>
                <strong>Carregando visual AR...</strong>
              </div>
            </div>
          )}
        </div>

        <div className="leitor-qr__info">
          <p>
            Aponte a câmera para o marcador `hiro` para visualizar o objeto 3D
            do território em realidade aumentada.
          </p>
          {!cameraAtiva && pronto && !erroCamera && (
            <p className="leitor-qr__status">
              Aguardando inicialização da câmera...
            </p>
          )}
          <p>
            Missão vinculada: <strong>{missaoRelacionada}</strong>
          </p>
          <p>
            Item da coleta: <strong>{artefatoAr.item.nome}</strong>
          </p>
          {(erroCamera || erro) && (
            <p className="leitor-qr__erro-texto">{erroCamera || erro}</p>
          )}
          {coletadoNoPainel && (
            <p className="leitor-qr__coletado">
              O item foi adicionado ao inventário do personagem.
            </p>
          )}
        </div>

        <button
          type="button"
          className="leitor-qr__botao-coletar"
          onClick={lidarComColeta}
          disabled={coletadoNoPainel}
        >
          Coletar
        </button>
      </div>
    </section>
  );
}
