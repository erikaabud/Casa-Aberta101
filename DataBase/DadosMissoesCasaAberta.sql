-- Dados de missões/itens (Casa Aberta)
-- Como usar:
-- 1) Crie o banco e aplique `EstruturaDoDb` + `ProceduresDoDb` primeiro.
-- 2) Em seguida, execute este arquivo.

START TRANSACTION;

-- Garante que existam as classes base (necessário por conta da FK item.id_classe -> classe.id_classe)
INSERT IGNORE INTO classe (nome_classe, descricao_classe) VALUES
  ('Guerreiro', 'Combatente de linha de frente, resistente e especialista em proteger a equipe.'),
  ('Ladino', 'Especialista em precisão, armadilhas e movimentação rápida.'),
  ('Mago', 'Canaliza energia arcana para manipular o campo de batalha.'),
  ('Clérigo', 'Suporte sagrado capaz de sustentar e proteger aliados.');

-- Garante que exista a região "Casa Aberta"
INSERT INTO regiao (nome_regiao, descricao_regiao)
SELECT 'Casa Aberta', 'Região principal do evento Casa Aberta (missões e coleta via marcador HIRO).'
WHERE NOT EXISTS (
  SELECT 1 FROM regiao WHERE nome_regiao = 'Casa Aberta'
);

-- IDs úteis
SET @id_regiao_casa_aberta = (SELECT id_regiao FROM regiao WHERE nome_regiao = 'Casa Aberta' LIMIT 1);
SET @id_classe_guerreiro = (SELECT id_classe FROM classe WHERE nome_classe = 'Guerreiro' LIMIT 1);
SET @id_classe_ladino = (SELECT id_classe FROM classe WHERE nome_classe = 'Ladino' LIMIT 1);
SET @id_classe_mago = (SELECT id_classe FROM classe WHERE nome_classe = 'Mago' LIMIT 1);

-- Missão 1: Recuperar as Joias do Selo (geral)
INSERT INTO missao (nome_missao, descricao_missao, id_regiao, id_classe, tipo_missao)
SELECT
  'Recuperar as Joias do Selo',
  'Encontrar os 2 Cryptex e o baú para obter as 3 joias. O baú é protegido pelo Esqueleto Espectral.',
  @id_regiao_casa_aberta,
  NULL,
  'Equipe'
WHERE NOT EXISTS (
  SELECT 1 FROM missao WHERE nome_missao = 'Recuperar as Joias do Selo'
);
SET @id_missao_joias = (SELECT id_missao FROM missao WHERE nome_missao = 'Recuperar as Joias do Selo' LIMIT 1);

INSERT INTO item (nome_item, descricao_item, id_missao, id_classe, quantidade_necessaria, caminho_imagem)
SELECT 'Cryptex 1', 'Primeiro cryptex necessário para obter as joias do selo.', @id_missao_joias, @id_classe_guerreiro, 1,
       '/modelos-3d/casa_aberta/recuperar_as_joias_do_selo/cryptex-1.glb'
WHERE NOT EXISTS (SELECT 1 FROM item WHERE nome_item = 'Cryptex 1');

INSERT INTO item (nome_item, descricao_item, id_missao, id_classe, quantidade_necessaria, caminho_imagem)
SELECT 'Cryptex 2', 'Segundo cryptex necessário para obter as joias do selo.', @id_missao_joias, @id_classe_guerreiro, 1,
       '/modelos-3d/casa_aberta/recuperar_as_joias_do_selo/cryptex-2.glb'
WHERE NOT EXISTS (SELECT 1 FROM item WHERE nome_item = 'Cryptex 2');

INSERT INTO item (nome_item, descricao_item, id_missao, id_classe, quantidade_necessaria, caminho_imagem)
SELECT 'Baú do Esqueleto', 'Baú protegido pelo Esqueleto Espectral. Contém parte das joias.', @id_missao_joias, @id_classe_guerreiro, 1,
       '/modelos-3d/casa_aberta/recuperar_as_joias_do_selo/bau-do-esqueleto.glb'
WHERE NOT EXISTS (SELECT 1 FROM item WHERE nome_item = 'Baú do Esqueleto');

