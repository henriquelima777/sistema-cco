# Receitas do Grupo

Esse é um projeto de cadastro de receitas. A página é aberta pelo Live Server e os dados são salvos no MySQL usando uma API feita com Node.js e Express.

## O que precisa ter instalado

- Node.js
- MySQL Server e MySQL Workbench
- Visual Studio Code
- Extensão Live Server no VS Code

## 1. Criar o banco de dados

1. Abra o MySQL Workbench.
2. Abra o arquivo `banco/script.sql`.
3. Execute o script.

Ele cria o banco `receitas_grupo`, as tabelas e coloca algumas receitas para teste.

## 2. Configurar o Node

1. Abra a pasta `node` no terminal do VS Code.
2. Copie o arquivo `.env.exemplo` e deixe a cópia com o nome `.env`.
3. Abra o `.env` e coloque a senha que você usa no MySQL.
4. Rode os comandos:

```bash
npm install
npm run dev
```

Se aparecer `Servidor rodando em http://localhost:3000`, o servidor iniciou.

## 3. Abrir a página

1. Volte para a pasta principal do projeto.
2. Clique com o botão direito no `index.html`.
3. Escolha `Open with Live Server`.

É necessário deixar o terminal do Node aberto enquanto usa o site.

## O que dá para fazer

- Cadastrar uma receita.
- Ver as receitas cadastradas.
- Filtrar por status.
- Mudar o status para rascunho, testada ou favorita.
- Alterar o nome de uma receita.
- Excluir uma receita.

## Pastas e arquivos

- `index.html`: página do sistema.
- `css/receitas.css`: estilo da página.
- `js/script.js`: funções dos botões e do formulário.
- `node/server.js`: servidor e rotas da API.
- `node/banco.js`: conexão com o MySQL.
- `banco/script.sql`: criação das tabelas e dados de exemplo.
- `docs/EXPLICACAO-PARA-APRESENTACAO.md`: explicação dos arquivos.

O projeto usa o usuário de exemplo com ID 1 para relacionar as receitas. Não foi feito sistema de login.
