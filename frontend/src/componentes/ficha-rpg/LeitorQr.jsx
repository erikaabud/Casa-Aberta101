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

function ModeloArFallback() {
  return (
    <>
      <a-entity
        geometry="primitive: box; depth: 0.45; height: 0.45; width: 0.45"
        material="color: #d4af37; emissive: #5b4400; metalness: 0.32; roughness: 0.28;"
        position="0 0.35 0"
        rotation="0 45 0"
        animation="property: rotation; to: 0 405 0; loop: true; dur: 7000; easing: linear"
      />
      <a-ring
        position="0 0.35 0"
        rotation="-90 0 0"
        radius-inner="0.48"
        radius-outer="0.65"
        color="#93c5fd"
      />
    </>
  );
}

function ConteudoMarcador({ item }) {

  const caminho =

    item?.caminho_modelo_3d ||

    item?.caminho_imagem ||

    '';
 
  if (!caminho) {

    return <ModeloArFallback />;

  }
 
  const caminhoMinusculo = caminho.toLowerCase();
 
  const ehModelo3D =

    caminhoMinusculo.endsWith('.glb') ||

    caminhoMinusculo.endsWith('.gltf');
 
  const ehImagem =

    caminhoMinusculo.endsWith('.png') ||

    caminhoMinusculo.endsWith('.jpg') ||

    caminhoMinusculo.endsWith('.jpeg') ||

    caminhoMinusculo.endsWith('.webp');
 
  /* ==============================

     MODELO 3D GLB / GLTF

  ============================== */
 
  if (ehModelo3D) {

    return (
<a-entity

        gltf-model={`url(${caminho})`}

        position="0 0.5 0"

        rotation="0 0 0"

        scale="0.7 0.7 0.7"

        animation="

          property: rotation;

          to: 0 360 0;

          loop: true;

          dur: 9000;

          easing: linear

        "

      />

    );

  }
 
  /* ==============================

     IMAGEM PNG / JPG / WEBP

  ============================== */
 
  if (ehImagem) {

    return (
<a-entity

        position="0 0.7 0"

        rotation="-90 0 0"
>
<a-image

          src={caminho}

          width="1.4"

          height="1.4"

          transparent="true"

          material="

            shader: flat;

            transparent: true;

            alphaTest: 0.01;

            side: double;

          "

        />
</a-entity>

    );

  }
 
  return <ModeloArFallback />;

}
 

function pararFluxoDeMidia(elemento) {
  const fluxo = elemento?.srcObject;
  if (fluxo?.getTracks) {
    fluxo.getTracks().forEach((trilha) => trilha.stop());
  }

  if (elemento) {
    try {
      elemento.srcObject = null;
    } catch {
      // ignora
    }
  }
}

function limparResiduosGlobaisAr(containerAtual = null) {
  const seletores = [
    '#arjs-video',
    'body > video',
    'canvas[data-aframe-canvas]',
    '.a-canvas',
    '.arjs-loader',
    '.a-loader-title',
    '.a-enter-vr',
    '.a-orientation-modal',
    'body > a-scene',
  ];

  const elementos = Array.from(document.querySelectorAll(seletores.join(', ')));

  elementos.forEach((elemento) => {
    if (containerAtual?.contains(elemento)) return;

    if (elemento instanceof HTMLVideoElement) {
      pararFluxoDeMidia(elemento);
    }

    try {
      elemento.remove();
    } catch {
      // ignora
    }
  });
}

