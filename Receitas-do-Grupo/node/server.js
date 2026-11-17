import express from "express";
import cors from "cors";
import "dotenv/config";
import banco from "./banco.js";

const app = express();
const porta = process.env.PORTA || 3000;
const usuarioId = 1; // usuario de exemplo, sem login por enquanto

app.use(cors());
app.use(express.json());

// Consulta usada para buscar as receitas e os ingredientes
const consultaReceitas = `
    SELECT receitas.id, receitas.nome, receitas.descricao,
           receitas.status, receitas.dificuldade,
           DATE_FORMAT(receitas.data_receita, '%Y-%m-%d') AS dataReceita,
           receitas.modo_preparo AS modoPreparo,
           GROUP_CONCAT(ingredientes.nome SEPARATOR ', ') AS ingredientes
    FROM receitas
    LEFT JOIN receita_ingrediente ON receitas.id = receita_ingrediente.receita_id
    LEFT JOIN ingredientes ON receita_ingrediente.ingrediente_id = ingredientes.id
`;

// Listar todas as receitas
app.get("/api/receitas", async (req, res) => {
    try {
        const [receitas] = await banco.query(
            consultaReceitas + " WHERE receitas.usuario_id = ? GROUP BY receitas.id ORDER BY receitas.id",
            [usuarioId]
        );
        res.json(receitas);
    } catch (erro) {
        console.log(erro);
        res.status(500).json({ erro: "Erro ao buscar as receitas." });
    }
});

// Buscar uma receita pelo id
app.get("/api/receitas/:id", async (req, res) => {
    try {
        const [receitas] = await banco.query(
            consultaReceitas + " WHERE receitas.usuario_id = ? AND receitas.id = ? GROUP BY receitas.id",
            [usuarioId, req.params.id]
        );

        if (receitas.length === 0) {
            return res.status(404).json({ erro: "Receita não encontrada." });
        }

        res.json(receitas[0]);
    } catch (erro) {
        console.log(erro);
        res.status(500).json({ erro: "Erro ao buscar a receita." });
    }
});

// Cadastrar uma receita
app.post("/api/receitas", async (req, res) => {
    const dados = req.body;

    if (!dados.nome || dados.nome.trim().length < 3) {
        return res.status(400).json({ erro: "Digite um nome com pelo menos 3 letras." });
    }

    if (!dados.dataReceita || !dados.modoPreparo || !dados.ingredientes || dados.ingredientes.length === 0) {
        return res.status(400).json({ erro: "Preencha todos os campos obrigatórios." });
    }

    try {
        const [resultado] = await banco.query(
            `INSERT INTO receitas
            (usuario_id, nome, descricao, dificuldade, data_receita, modo_preparo)
            VALUES (?, ?, ?, ?, ?, ?)`,
            [usuarioId, dados.nome.trim(), dados.descricao || "", dados.dificuldade,
             dados.dataReceita, dados.modoPreparo]
        );

        const receitaId = resultado.insertId;

        // Salvar os ingredientes e ligar eles com a receita
        for (let nome of dados.ingredientes) {
            nome = nome.trim();
            if (nome !== "") {
                let [ingredientes] = await banco.query(
                    "SELECT id FROM ingredientes WHERE nome = ?", [nome]
                );

                let ingredienteId;

                if (ingredientes.length > 0) {
                    ingredienteId = ingredientes[0].id;
                } else {
                    const [novoIngrediente] = await banco.query(
                        "INSERT INTO ingredientes (nome) VALUES (?)", [nome]
                    );
                    ingredienteId = novoIngrediente.insertId;
                }

                await banco.query(
                    "INSERT IGNORE INTO receita_ingrediente (receita_id, ingrediente_id) VALUES (?, ?)",
                    [receitaId, ingredienteId]
                );
            }
        }

        res.status(201).json({ mensagem: "Receita cadastrada!", id: receitaId });
    } catch (erro) {
        console.log(erro);
        res.status(500).json({ erro: "Não foi possível cadastrar a receita." });
    }
});

// Alterar o status da receita
app.patch("/api/receitas/:id/status", async (req, res) => {
    const status = req.body.status;
    const statusPermitidos = ["rascunho", "testada", "favorita"];

    if (!statusPermitidos.includes(status)) {
        return res.status(400).json({ erro: "Status inválido." });
    }

    try {
        const [resultado] = await banco.query(
            "UPDATE receitas SET status = ? WHERE id = ? AND usuario_id = ?",
            [status, req.params.id, usuarioId]
        );

        if (resultado.affectedRows === 0) {
            return res.status(404).json({ erro: "Receita não encontrada." });
        }

        res.json({ mensagem: "Status alterado!" });
    } catch (erro) {
        console.log(erro);
        res.status(500).json({ erro: "Erro ao alterar o status." });
    }
});

// Editar o nome da receita
app.put("/api/receitas/:id", async (req, res) => {
    const nome = req.body.nome;

    if (!nome || nome.trim().length < 3) {
        return res.status(400).json({ erro: "O nome precisa ter pelo menos 3 letras." });
    }

    try {
        const [resultado] = await banco.query(
            "UPDATE receitas SET nome = ? WHERE id = ? AND usuario_id = ?",
            [nome.trim(), req.params.id, usuarioId]
        );

        if (resultado.affectedRows === 0) {
            return res.status(404).json({ erro: "Receita não encontrada." });
        }

        res.json({ mensagem: "Nome alterado!" });
    } catch (erro) {
        console.log(erro);
        res.status(500).json({ erro: "Erro ao editar a receita." });
    }
});

// Excluir uma receita
app.delete("/api/receitas/:id", async (req, res) => {
    try {
        const [resultado] = await banco.query(
            "DELETE FROM receitas WHERE id = ? AND usuario_id = ?",
            [req.params.id, usuarioId]
        );

        if (resultado.affectedRows === 0) {
            return res.status(404).json({ erro: "Receita não encontrada." });
        }

        res.json({ mensagem: "Receita excluída!" });
    } catch (erro) {
        console.log(erro);
        res.status(500).json({ erro: "Erro ao excluir a receita." });
    }
});

app.listen(porta, () => {
    console.log(`Servidor rodando em http://localhost:${porta}`);
});
