import mysql from "mysql2/promise";
import "dotenv/config";

// Dados para conectar no MySQL
const banco = mysql.createPool({
    host: process.env.DB_HOST || "localhost",
    user: process.env.DB_USUARIO || "root",
    password: process.env.DB_SENHA || "",
    database: process.env.DB_NOME || "receitas_grupo",
    port: Number(process.env.DB_PORT || 3306)
});

export default banco;