export function LeitorQr({
  regiao,
  missao,
  item,
  aoColetar,
  aoEncerrar,
  modo = 'painel',
}) {
  const { pronto, erro } = useMotorAr();
  const referenciaCena = useRef(null);
  const marcadorRef = useRef(null);
  const [erroCamera, setErroCamera] = useState(null);
  const [cameraAtiva, setCameraAtiva] = useState(false);
  const [marcadorDetectado, setMarcadorDetectado] = useState(false);
  const [coletando, setColetando] = useState(false);
  const [mensagem, setMensagem] = useState('');
  const estilosOriginaisDocumento = useRef(null);
  const componenteMontadoRef = useRef(true);
  useEffect(() => {
    componenteMontadoRef.current = true;
   
    return () => {
      componenteMontadoRef.current = false;
    };
  }, []);

  useEffect(() => {
    setErroCamera(null);
    setCameraAtiva(false);
    setMarcadorDetectado(false);
    setMensagem('');
  }, [regiao?.id_regiao, missao?.id_missao, item?.id_item]);

  useEffect(() => {

    const html = document.documentElement;
  
    const body = document.body;
   
    estilosOriginaisDocumento.current = {
  
      htmlStyle: html.getAttribute('style'),
  
      bodyStyle: body.getAttribute('style'),
  
    };
   
    if (modo === 'modal') {
  
      html.classList.add('leitor-qr-scroll-lock');
  
      body.classList.add('leitor-qr-scroll-lock');
   
      html.style.overflow = 'hidden';
  
      body.style.overflow = 'hidden';
  
    }
   
    return () => {
  
      limparResiduosGlobaisAr(referenciaCena.current);
   
      html.classList.remove('leitor-qr-scroll-lock');
  
      body.classList.remove('leitor-qr-scroll-lock');
   
      const estilosOriginais = estilosOriginaisDocumento.current;
   
      if (estilosOriginais?.htmlStyle) {
  
        html.setAttribute('style', estilosOriginais.htmlStyle);
  
      } else {
  
        html.removeAttribute('style');
  
      }
   
      if (estilosOriginais?.bodyStyle) {
  
        body.setAttribute('style', estilosOriginais.bodyStyle);
  
      } else {
  
        body.removeAttribute('style');
  
      }
   
      // Remove alterações de tamanho deixadas pelo AR.js
  
      requestAnimationFrame(() => {
  
        body.style.removeProperty('width');
  
        body.style.removeProperty('height');
  
        body.style.removeProperty('margin-left');
  
        body.style.removeProperty('margin-top');
   
        html.style.removeProperty('height');
   
        window.dispatchEvent(new Event('resize'));
  
      });
  
    };
  
  }, [modo]);
   

  useEffect(() => {
    const marcador = marcadorRef.current;
    if (!marcador) return undefined;

    const aoEncontrar = () => setMarcadorDetectado(true);
    const aoPerder = () => setMarcadorDetectado(false);

    marcador.addEventListener('markerFound', aoEncontrar);
    marcador.addEventListener('markerLost', aoPerder);

    return () => {
      marcador.removeEventListener('markerFound', aoEncontrar);
      marcador.removeEventListener('markerLost', aoPerder);
    };
  }, [pronto, item?.id_item]);

  function encaixarElementosArNoQuadro() {

    const container = referenciaCena.current;
   
    if (!container) return false;
   
    const cena = container.querySelector('a-scene');
   
    const videoAr =
  
      document.querySelector('#arjs-video') ||
  
      document.querySelector('body > video');
   
    /*
  
     * IMPORTANTE:
  
     * o canvas precisa continuar DENTRO do a-scene.
  
     * Não usar appendChild(canvasAr) aqui.
  
     */
  
    const canvasAr =
  
      cena?.canvas ||
  
      cena?.querySelector('canvas.a-canvas') ||
  
      cena?.querySelector('canvas[data-aframe-canvas]') ||
  
      cena?.querySelector('canvas');
   
    /* =====================================
  
       VÍDEO DA CÂMERA
  
    ===================================== */
   
    if (videoAr) {
  
      /*
  
       * O vídeo pode ficar dentro do nosso container.
  
       * O canvas NÃO.
  
       */
  
      if (videoAr.parentElement !== container) {
  
        container.insertBefore(videoAr, container.firstChild);
  
      }
   
      videoAr.setAttribute('playsinline', 'true');
  
      videoAr.setAttribute('autoplay', 'true');
   
      videoAr.muted = true;
  
      videoAr.dataset.arDentroDoModal = 'true';
   
      videoAr.style.setProperty(
  
        'position',
  
        'absolute',
  
        'important'
  
      );
   
      videoAr.style.setProperty(
  
        'inset',
  
        '0',
  
        'important'
  
      );
   
      videoAr.style.setProperty(
  
        'width',
  
        '100%',
  
        'important'
  
      );
   
      videoAr.style.setProperty(
  
        'height',
  
        '100%',
  
        'important'
  
      );
   
      videoAr.style.setProperty(
  
        'object-fit',
  
        'cover',
  
        'important'
  
      );
   
      videoAr.style.setProperty(
  
        'object-position',
  
        'center',
  
        'important'
  
      );
   
      videoAr.style.setProperty(
  
        'margin',
  
        '0',
  
        'important'
  
      );
   
      videoAr.style.setProperty(
  
        'transform',
  
        'none',
  
        'important'
  
      );
   
      videoAr.style.setProperty(
  
        'z-index',
  
        '0',
  
        'important'
  
      );
   
      videoAr.style.setProperty(
  
        'opacity',
  
        '1',
  
        'important'
  
      );
   
      videoAr.style.setProperty(
  
        'visibility',
  
        'visible',
  
        'important'
  
      );
  
    }
   
    /* =====================================
  
       CENA DO A-FRAME
  
    ===================================== */
   
    if (cena) {
  
      cena.style.setProperty(
  
        'position',
  
        'absolute',
  
        'important'
  
      );
   
      cena.style.setProperty(
  
        'inset',
  
        '0',
  
        'important'
  
      );
   
      cena.style.setProperty(
  
        'width',
  
        '100%',
  
        'important'
  
      );
   
      cena.style.setProperty(
  
        'height',
  
        '100%',
  
        'important'
  
      );
   
      cena.style.setProperty(
  
        'z-index',
  
        '1',
  
        'important'
  
      );
   
      cena.style.setProperty(
  
        'pointer-events',
  
        'none',
  
        'important'
  
      );
  
    }
   
    /* =====================================
  
       CANVAS 3D
  
    ===================================== */
   
    if (canvasAr) {
  
      /*
  
       * NÃO mover este elemento.
  
       * Ele precisa continuar filho do a-scene.
  
       */
   
      canvasAr.dataset.arDentroDoModal = 'true';
   
      canvasAr.style.setProperty(
  
        'position',
  
        'absolute',
  
        'important'
  
      );
   
      canvasAr.style.setProperty(
  
        'inset',
  
        '0',
  
        'important'
  
      );
   
      canvasAr.style.setProperty(
  
        'width',
  
        '100%',
  
        'important'
  
      );
   
      canvasAr.style.setProperty(
  
        'height',
  
        '100%',
  
        'important'
  
      );
   
      canvasAr.style.setProperty(
  
        'margin',
  
        '0',
  
        'important'
  
      );
   
      canvasAr.style.setProperty(
  
        'display',
  
        'block',
  
        'important'
  
      );
   
      canvasAr.style.setProperty(
  
        'background',
  
        'transparent',
  
        'important'
  
      );
   
      canvasAr.style.setProperty(
  
        'opacity',
  
        '1',
  
        'important'
  
      );
   
      canvasAr.style.setProperty(
  
        'visibility',
  
        'visible',
  
        'important'
  
      );
   
      canvasAr.style.setProperty(
  
        'z-index',
  
        '1',
  
        'important'
  
      );
   
      canvasAr.style.setProperty(
  
        'pointer-events',
  
        'none',
  
        'important'
  
      );
  
    }
   
    return !!videoAr && !!canvasAr;
  
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
         
          // AR.js continua alterando o tamanho por alguns segundos.
          // Por isso não encerramos o ajuste imediatamente.
          encaixarElementosArNoQuadro();
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
  }, [pronto, regiao?.id_regiao]);

  useEffect(() => {
    return () => {
      componenteMontadoRef.current = false;
      finalizarMotorAr({ atualizarEstado: false });
    };
  }, []);

  function finalizarMotorAr({ atualizarEstado = true } = {}) {
    // 1) Pausa a cena do A-Frame (evita callbacks do AR.js tentando ler marker após desmontar)
    const cena = referenciaCena.current?.querySelector('a-scene');
    if (cena) {
      try {
        cena.pause();
      } catch {
        // ignora
      }
      try {
        if (cena.renderer?.setAnimationLoop) {
          cena.renderer.setAnimationLoop(null);
        }
        cena.renderer?.dispose?.();
      } catch {
        // ignora
      }
    }

    // 2) Para a câmera (tracks)
    const videoAr =
      document.querySelector('#arjs-video') ||
      document.querySelector('body > video');

    pararFluxoDeMidia(videoAr);

    // 3) Remove vídeo/canvas do AR.js (evita "vazar" layout na ficha)
    const container = referenciaCena.current;
    const elementosAr = [
      ...(container ? Array.from(container.querySelectorAll('video[data-ar-dentro-do-modal="true"], canvas[data-ar-dentro-do-modal="true"], .a-canvas[data-ar-dentro-do-modal="true"]')) : []),
    ];

    elementosAr.forEach((elemento) => {
      try {
        elemento.remove();
      } catch {
        // ignora
      }
    });

    if (videoAr) {
      if (videoAr.dataset?.arDentroDoModal === 'true') {
        try {
          videoAr.remove();
        } catch {
          // ignora
        }
      }
    }

    // 4) Remove a cena por último (depois de pausar o loop/render)
    if (cena) {
      try {
        cena.parentNode?.removeChild(cena);
      } catch {
        // ignora
      }
    }

    limparResiduosGlobaisAr(container);

    if (atualizarEstado) {
      setCameraAtiva(false);
      setMarcadorDetectado(false);
    }
  }

  const missaoRelacionada = useMemo(
    () => missao?.nome_missao || 'Missão não selecionada',
    [missao],
  );

  async function lidarComColeta() {
    if (!item || !marcadorDetectado || coletando) return;

    setColetando(true);

    // Fecha a câmera imediatamente para não deixar o stream ativo após a coleta.
    finalizarMotorAr({ atualizarEstado: true });
    aoEncerrar?.();

    try {
      await aoColetar?.(item);
    } catch (erroAtual) {
      if (componenteMontadoRef.current) {
        setMensagem(erroAtual?.message || 'Não foi possível coletar o item agora.');
      }
    } finally {
      if (componenteMontadoRef.current) {
        setColetando(false);
      }
    }
  }

  if (!regiao || !missao) {
    return (
      <section className="leitor-qr">
        <div className="leitor-qr__caixa">
          <p className="leitor-qr__status">
            Selecione uma missão para abrir o leitor e preparar a coleta.
          </p>
        </div>
      </section>
    );
  }

  return (
    <section className={`leitor-qr ${modo === 'modal' ? 'leitor-qr--modal' : ''}`}>
      <div className="leitor-qr__caixa">
        <div className="leitor-qr__viewport">
          {pronto ? (
            <div ref={referenciaCena} className="leitor-qr__cena">
              <a-scene
                key={`${regiao?.id_regiao || 'r'}-${missao?.id_missao || 'm'}-${item?.id_item || 'i'}`}
                embedded
                arjs="sourceType: webcam; debugUIEnabled: false; trackingMethod: best;"
                renderer="antialias: true; alpha: true; colorManagement: true;"
                vr-mode-ui="enabled: false"
                device-orientation-permission-ui="enabled: false"
              >
                <a-marker
                  ref={marcadorRef}
                  preset="hiro"
                  emitevents="true"
                  smooth="true"
                  smoothCount="10"
                  smoothTolerance="0.01"
                  smoothThreshold="5">
                 <ConteudoMarcador item={item} />
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

          <div className="leitor-qr__overlay">
            <div className="leitor-qr__overlay-topo">
              <span className="leitor-qr__territorio">{regiao.nome_regiao}</span>
              <strong>{item?.nome_item || 'Sem item pendente'}</strong>
            </div>

            <div className="leitor-qr__overlay-status">
              {!cameraAtiva && pronto && !erroCamera && (
                <span className="leitor-qr__status">Aguardando câmera...</span>
              )}
              <span>
                Marcador: <strong>{marcadorDetectado ? 'Detectado' : 'Não detectado'}</strong>
              </span>
              {(erroCamera || erro) && (
                <span className="leitor-qr__erro-texto">{erroCamera || erro}</span>
              )}
              {mensagem && (
                <span className={mensagem.includes('sucesso') || mensagem.includes('inventário') ? 'leitor-qr__coletado' : 'leitor-qr__status'}>
                  {mensagem}
                </span>
              )}
            </div>

            <div className="leitor-qr__overlay-base">
              <span className="leitor-qr__status">
                Missão: <strong>{missaoRelacionada}</strong>
              </span>
              <button
                type="button"
                className="leitor-qr__botao-coletar"
                onClick={lidarComColeta}
                disabled={!item || !marcadorDetectado || coletando}
              >
                {coletando ? 'Coletando...' : 'Coletar'}
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