INSERT INTO item (nome_item, descricao_item, id_missao, id_classe, quantidade_necessaria, caminho_imagem)
SELECT 'Joias do Selo', 'Conjunto de joias necessárias para romper o selo (coletar 3).', @id_missao_joias, @id_classe_guerreiro, 3,
       '/modelos-3d/casa_aberta/recuperar_as_joias_do_selo/joias-do-selo.glb'
WHERE NOT EXISTS (SELECT 1 FROM item WHERE nome_item = 'Joias do Selo');

-- Missão 2: Encontrar a Espada Selada (guerreiro)
INSERT INTO missao (nome_missao, descricao_missao, id_regiao, id_classe, tipo_missao)
SELECT
  'Encontrar a Espada Selada',
  'Localizar a espada que servirá de chave para abrir a Câmara Selada.',
  @id_regiao_casa_aberta,
  @id_classe_guerreiro,
  'Equipe'
WHERE NOT EXISTS (
  SELECT 1 FROM missao WHERE nome_missao = 'Encontrar a Espada Selada'
);
SET @id_missao_espada = (SELECT id_missao FROM missao WHERE nome_missao = 'Encontrar a Espada Selada' LIMIT 1);

INSERT INTO item (nome_item, descricao_item, id_missao, id_classe, quantidade_necessaria, caminho_imagem)
SELECT 'Explorar masmorra', 'Explorar a masmorra e encontrar pistas para a espada selada.', @id_missao_espada, @id_classe_guerreiro, 1,
       '/modelos-3d/casa_aberta/encontrar_a_espada_selada/explorar-masmorra.glb'
WHERE NOT EXISTS (SELECT 1 FROM item WHERE nome_item = 'Explorar masmorra');

INSERT INTO item (nome_item, descricao_item, id_missao, id_classe, quantidade_necessaria, caminho_imagem)
SELECT 'Encontrar local da espada', 'Encontrar o local exato onde a espada está selada.', @id_missao_espada, @id_classe_guerreiro, 1,
       '/modelos-3d/casa_aberta/encontrar_a_espada_selada/local-da-espada.glb'
WHERE NOT EXISTS (SELECT 1 FROM item WHERE nome_item = 'Encontrar local da espada');

INSERT INTO item (nome_item, descricao_item, id_missao, id_classe, quantidade_necessaria, caminho_imagem)
SELECT 'Superar guardiões', 'Vencer os guardiões que protegem o selo da espada.', @id_missao_espada, @id_classe_guerreiro, 1,
       '/modelos-3d/casa_aberta/encontrar_a_espada_selada/guardioes.glb'
WHERE NOT EXISTS (SELECT 1 FROM item WHERE nome_item = 'Superar guardiões');

INSERT INTO item (nome_item, descricao_item, id_missao, id_classe, quantidade_necessaria, caminho_imagem)
SELECT 'Espada Selada', 'A espada que abre a Câmara Selada.', @id_missao_espada, @id_classe_guerreiro, 1,
       '/modelos-3d/casa_aberta/encontrar_a_espada_selada/espada-selada.glb'
WHERE NOT EXISTS (SELECT 1 FROM item WHERE nome_item = 'Espada Selada');

-- Missão 3: Resolver os Desafios (geral)
INSERT INTO missao (nome_missao, descricao_missao, id_regiao, id_classe, tipo_missao)
SELECT
  'Resolver os Desafios',
  'Abrir os cryptex: Ladino deve pontuar no alvo e Mago resolve alquimia. O baú exige enfrentar um protetor da última joia.',
  @id_regiao_casa_aberta,
  NULL,
  'Equipe'
WHERE NOT EXISTS (
  SELECT 1 FROM missao WHERE nome_missao = 'Resolver os Desafios'
);
SET @id_missao_desafios = (SELECT id_missao FROM missao WHERE nome_missao = 'Resolver os Desafios' LIMIT 1);

INSERT INTO item (nome_item, descricao_item, id_missao, id_classe, quantidade_necessaria, caminho_imagem)
SELECT 'Ladino: pontos no alvo', 'Pontuar no alvo (coletar 10 pontos).', @id_missao_desafios, @id_classe_ladino, 10,
       '/modelos-3d/casa_aberta/resolver_os_desafios/pontos-no-alvo.glb'
WHERE NOT EXISTS (SELECT 1 FROM item WHERE nome_item = 'Ladino: pontos no alvo');

