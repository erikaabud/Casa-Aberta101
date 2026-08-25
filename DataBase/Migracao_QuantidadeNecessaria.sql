-- Migração: adiciona suporte a "quantidade necessária" por item (ex: Joias do Selo = 3, Pontos no alvo = 10)
-- Execute no banco `rpg` depois de aplicar o `EstruturaDoDb`, caso sua tabela `item` ainda não tenha a coluna.

ALTER TABLE item
  ADD COLUMN IF NOT EXISTS quantidade_necessaria INT NOT NULL DEFAULT 1 AFTER id_classe;

