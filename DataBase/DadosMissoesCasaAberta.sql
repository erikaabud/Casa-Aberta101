-- Dados oficiais de missões/itens (Casa Aberta)
-- Observação importante:
-- Este arquivo foi preparado para ficar SOMENTE com as missões/itens atuais do evento.
-- Por isso, ele REMOVE todas as missões/itens anteriores da região "Casa Aberta"
-- (incluindo progresso e itens já coletados relacionados a essas missões).
--
-- Como usar:
-- 1) Crie o banco e aplique `EstruturaDoDb` + `ProceduresDoDb` primeiro.
-- 2) Em seguida, execute este arquivo.

START TRANSACTION;

-- 1) Classes base (FK item.id_classe -> classe.id_classe)
INSERT IGNORE INTO classe (nome_classe, descricao_classe) VALUES
  ('Guerreiro', 'Combatente de linha de frente, resistente e especialista em proteger a equipe.'),
  ('Ladino', 'Especialista em precisão, armadilhas e movimentação rápida.'),
  ('Mago', 'Canaliza energia arcana para manipular o campo de batalha.'),
  ('Clérigo', 'Suporte sagrado capaz de sustentar e proteger aliados.');

-- 2) Região "Casa Aberta" (cria se não existir e atualiza a descrição)
INSERT INTO regiao (nome_regiao, descricao_regiao)
SELECT 'Casa Aberta', 'Região principal do evento Casa Aberta (missões e coleta via marcador HIRO).'
WHERE NOT EXISTS (SELECT 1 FROM regiao WHERE nome_regiao = 'Casa Aberta');

UPDATE regiao
SET descricao_regiao = 'Região principal do evento Casa Aberta (missões e coleta via marcador HIRO).'
WHERE nome_regiao = 'Casa Aberta';

-- 3) IDs úteis
SET @id_regiao_casa_aberta = (SELECT id_regiao FROM regiao WHERE nome_regiao = 'Casa Aberta' LIMIT 1);
SET @id_classe_guerreiro = (SELECT id_classe FROM classe WHERE nome_classe = 'Guerreiro' LIMIT 1);
SET @id_classe_ladino = (SELECT id_classe FROM classe WHERE nome_classe = 'Ladino' LIMIT 1);
SET @id_classe_mago = (SELECT id_classe FROM classe WHERE nome_classe = 'Mago' LIMIT 1);

-- 4) Limpeza: remove dados antigos da Casa Aberta (para manter somente o conjunto atual)
DELETE ei
FROM equipe_item ei
JOIN item i ON i.id_item = ei.id_item
JOIN missao m ON m.id_missao = i.id_missao
WHERE m.id_regiao = @id_regiao_casa_aberta;

DELETE p
FROM progresso p
JOIN missao m ON m.id_missao = p.id_missao
WHERE m.id_regiao = @id_regiao_casa_aberta;

DELETE i
FROM item i
JOIN missao m ON m.id_missao = i.id_missao
WHERE m.id_regiao = @id_regiao_casa_aberta;

DELETE FROM missao
WHERE id_regiao = @id_regiao_casa_aberta;

-- 5) Inserção das missões e itens (conjunto atual)

-- Missão 1: Recuperar as Joias do Selo (geral)
INSERT INTO missao (nome_missao, descricao_missao, id_regiao, id_classe, tipo_missao)
VALUES (
  'Recuperar as Joias do Selo',
  'Encontrar um Cryptex e o baú para obter as 3 joias. O Cryptex e o baú estarão espalhados por todo o segundo andar, o cryptex e o baú nunca estarão em nenhuma sala',
  @id_regiao_casa_aberta,
  NULL,
  'Equipe'
);
SET @id_missao_joias = LAST_INSERT_ID();

