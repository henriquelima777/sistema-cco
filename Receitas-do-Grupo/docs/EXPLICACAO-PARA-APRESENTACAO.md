# Explicação do projeto - Receitas do Grupo

## 1. Para que serve

O projeto é um site simples para guardar receitas. Dá para cadastrar uma receita, ver as que já foram cadastradas, mudar o status, editar o nome e excluir.

## 2. Tecnologias usadas

- HTML para montar a página.
- CSS para deixar a página organizada.
- JavaScript para fazer os botões e o formulário funcionarem.
- Node.js para executar o servidor.
- Express para criar as rotas da API.
- MySQL para guardar as informações.

## 3. Explicação dos arquivos

### index.html

É a parte principal da página. Tem o formulário para colocar os dados e a área onde aparecem as receitas.

### css/receitas.css

É onde ficam as cores, tamanhos, espaços e a organização da página. Também tem algumas regras para funcionar em telas menores.

### js/script.js

É o JavaScript que roda no navegador. Quando a página abre, a função `carregarReceitas()` pede os dados para o servidor. A função `mostrarReceitas()` mostra as receitas na tela.

Também tem funções para cadastrar, mudar o status, editar o nome e excluir. Para conversar com o servidor é usado o `fetch()`.

### node/server.js

É o servidor feito com Node e Express. Nele estão as rotas:

- `GET /api/receitas`: mostra todas as receitas.
- `GET /api/receitas/:id`: procura uma receita pelo ID.
- `POST /api/receitas`: cadastra uma receita.
- `PATCH /api/receitas/:id/status`: muda o status.
- `PUT /api/receitas/:id`: altera o nome.
- `DELETE /api/receitas/:id`: exclui uma receita.

### node/banco.js

Faz a conexão do Node com o MySQL. A senha e o nome do banco ficam no arquivo `.env`.

### banco/script.sql

Cria as tabelas do banco. A tabela `receita_ingrediente` serve para relacionar receitas e ingredientes, porque uma receita pode ter vários ingredientes e um ingrediente pode estar em várias receitas.

## 4. Como as partes funcionam juntas

1. Abro o site pelo Live Server.
2. O JavaScript usa `fetch()` para pedir alguma informação para o endereço do servidor.
3. O Node recebe o pedido e faz a consulta no MySQL.
4. O banco devolve os dados para o Node.
5. O Node responde para o JavaScript e a página mostra o resultado.

## 5. Como demonstrar para o professor

1. Mostrar as receitas que já aparecem na página.
2. Cadastrar uma receita nova.
3. Mostrar que ela apareceu na lista.
4. Mudar o status de uma receita.
5. Editar o nome e depois excluir uma receita.
6. Mostrar no MySQL as tabelas usadas.

## 6. Algumas perguntas que podem aparecer

**O que é uma API?**

É uma parte do sistema que recebe pedidos e devolve informações. Aqui o JavaScript manda os pedidos e o Node responde.

**Para que serve o Express?**

Ele ajuda a criar as rotas do servidor sem precisar fazer tudo do zero.

**Para que serve o banco de dados?**

Para guardar as receitas mesmo depois que a página é fechada.

**Por que tem uma tabela de ligação entre receita e ingrediente?**

Porque uma receita pode ter vários ingredientes e o mesmo ingrediente pode ser usado em outras receitas.

**Por que tem um usuário fixo?**

Foi usado um usuário de exemplo para relacionar as receitas. O sistema não tem login nessa versão.
