CREATE DATABASE rpg;
USE rpg;

-- Herois / Personagens
CREATE TABLE usuario (
    id_usuario INT AUTO_INCREMENT PRIMARY KEY,
    nome_usuario VARCHAR(100) NOT NULL UNIQUE,
    senha_usuario VARCHAR(255) NOT NULL
);

CREATE TABLE classe (
    id_classe INT AUTO_INCREMENT PRIMARY KEY,
    nome_classe VARCHAR(50) NOT NULL UNIQUE,
    descricao_classe TEXT NOT NULL
);

CREATE TABLE habilidade(
    id_habilidade INT AUTO_INCREMENT PRIMARY KEY,
    id_classe INT NOT NULL,
    nome_habilidade VARCHAR(50) NOT NULL,
    custo_mp INT NOT NULL,
    uso_unico BOOLEAN NOT NULL DEFAULT FALSE,
    FOREIGN KEY (id_classe) REFERENCES classe(id_classe) ON DELETE CASCADE
);

CREATE TABLE equipe (
    id_equipe INT AUTO_INCREMENT PRIMARY KEY,
    nome_equipe VARCHAR(50) NOT NULL,
    codigo CHAR(6) NOT NULL UNIQUE,
    pontuacao INT DEFAULT 0,
    status ENUM('Jogando', 'Finalizada', 'Incompleta') DEFAULT 'Jogando',
    id_lider INT NULL
);

CREATE TABLE integrante (
    id_equipe INT NOT NULL,
    id_usuario INT NOT NULL,
    id_classe INT NOT NULL,
    PRIMARY KEY (id_equipe, id_usuario),
    FOREIGN KEY (id_equipe) REFERENCES equipe(id_equipe) ON DELETE CASCADE,
    FOREIGN KEY (id_usuario) REFERENCES usuario(id_usuario) ON DELETE CASCADE,
    FOREIGN KEY (id_classe) REFERENCES classe(id_classe) ON DELETE CASCADE
);

-- Adicionar a chave estrangeira para o líder
ALTER TABLE equipe
ADD CONSTRAINT fk_lider_equipe
FOREIGN KEY (id_equipe, id_lider)
REFERENCES integrante(id_equipe, id_usuario);

CREATE TABLE regiao (
    id_regiao INT AUTO_INCREMENT PRIMARY KEY,
    nome_regiao VARCHAR(100) NOT NULL UNIQUE,
    descricao_regiao TEXT NOT NULL
);

CREATE TABLE missao (
    id_missao INT AUTO_INCREMENT PRIMARY KEY,
    nome_missao VARCHAR(100) NOT NULL,
    descricao_missao TEXT NOT NULL,
    id_regiao INT NOT NULL,
	id_classe INT NULL,
	tipo_missao ENUM('Equipe', 'Individual') DEFAULT 'Equipe',
    FOREIGN KEY (id_regiao) REFERENCES regiao(id_regiao) ON DELETE CASCADE,
	FOREIGN KEY (id_classe) REFERENCES classe(id_classe) ON DELETE SET NULL
);

CREATE TABLE item (
    id_item INT AUTO_INCREMENT PRIMARY KEY,
    nome_item VARCHAR(60) NOT NULL UNIQUE,
    descricao_item TEXT NOT NULL,
    id_missao INT NOT NULL,
    id_classe INT NOT NULL,
    caminho_imagem VARCHAR(200) NOT NULL,
    FOREIGN KEY (id_missao) REFERENCES missao(id_missao) ON DELETE CASCADE,
    FOREIGN KEY (id_classe) REFERENCES classe(id_classe) ON DELETE CASCADE
);

CREATE TABLE inventario (
    id_usuario INT NOT NULL,
    id_item INT NOT NULL,
    estado_item ENUM('Normal', 'Amaldiçoado') NOT NULL DEFAULT 'Normal',
    quantidade INT DEFAULT 1,
    PRIMARY KEY (id_usuario, id_item),
    FOREIGN KEY (id_usuario) REFERENCES usuario(id_usuario) ON DELETE CASCADE,
    FOREIGN KEY (id_item) REFERENCES item(id_item) ON DELETE CASCADE
);

CREATE TABLE npc (
    id_npc INT AUTO_INCREMENT PRIMARY KEY,
    nome_npc VARCHAR(40) NOT NULL,
    tipo_npc ENUM('Guia', 'Inimigo') NOT NULL,
    descricao_npc TEXT NOT NULL,
    id_missao INT NULL,
    caminho_imagem VARCHAR(200) NOT NULL,
    FOREIGN KEY (id_missao) REFERENCES missao(id_missao) ON DELETE CASCADE
);

CREATE TABLE dialogo (
    id_dialogo INT AUTO_INCREMENT PRIMARY KEY,
    id_npc INT NOT NULL,
    ordem_dialogo TINYINT NOT NULL,
    texto_dialogo TEXT NOT NULL,
    FOREIGN KEY (id_npc) REFERENCES npc(id_npc) ON DELETE CASCADE,
    UNIQUE(id_npc, ordem_dialogo)
);

CREATE TABLE puzzle(
    id_puzzle INT AUTO_INCREMENT PRIMARY KEY,
    id_missao INT NULL,
    nome_puzzle VARCHAR(50) NOT NULL,
    descricao_puzzle TEXT NOT NULL,
    resposta_puzzle VARCHAR(50) NOT NULL,
    pontos_base INT NOT NULL,
    caminho_imagem VARCHAR(200) NOT NULL,
    FOREIGN KEY(id_missao) REFERENCES missao(id_missao) ON DELETE CASCADE
);

CREATE TABLE progresso(
    id_equipe INT NOT NULL,
    id_missao INT NOT NULL,
    situacao ENUM('Não concluido', 'Concluido') DEFAULT 'Não concluido',
    pontos_obtidos INT NOT NULL,
    PRIMARY KEY (id_equipe, id_missao),
    FOREIGN KEY (id_equipe) REFERENCES equipe(id_equipe) ON DELETE CASCADE,
    FOREIGN KEY (id_missao) REFERENCES missao(id_missao) ON DELETE CASCADE
);