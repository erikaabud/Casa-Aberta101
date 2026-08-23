import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import './Desenvolvedores.css';

// LOGOTIPO
import gitHub from "../assets/github.png";
import linkedin from "../assets/linkedin.png";
import instagram from "../assets/instagram.png";

// IMGS EQUIPE
import camillyv from "../assets/camilly.png";
import gigi from "../assets/gigi.jpg";
import abud from "../assets/abud.png";
import balys from "../assets/balys.jpg";
import gabriel from "../assets/gabriel.jpg";
import luciano from "../assets/luciano.png";
import juca from "../assets/juca.jpg";
import vitor from "../assets/vitor.jpg";

const Desenvolvedores = () => {
  const [membroSelecionado, setMembroSelecionado] = useState(null);
  const [imagemZoom, setImagemZoom] = useState(null); // Estado para o zoom da imagem

  // Função para abrir o zoom da imagem
  const abrirZoom = (imagem, nome, e) => {
    e.stopPropagation(); // Evita expandir o card
    setImagemZoom({ imagem, nome });
  };

  // Função para fechar o zoom
  const fecharZoom = () => {
    setImagemZoom(null);
  };

  // Função helper para renderizar links sociais
  const renderSocialLink = (username, url, icon, alt) => {
    if (!username) return null;
    
    return (
      <a
        href={url}
        target="_blank"
        rel="noopener noreferrer"
        className="social-link"
        onClick={(e) => e.stopPropagation()}>
        <img src={icon} alt={alt} className='social-icon' />
      </a>
    );
  };

  const equipe = [
    {
      id: 1,
      nome: 'Balys Kozakevic',
      funcao: 'FRONT-END',
      imagem: balys,
      idade: 22,
      cidade: 'São Paulo',
      habilidades: [],
      bio: 'Sou estudante do curso de Tecnico em Informatica do Senac, possuo certificado em montagem e desmontagem de computadores, certificado em redes, em busca do certificado de banco de dados, JavaScript, CSS, HTMl e MySQL, tenho experiência em trabalho de equipe.',
      redes: { github: 'BalysSantosKozakevic', linkedin: '', instagram: '' },
      curiosidade: 'Apesar de estar estudando a area de TI, também faço parte da area de segurança utilizando auto defesa e tendo que lidar com o público.'
    },
    {
      id: 2,
      nome: 'Camilly Victoria',
      funcao: 'FRONT-END',
      imagem: camillyv,
      idade: 21,
      cidade: 'São Paulo',
      habilidades: ['JavaScript', 'HTML', 'CSS'],
      bio: 'Estudante de Análise e Desenvolvimento de Sistemas e Técnico em Tecnologia da Informação. Atua no desenvolvimento de interfaces web responsivas e intuitivas utilizando HTML, CSS e JavaScript, buscando criar experiências modernas, acessíveis e focadas na melhor experiência do usuário.',
      redes: { github: 'camillysantos-dev', linkedin: 'camillyvictoriadosantos02', instagram: 'eae_camilly_' },
      curiosidade: 'Coleciona tatuagens como coleciona métricas ágeis - cada uma tem uma história e um significado. Para ela, a pele é o backlog da vida: tudo planejado, mas sempre aberta a novas ideias.'
    },
    {
      id: 3,
      nome: 'Erika Abud',
      funcao: 'LÍDER',
      imagem: abud, 
      idade: 17,
      cidade: 'São Paulo',
      habilidades: [ 'Gestão de Projetos', 'Comunicação', 'JavaScript'],
      bio: 'Sou Erika Abud, estudante do Técnico em Informática no Senac e do Técnico em Desenvolvimento de Sistemas, integrado ao Ensino Médio. Sou apaixonada por tecnologia e desenvolvimento de software, com conhecimentos em JavaScript, React, Node.js e bancos de dados. Estou sempre em busca de aprender, evoluir e enfrentar novos desafios. Meu objetivo é crescer como desenvolvedora e criar soluções inovadoras que façam a diferença.',
      redes: { github: 'erikaabud', linkedin: 'erika-abud-b8a459307', instagram: 'erikaabud_' },
      curiosidade: 'Além da tecnologia, falo inglês e espanhol e sou faixa marrom de judô, experiências que fortaleceram minha disciplina, comunicação e dedicação.'
    },
    {
      id: 4,
      nome: 'Gabriel de Souza',
      funcao: 'FRONT-END',
      imagem: gabriel,
      idade: 20,
      cidade: 'São Paulo',
      habilidades: ['HTML','CSS'],
      bio: 'Sou aluno do curso Senac com certificação em montagem e desmontagem de computador,reparos e manutenções de computadores, internet das coisas, possuo certificado cisco em cibersegurança, instalação de softwares e também tenho uma experiência com trabalho em grupo e desenvolvimento de competências, criação de banco de dados com conhecimento em HTML, CSS, JavaScript e SQL, proativo e com boa comunicação.',
      redes: { github: 'gabrieldesouzabobmarley-creator', linkedin: '', instagram: 'neroalpha__biel' },
      curiosidade: 'Alem da parte da tecnologia, tambem gosto da parte musical, toco teclado e estudo dança e canto e já fiz algumas apresentações.'
    },
    {
      id: 5,
      nome: 'Geovanni Calado',
      funcao: 'BACK-END',
      imagem: gigi,
      idade: 19,
      cidade: 'São Paulo',
      habilidades: ['MySQL', 'Manutenção em HardWare', 'JavaScript'],
      bio: 'Sou estudante do curso Técnico em Informática no Senac Santana, onde venho desenvolvendo conhecimentos em programação back-end com JavaScript e MySQL, além de práticas de modelagem de banco de dados e desenvolvimento de sistemas.Também possuo certificações da Cisco e formação como Assistente de Suporte e Manutenção de Computadores, adquirindo experiência tanto na área de infraestrutura quanto no desenvolvimento de software.Valorizo o trabalho em equipe e procuro manter uma comunicação respeitosa e objetiva, facilitando a colaboração entre pessoas com diferentes perfis. Acredito que saber distinguir o ambiente profissional das relações pessoais contribui para um clima organizacional mais produtivo.Busco evoluir continuamente por meio de novos desafios e oportunidades de aprendizado, sempre com dedicação, responsabilidade e compromisso em entregar resultados de qualidade.',
      redes: { github: 'Hackrin01', linkedin: '/geovanni-rodrigues-calado-n0715s0322', instagram: 'gii.rcalado' },
      curiosidade: 'Gosto de jogos e de ler quadrinhos, mangas e qualquer coisa fantasiosa.'
    },
    {
      id: 6,
      nome: 'João Pedro',
      funcao: 'BACK-END',
      imagem: juca,
      idade: 21,
      cidade: 'São Paulo',
      habilidades: ['JavaScript', 'Banco de Dados', 'Desenvolvimento Web'],
      bio: 'Estudante de Técnico em Informática no Senac Santana. Atualmente desenvolvo projetos utilizando JavaScript para backend e MySQL para gerenciamento de banco de dados, aplicando boas práticas de programação e desenvolvimento de sistemas. Possuo certificações Cisco e formação em Assistente de Suporte e Manutenção de Computadores, além de experiência em liderança e disciplina adquiridas no CPOR-SP.',
      redes: { github: 'Jpedroozxs', linkedin: 'jpedroomarques', instagram: '' },
      curiosidade: 'Além de estudar desenvolvimento de sistemas, participei do CPOR-SP, onde desenvolvi habilidades de liderança, responsabilidade e trabalho em equipe. Também gosto de explorar novas tecnologias e criar projetos que unem programação e banco de dados.'
    },
    {
      id: 7,
      nome: 'Luciano Filho',
      funcao: 'PROJETISTA DE AR',
      imagem: luciano,
      idade: 18,
      cidade: 'São Paulo',
      habilidades: ['Criatividade', 'Trabalho Manual', 'Montagem Manual'],
      bio: '',
      redes: { github: 'Lucianobfilho', linkedin: '', instagram: '' },
      curiosidade: '.'
    },
    {
      id: 8,
      nome: 'Paulo Santana',
      funcao: 'ROTEIRISTA',
      emoji: '🚀',
      idade: 22,
      cidade: 'São Paulo',
      habilidades: ['Craitividade', 'Narrativa', 'Criação de Missões'],
      bio: '',
      redes: { github: '', linkedin: '', instagram: '' },
      curiosidade: ''
    },
    {
      id: 9,
      nome: 'Paulo Vicenty',
      funcao: 'BANCO DE DADOS',
      emoji: '💻',
      idade: 21,
      cidade: 'São Paulo',
      habilidades: ['SQL', 'Modelagem de Dados', 'Análise de Dados'],
      bio: '',
      redes: { github: 'paulovicenty-debug', linkedin: '', instagram: '' },
      curiosidade: ' '
    },
    {
      id: 10,
      nome: 'Vitor Hugo',
      funcao: 'FRONT-END',
      imagem: vitor,
      idade: 19,
      cidade: 'São Paulo',
      habilidades: ['Manutenção de Computadores', 'Programação', 'Redes de Computadores'],
      bio: 'Estudante de Tecnologia da Informação, apaixonado por programação, infraestrutura de redes e desenvolvimento de sistemas. Atualmente cursando Técnico em Informática e buscando oportunidades para adquirir experiência prática e evoluir profissionalmente na área de TI.',
      redes: { github: 'vitinho13y7', linkedin: '', instagram: 'vitinho132y7' },
      curiosidade: 'Gosto de entender como tudo funciona por trás da tecnologia, desde linhas de código até a configuração de servidores e redes.'
    }
  ];

  // Estatísticas da equipe
  const totalMembros = equipe.length;
  const mediaIdade = Math.round(equipe.reduce((acc, m) => acc + m.idade, 0) / totalMembros);
  const habilidadesUnicas = [...new Set(equipe.flatMap(m => m.habilidades))];

  return (
    <div className="team-page">
      <nav className="barra-navegacao">
        <div className="container-nav">
          <div className="logo-nav">
            <span className="texto-logo">UMBRAETH</span>
            <span className="subtitulo-logo">As Crônicas</span>
          </div>
          <ul className="menu-nav">
            <li><Link to="/">Início</Link></li>
            <li><Link to="/cadastro">Cadastro</Link></li>
            <li><Link to="/about">Sobre</Link></li>
          </ul>
        </div>
      </nav>

      {/* Header da Equipe */}
      <div className="team-header">
        <div className="team-header-content">
          <h1>⚔️ A Equipe — T.I 101</h1>
          <p className="team-subtitle">Casa Aberta Senac 2026</p>
          <div className="team-stats-banner">
            <div className="stat-banner-item">
              <span className="stat-banner-number">{totalMembros}</span>
              <span className="stat-banner-label">Alunos</span>
            </div>
            <div className="stat-banner-divider">|</div>
            <div className="stat-banner-item">
              <span className="stat-banner-number">{mediaIdade}</span>
              <span className="stat-banner-label">Idade Média</span>
            </div>
            <div className="stat-banner-divider">|</div>
            <div className="stat-banner-item">
              <span className="stat-banner-number">{habilidadesUnicas.length}</span>
              <span className="stat-banner-label">Habilidades</span>
            </div>
          </div>
        </div>
      </div>

      {/* Grid da Equipe */}
      <div className="team-grid-container">
        <div className="team-grid">
          {equipe.map((membro) => (
            <div
              key={membro.id}
              className="team-card"
              onClick={() => setMembroSelecionado(membroSelecionado?.id === membro.id ? null : membro)}
            >
              <div className="team-card-header">
                <div 
                  className="team-avatar"
                  onClick={(e) => {
                    if (membro.imagem) {
                      abrirZoom(membro.imagem, membro.nome, e);
                    } else {
                      e.stopPropagation();
                    }
                  }}
                  style={{ cursor: membro.imagem ? 'pointer' : 'default' }}
                >
                  {membro.imagem ? (
                    <img
                      src={membro.imagem}
                      alt={membro.nome}
                      className="team-avatar-img"
                    />
                  ) : (
                    <span className="team-emoji">{membro.emoji}</span>
                  )}
                </div>
                <div className="team-card-badge">{membro.funcao}</div>
              </div>

              <h3 className="team-card-name">{membro.nome}</h3>
              <p className="team-card-role">{membro.funcao}</p>

              <div className="team-card-info">
                <span className="material-symbols-outlined">
                  location_on
                </span>
                <p>{membro.cidade}</p>
                <span className="material-symbols-outlined">
                  cake 
                </span>
                <p>{membro.idade} anos</p>
              </div>

              <div className="team-card-skills">
                {membro.habilidades.slice(0, 3).map((skill, idx) => (
                  <span key={idx} className="skill-tag">{skill}</span>
                ))}
                {membro.habilidades.length > 3 && (
                  <span className="skill-tag more">+{membro.habilidades.length - 3}</span>
                )}
              </div>

              {/* REDES SOCIAIS - Agora com renderização condicional */}
              <div className="team-card-social">
                {renderSocialLink(
                  membro.redes?.github,
                  `https://github.com/${membro.redes.github}`,
                  gitHub,
                  'GitHub'
                )}
                {renderSocialLink(
                  membro.redes?.linkedin,
                  `https://linkedin.com/in/${membro.redes.linkedin}`,
                  linkedin,
                  'LinkedIn'
                )}
                {renderSocialLink(
                  membro.redes?.instagram,
                  `https://instagram.com/${membro.redes.instagram}`,
                  instagram,
                  'Instagram'
                )}
              </div>
              
              <div className="team-card-expand">
                <span className="expand-icon">{membroSelecionado?.id === membro.id ? '▲' : '▼'}</span>
                <span className="expand-text">
                  {membroSelecionado?.id === membro.id ? 'Ver menos' : 'Ver mais'}
                </span>
              </div>

              {/* Detalhes expandidos */}
              {membroSelecionado?.id === membro.id && (
                <div className="team-card-details">
                  <div className="detail-section">
                    <h4>📖 Sobre</h4>
                    <p>{membro.bio || 'Informações não disponíveis'}</p>
                  </div>
                  <div className="detail-section">
                    <h4>💡 Curiosidade</h4>
                    <p>{membro.curiosidade || 'Informações não disponíveis'}</p>
                  </div>
                  <div className="detail-section">
                    <h4>🛠️ Todas as Habilidades</h4>
                    <div className="all-skills">
                      {membro.habilidades.map((skill, idx) => (
                        <span key={idx} className="skill-tag full">{skill}</span>
                      ))}
                    </div>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* MODAL DE ZOOM DA IMAGEM */}
      {imagemZoom && (
        <div className="image-zoom-overlay" onClick={fecharZoom}>
          <div className="image-zoom-container" onClick={(e) => e.stopPropagation()}>
            <button className="image-zoom-close" onClick={fecharZoom}>
              ✕
            </button>
            <img 
              src={imagemZoom.imagem} 
              alt={imagemZoom.nome} 
              className="image-zoom-img"
            />
            <p className="image-zoom-name">{imagemZoom.nome}</p>
          </div>
        </div>
      )}

      {/* Botão Voltar */}
      <div className="team-footer-actions">
        <Link to="/" className="voltar-link">← Voltar ao início</Link>
      </div>

      {/* Rodapé */}
      <footer className="team-footer">
        <p>Casa Aberta Senac 2026 · Turma T.I 101 </p>
        <div className="team-footer-meta">
          <span>Feito com muito código e café</span>
          <span className="footer-divider">|</span>
          <span>Sempre aprendendo</span>
        </div>
      </footer>
    </div>
  );
};

export default Desenvolvedores;