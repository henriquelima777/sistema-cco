// Endereço da API feita com Node.js e Express
const API = "http://localhost:3000/api";
let receitas = [];

const form = document.getElementById("form-receita");
const lista = document.getElementById("lista-receitas");
const filtro = document.getElementById("filtro-status");
const mensagem = document.getElementById("mensagem-form");

document.getElementById("data-atual").textContent = new Date().toLocaleDateString("pt-BR", { dateStyle: "long" });
document.getElementById("dataReceita").value = new Date().toISOString().slice(0, 10);

async function carregarReceitas() {
  try {
    const resposta = await fetch(`${API}/receitas`);
    if (!resposta.ok) throw new Error("Não foi possível buscar as receitas.");
    receitas = await resposta.json();
    mostrarReceitas();
    atualizarPainel();
  } catch (erro) {
    lista.innerHTML = '<p class="vazio">Não foi possível conectar. Confira se o Node.js e o MySQL estão ligados.</p>';
    console.error(erro);
  }
}

function atualizarPainel() {
  document.getElementById("total").textContent = receitas.length;
  document.getElementById("rascunhos").textContent = receitas.filter(r => r.status === "rascunho").length;
  document.getElementById("testadas").textContent = receitas.filter(r => r.status === "testada").length;
  document.getElementById("favoritas").textContent = receitas.filter(r => r.status === "favorita").length;
}

function mostrarReceitas() {
  const status = filtro.value;
  const resultado = status === "todas" ? receitas : receitas.filter(r => r.status === status);
  if (resultado.length === 0) {
    lista.innerHTML = '<p class="vazio">Nenhuma receita encontrada.</p>';
    return;
  }

  lista.innerHTML = resultado.map(receita => `
    <article class="receita">
      <div class="receita-topo"><div><h3>${escapar(receita.nome)}</h3><p>${escapar(receita.descricao || "Sem descrição")}</p></div></div>
      <div class="etiquetas">
        <span class="etiqueta status-${receita.status}">${nomeStatus(receita.status)}</span>
        <span class="etiqueta">${nomeDificuldade(receita.dificuldade)}</span>
        <span class="etiqueta">${formatarData(receita.dataReceita)}</span>
      </div>
      <p><strong>Ingredientes:</strong> ${escapar(receita.ingredientes || "Não informado")}</p>
      <details><summary>Ver modo de preparo</summary><p>${escapar(receita.modoPreparo)}</p></details>
      <div class="acoes">
        <button onclick="mudarStatus(${receita.id}, 'rascunho')">Rascunho</button>
        <button onclick="mudarStatus(${receita.id}, 'testada')">Testada</button>
        <button onclick="mudarStatus(${receita.id}, 'favorita')">Favorita</button>
        <button onclick="editarReceita(${receita.id})">Editar nome</button>
        <button class="excluir" onclick="excluirReceita(${receita.id})">Excluir</button>
      </div>
    </article>
  `).join("");
}

function escapar(texto) {
  return String(texto ?? "").replace(/[&<>"']/g, caractere => ({"&":"&amp;", "<":"&lt;", ">":"&gt;", '"':"&quot;", "'":"&#039;"}[caractere]));
}
function nomeStatus(status) { return ({rascunho:"Rascunho", testada:"Testada", favorita:"Favorita"})[status] || status; }
function nomeDificuldade(valor) { return ({facil:"Fácil", media:"Média", dificil:"Difícil"})[valor] || valor; }
function formatarData(data) { return data ? new Date(data + "T00:00:00").toLocaleDateString("pt-BR") : ""; }

form.addEventListener("submit", async evento => {
  evento.preventDefault();
  const dados = {
    nome: document.getElementById("nome").value.trim(),
    descricao: document.getElementById("descricao").value.trim(),
    dificuldade: document.getElementById("dificuldade").value,
    dataReceita: document.getElementById("dataReceita").value,
    ingredientes: document.getElementById("ingredientes").value.split(",").map(i => i.trim()).filter(Boolean),
    modoPreparo: document.getElementById("modoPreparo").value.trim()
  };
  if (dados.nome.length < 3) { mostrarMensagem("O nome precisa ter pelo menos 3 caracteres.", true); return; }
  try {
    const resposta = await fetch(`${API}/receitas`, { method:"POST", headers:{"Content-Type":"application/json"}, body:JSON.stringify(dados) });
    const retorno = await resposta.json();
    if (!resposta.ok) throw new Error(retorno.erro || "Erro ao salvar receita.");
    form.reset();
    document.getElementById("dataReceita").value = new Date().toISOString().slice(0, 10);
    mostrarMensagem("Receita salva com sucesso!");
    await carregarReceitas();
  } catch (erro) { mostrarMensagem(erro.message, true); }
});

async function mudarStatus(id, status) {
  try {
    const resposta = await fetch(`${API}/receitas/${id}/status`, { method:"PATCH", headers:{"Content-Type":"application/json"}, body:JSON.stringify({status}) });
    if (!resposta.ok) { const retorno = await resposta.json(); throw new Error(retorno.erro || "Erro ao atualizar status."); }
    await carregarReceitas();
  } catch (erro) { alert(erro.message); }
}

async function excluirReceita(id) {
  if (!confirm("Tem certeza que deseja excluir esta receita?")) return;
  try {
    const resposta = await fetch(`${API}/receitas/${id}`, {method:"DELETE"});
    if (!resposta.ok) { const retorno = await resposta.json(); throw new Error(retorno.erro || "Erro ao excluir."); }
    await carregarReceitas();
  } catch (erro) { alert(erro.message); }
}

async function editarReceita(id) {
  const receita = receitas.find(r => r.id === id);
  const novoNome = prompt("Digite o novo nome da receita:", receita.nome);
  if (novoNome === null) return;
  if (novoNome.trim().length < 3) { alert("O nome precisa ter pelo menos 3 caracteres."); return; }
  try {
    const resposta = await fetch(`${API}/receitas/${id}`, {method:"PUT", headers:{"Content-Type":"application/json"}, body:JSON.stringify({nome:novoNome.trim()})});
    const retorno = await resposta.json();
    if (!resposta.ok) throw new Error(retorno.erro || "Erro ao editar.");
    await carregarReceitas();
  } catch (erro) { alert(erro.message); }
}

function mostrarMensagem(texto, erro = false) {
  mensagem.textContent = texto;
  mensagem.className = erro ? "mensagem erro" : "mensagem";
}
filtro.addEventListener("change", mostrarReceitas);
carregarReceitas();
