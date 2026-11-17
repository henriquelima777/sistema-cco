CREATE DATABASE IF NOT EXISTS receitas_grupo
  CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE receitas_grupo;

CREATE TABLE IF NOT EXISTS usuarios (
  id INT AUTO_INCREMENT PRIMARY KEY,
  nome VARCHAR(100) NOT NULL,
  email VARCHAR(150) NOT NULL UNIQUE
);

CREATE TABLE IF NOT EXISTS receitas (
  id INT AUTO_INCREMENT PRIMARY KEY,
  usuario_id INT NOT NULL,
  nome VARCHAR(120) NOT NULL,
  descricao TEXT NULL,
  status ENUM('rascunho', 'testada', 'favorita') NOT NULL DEFAULT 'rascunho',
  dificuldade ENUM('facil', 'media', 'dificil') NOT NULL DEFAULT 'facil',
  data_receita DATE NOT NULL,
  modo_preparo TEXT NOT NULL,
  criada_em TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT fk_receitas_usuario FOREIGN KEY (usuario_id) REFERENCES usuarios(id),
  CONSTRAINT chk_nome_receita CHECK (CHAR_LENGTH(TRIM(nome)) >= 3)
);

CREATE TABLE IF NOT EXISTS ingredientes (
  id INT AUTO_INCREMENT PRIMARY KEY,
  nome VARCHAR(120) NOT NULL UNIQUE
);

-- Relação N:N: uma receita possui vários ingredientes e um ingrediente
-- pode aparecer em várias receitas.
CREATE TABLE IF NOT EXISTS receita_ingrediente (
  receita_id INT NOT NULL,
  ingrediente_id INT NOT NULL,
  PRIMARY KEY (receita_id, ingrediente_id),
  CONSTRAINT fk_ri_receita FOREIGN KEY (receita_id) REFERENCES receitas(id) ON DELETE CASCADE,
  CONSTRAINT fk_ri_ingrediente FOREIGN KEY (ingrediente_id) REFERENCES ingredientes(id)
);

INSERT IGNORE INTO usuarios (id, nome, email)
VALUES (1, 'Usuário do grupo', 'grupo@receitas.local');

-- Os seis registros de exemplo solicitados na Aula 1.
INSERT INTO receitas (id, usuario_id, nome, descricao, status, dificuldade, data_receita, modo_preparo) VALUES
(1,1,'Bolo de cenoura','Bolo fofinho com cobertura de chocolate.','favorita','facil','2026-10-01','Bata os ingredientes líquidos com a cenoura, misture os secos e asse.'),
(2,1,'Panqueca simples','Massa básica para o dia a dia.','testada','facil','2026-10-03','Bata tudo e doure porções em uma frigideira.'),
(3,1,'Lasanha de legumes','Opção com molho caseiro.','rascunho','media','2026-10-05','Monte camadas e leve ao forno até gratinar.'),
(4,1,'Pão de queijo','Receita tradicional para o café.','testada','media','2026-10-08','Escalde o polvilho, misture os demais ingredientes, modele e asse.'),
(5,1,'Salada tropical','Leve e refrescante.','favorita','facil','2026-10-10','Higienize, corte e misture os ingredientes.'),
(6,1,'Risoto de cogumelos','Preparação cremosa para ocasiões especiais.','rascunho','dificil','2026-10-12','Refogue a cebola, acrescente o arroz e o caldo aos poucos; finalize com cogumelos e parmesão.')
ON DUPLICATE KEY UPDATE nome = VALUES(nome), descricao = VALUES(descricao), status = VALUES(status), dificuldade = VALUES(dificuldade), data_receita = VALUES(data_receita), modo_preparo = VALUES(modo_preparo);

INSERT IGNORE INTO ingredientes (nome) VALUES
('cenoura'),('ovos'),('óleo'),('farinha'),('açúcar'),('chocolate'),
('leite'),('ovo'),('sal'),('abobrinha'),('berinjela'),('molho'),('queijo'),('massa'),
('polvilho'),('alface'),('manga'),('tomate'),('limão'),('arroz arbóreo'),('cogumelos'),('caldo'),('cebola'),('parmesão');

INSERT IGNORE INTO receita_ingrediente (receita_id, ingrediente_id)
SELECT 1,id FROM ingredientes WHERE nome IN ('cenoura','ovos','óleo','farinha','açúcar','chocolate');
INSERT IGNORE INTO receita_ingrediente (receita_id, ingrediente_id)
SELECT 2,id FROM ingredientes WHERE nome IN ('leite','ovo','farinha','sal');
INSERT IGNORE INTO receita_ingrediente (receita_id, ingrediente_id)
SELECT 3,id FROM ingredientes WHERE nome IN ('abobrinha','berinjela','molho','queijo','massa');
INSERT IGNORE INTO receita_ingrediente (receita_id, ingrediente_id)
SELECT 4,id FROM ingredientes WHERE nome IN ('polvilho','queijo','leite','ovo','óleo');
INSERT IGNORE INTO receita_ingrediente (receita_id, ingrediente_id)
SELECT 5,id FROM ingredientes WHERE nome IN ('alface','manga','tomate','limão');
INSERT IGNORE INTO receita_ingrediente (receita_id, ingrediente_id)
SELECT 6,id FROM ingredientes WHERE nome IN ('arroz arbóreo','cogumelos','caldo','cebola','parmesão');

-- Testes opcionais das restrições (execute um por vez; devem falhar):
-- UPDATE receitas SET status = 'publicada' WHERE id = 1; -- valor fora do ENUM
-- UPDATE receitas SET nome = 'ab' WHERE id = 1; -- regra CHECK
-- INSERT INTO receitas (usuario_id,nome,dificuldade,data_receita,modo_preparo)
-- VALUES (999,'Receita inválida','facil',CURRENT_DATE,'Teste'); -- chave estrangeira