INSERT INTO item (nome_item, descricao_item, id_missao, id_classe, quantidade_necessaria, caminho_imagem)
SELECT 'Mago: desafio de alquimia', 'Resolver o desafio de alquimia para abrir um cryptex.', @id_missao_desafios, @id_classe_mago, 1,
       '/modelos-3d/casa_aberta/resolver_os_desafios/alquimia.glb'
WHERE NOT EXISTS (SELECT 1 FROM item WHERE nome_item = 'Mago: desafio de alquimia');

INSERT INTO item (nome_item, descricao_item, id_missao, id_classe, quantidade_necessaria, caminho_imagem)
SELECT 'Guerreiro: enfrentar protetor', 'Derrotar o protetor para liberar a última joia.', @id_missao_desafios, @id_classe_guerreiro, 1,
       '/modelos-3d/casa_aberta/resolver_os_desafios/protetor.glb'
WHERE NOT EXISTS (SELECT 1 FROM item WHERE nome_item = 'Guerreiro: enfrentar protetor');

INSERT INTO item (nome_item, descricao_item, id_missao, id_classe, quantidade_necessaria, caminho_imagem)
SELECT 'Última joia', 'Última joia obtida após completar o desafio.', @id_missao_desafios, @id_classe_guerreiro, 1,
       '/modelos-3d/casa_aberta/resolver_os_desafios/ultima-joia.glb'
WHERE NOT EXISTS (SELECT 1 FROM item WHERE nome_item = 'Última joia');

-- Missão 4: Recuperar a Bomba Alquímica (mago)
INSERT INTO missao (nome_missao, descricao_missao, id_regiao, id_classe, tipo_missao)
SELECT
  'Recuperar a Bomba Alquímica',
  'Desafio alternativo de alquimia para o Mago (opção extra para atingir o chefe final).',
  @id_regiao_casa_aberta,
  @id_classe_mago,
  'Equipe'
WHERE NOT EXISTS (
  SELECT 1 FROM missao WHERE nome_missao = 'Recuperar a Bomba Alquímica'
);
SET @id_missao_bomba = (SELECT id_missao FROM missao WHERE nome_missao = 'Recuperar a Bomba Alquímica' LIMIT 1);

INSERT INTO item (nome_item, descricao_item, id_missao, id_classe, quantidade_necessaria, caminho_imagem)
SELECT 'Combinar cores: Vermelha', 'Combinar a cor vermelha no desafio de alquimia.', @id_missao_bomba, @id_classe_mago, 1,
       '/modelos-3d/casa_aberta/recuperar_a_bomba_alquimica/cor-vermelha.glb'
WHERE NOT EXISTS (SELECT 1 FROM item WHERE nome_item = 'Combinar cores: Vermelha');

INSERT INTO item (nome_item, descricao_item, id_missao, id_classe, quantidade_necessaria, caminho_imagem)
SELECT 'Combinar cores: Cinza', 'Combinar a cor cinza no desafio de alquimia.', @id_missao_bomba, @id_classe_mago, 1,
       '/modelos-3d/casa_aberta/recuperar_a_bomba_alquimica/cor-cinza.glb'
WHERE NOT EXISTS (SELECT 1 FROM item WHERE nome_item = 'Combinar cores: Cinza');

INSERT INTO item (nome_item, descricao_item, id_missao, id_classe, quantidade_necessaria, caminho_imagem)
SELECT 'Combinar cores: Verde', 'Combinar a cor verde no desafio de alquimia.', @id_missao_bomba, @id_classe_mago, 1,
       '/modelos-3d/casa_aberta/recuperar_a_bomba_alquimica/cor-verde.glb'
WHERE NOT EXISTS (SELECT 1 FROM item WHERE nome_item = 'Combinar cores: Verde');

INSERT INTO item (nome_item, descricao_item, id_missao, id_classe, quantidade_necessaria, caminho_imagem)
SELECT 'Criar Bomba Alquímica', 'Criar a bomba alquímica como resultado final do desafio.', @id_missao_bomba, @id_classe_mago, 1,
       '/modelos-3d/casa_aberta/recuperar_a_bomba_alquimica/bomba-alquimica.glb'
WHERE NOT EXISTS (SELECT 1 FROM item WHERE nome_item = 'Criar Bomba Alquímica');

COMMIT;