INSERT INTO item (nome_item, descricao_item, id_missao, id_classe, quantidade_necessaria, caminho_imagem)
VALUES (
  'Baú das Joias',
  'Baú perdido pelo cenário que contém duas das três joias.',
  @id_missao_joias,
  @id_classe_guerreiro,
  1,
  '/modelos-3d/casa_aberta/recuperar_as_joias_do_selo/bau-das-joias.glb'
);

-- Missão 2: Encontrar a Espada Selada (guerreiro)
INSERT INTO missao (nome_missao, descricao_missao, id_regiao, id_classe, tipo_missao)
VALUES (
  'Encontrar a Espada Selada',
  'Localizar a espada que servirá de chave para abrir a Câmara Selada. A Espada estará localizada em uma sala aleatória do segundo andar',
  @id_regiao_casa_aberta,
  @id_classe_guerreiro,
  'Equipe'
);
SET @id_missao_espada = LAST_INSERT_ID();

INSERT INTO item (nome_item, descricao_item, id_missao, id_classe, quantidade_necessaria, caminho_imagem)
VALUES (
  'Espada Selada',
  'A espada que abre a Câmara Selada.',
  @id_missao_espada,
  @id_classe_guerreiro,
  1,
  '/modelos-3d/casa_aberta/encontrar_a_espada_selada/espada-selada.glb'
);

-- Missão 3: Resolver os Desafios (geral)
INSERT INTO missao (nome_missao, descricao_missao, id_regiao, id_classe, tipo_missao)
VALUES (
  'Resolver os Desafios',
  'Abrir o cryptex e o baú: O grupo deve somar 5 pontos no alvo para abrir o baú, e conseguir acertar a formação de 3 cores com tinta para abrir o cryptex',
  @id_regiao_casa_aberta,
  NULL,
  'Equipe'
);
SET @id_missao_desafios = LAST_INSERT_ID();

INSERT INTO item (nome_item, descricao_item, id_missao, id_classe, quantidade_necessaria, caminho_imagem)
VALUES (
  '2a Joia: desafio de alquimia',
  'Resolver o desafio de alquimia para abrir um cryptex.',
  @id_missao_desafios,
  @id_classe_mago,
  1,
  '/modelos-3d/casa_aberta/resolver_os_desafios/desafio-alquimia.glb'
);

INSERT INTO item (nome_item, descricao_item, id_missao, id_classe, quantidade_necessaria, caminho_imagem)
VALUES (
  'Espada: encontrar espada',
  'Localizar espada espalhada pelo segundo andar',
  @id_missao_desafios,
  @id_classe_guerreiro,
  1,
  '/modelos-3d/casa_aberta/resolver_os_desafios/espada-selada.glb'
);

INSERT INTO item (nome_item, descricao_item, id_missao, id_classe, quantidade_necessaria, caminho_imagem)
VALUES (
  'Última joia',
  'Última joia obtida após completar o desafio.',
  @id_missao_desafios,
  @id_classe_guerreiro,
  1,
  '/modelos-3d/casa_aberta/resolver_os_desafios/ultima-joia.glb'
);

-- Missão 4: Recuperar a Bomba Alquímica (mago)
INSERT INTO missao (nome_missao, descricao_missao, id_regiao, id_classe, tipo_missao)
VALUES (
  'Recuperar a Bomba Alquímica',
  'Desafio alternativo de alquimia para o Mago (opção extra para atingir o chefe final).',
  @id_regiao_casa_aberta,
  @id_classe_mago,
  'Equipe'
);
SET @id_missao_bomba = LAST_INSERT_ID();

INSERT INTO item (nome_item, descricao_item, id_missao, id_classe, quantidade_necessaria, caminho_imagem)
VALUES (
  'Combinar cores: Vermelha',
  'Combinar a cor vermelha no desafio de alquimia.',
  @id_missao_bomba,
  @id_classe_mago,
  1,
  '/modelos-3d/casa_aberta/recuperar_a_bomba_alquimica/cor-vermelha.glb'
);

COMMIT;