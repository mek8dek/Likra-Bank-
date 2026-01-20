// -----------------------
// BANCO E JOGADORES
// -----------------------
let jogador = "";
let saldoLikra = 100;
let historico = [];
let saldoReais = 1000;

// lista de jogadores
function carregarJogador(nome) {
  jogador = nome || localStorage.getItem("jogadorLikra");
  if (!jogador) {
    jogador = prompt("Digite seu nome:");
    if (!jogador) jogador = "Jogador";
  }
  localStorage.setItem("jogadorLikra", jogador);

  // adicionar jogador na lista global
  let listaJogadores = JSON.parse(localStorage.getItem("listaJogadores")) || [];
  if (!listaJogadores.includes(jogador)) listaJogadores.push(jogador);
  localStorage.setItem("listaJogadores", JSON.stringify(listaJogadores));

  // carregar saldo e histórico
  saldoLikra = parseFloat(localStorage.getItem("saldo_" + jogador)) || 100;
  historico = JSON.parse(localStorage.getItem("historico_" + jogador)) || [];
  saldoReais = parseFloat(localStorage.getItem("saldoReais_" + jogador)) || 1000;
}

// data/hora atual
function agora() {
  const d = new Date();
  return d.toLocaleString();
}

// atualizar tudo
function atualizarTudo() {
  document.getElementById("saldo").innerText = saldoLikra.toFixed(2) + " Likra K$";
  document.getElementById("nomeJogador").innerText = jogador;
  document.getElementById("saldoReais").innerText = `R$ ${saldoReais.toFixed(2)}`;

  const lista = document.getElementById("historico");
  lista.innerHTML = "";
  historico.forEach(item => {
    const li = document.createElement("li");
    li.innerText = `[${item.hora}] ${item.texto}`;
    lista.appendChild(li);
  });

  // salvar dados
  localStorage.setItem("saldo_" + jogador, saldoLikra);
  localStorage.setItem("historico_" + jogador, JSON.stringify(historico));
  localStorage.setItem("saldoReais_" + jogador, saldoReais);

  atualizarListaJogadores();
}

// funções básicas do banco
function ganhar() {
  saldoLikra += 10;
  historico.unshift({ texto: "Ganhou 10 Likra K$", hora: agora() });
  atualizarTudo();
}

function gastar() {
  if (saldoLikra >= 5) {
    saldoLikra -= 5;
    historico.unshift({ texto: "Gastou 5 Likra K$", hora: agora() });
    atualizarTudo();
  } else {
    alert("Saldo insuficiente");
  }
}

// transferir Likra
function transferir() {
  const destinatario = prompt("Digite o nome do jogador que vai receber:");
  if (!destinatario) return;

  const valorStr = prompt("Quanto deseja transferir?");
  const valor = parseFloat(valorStr);
  if (isNaN(valor) || valor <= 0) { alert("Valor inválido"); return; }
  if (valor > saldoLikra) { alert("Saldo insuficiente"); return; }

  saldoLikra -= valor;
  historico.unshift({ texto: `Transferiu ${valor.toFixed(2)} Likra para ${destinatario}`, hora: agora() });

  // atualizar destinatário
  let saldoDest = parseFloat(localStorage.getItem("saldo_" + destinatario)) || 0;
  let histDest = JSON.parse(localStorage.getItem("historico_" + destinatario)) || [];
  histDest.unshift({ texto: `Recebeu ${valor.toFixed(2)} Likra de ${jogador}`, hora: agora() });

  localStorage.setItem("saldo_" + destinatario, saldoDest + valor);
  localStorage.setItem("historico_" + destinatario, JSON.stringify(histDest));

  atualizarTudo();
}

// lista de jogadores
function atualizarListaJogadores() {
  const divLista = document.getElementById("listaJogadores");
  divLista.innerHTML = "";

  const lista = JSON.parse(localStorage.getItem("listaJogadores")) || [];
  lista.forEach(nome => {
    const btn = document.createElement("button");
    btn.innerText = nome;
    btn.className = "trocar";
    btn.onclick = () => {
      carregarJogador(nome);
      atualizarTudo();
    };
    divLista.appendChild(btn);
  });
}

// -----------------------
// BOLSA DE MOEDAS
// -----------------------
let valorLikra = 3.44;
let valorSAD = 2.34;
let valorDAF = 7.89;
const taxa = 0.025; // 2,5%

// oscilar moedas
function oscilarMoeda() {
  function oscilar(valor) {
    const variacao = (Math.random() * 0.1) - 0.05;
    return parseFloat((valor * (1 + variacao)).toFixed(2));
  }

  valorLikra = oscilar(valorLikra);
  valorSAD = oscilar(valorSAD);
  valorDAF = oscilar(valorDAF);

  atualizarBolsa();
}

// atualizar bolsa na tela
function atualizarBolsa() {
  document.getElementById("valorLikra").innerText = `Likra K$: R$ ${valorLikra.toFixed(2)}`;
  document.getElementById("valorSAD").innerText = `SAD$: R$ ${valorSAD.toFixed(2)}`;
  document.getElementById("valorDAF").innerText = `DAF¥: R$ ${valorDAF.toFixed(2)}`;
}

// comprar moeda
function comprarMoeda(tipo) {
  const valorStr = prompt(`Quanto em R$ deseja gastar para comprar ${tipo}?`);
  const valor = parseFloat(valorStr);
  if (isNaN(valor) || valor <= 0) { alert("Valor inválido"); return; }
  if (valor > saldoReais) { alert("Saldo insuficiente"); return; }

  const taxaOper = valor * taxa;
  const valorLiquido = valor - taxaOper;
  let quantidade = 0;

  if (tipo === "Likra") { quantidade = valorLiquido / valorLikra; saldoLikra += quantidade; }
  else if (tipo === "SAD") { quantidade = valorLiquido / valorSAD; saldoSAD += quantidade; }
  else if (tipo === "DAF") { quantidade = valorLiquido / valorDAF; saldoDAF += quantidade; }

  saldoReais -= valor;
  alert(`Comprou ${quantidade.toFixed(2)} ${tipo} (taxa R$ ${taxaOper.toFixed(2)})`);
  atualizarTudo();
  atualizarBolsa();
  atualizarReais();
}

// vender moeda
function venderMoeda(tipo) {
  const qtdStr = prompt(`Quantas ${tipo} deseja vender?`);
  const qtd = parseFloat(qtdStr);
  if (isNaN(qtd) || qtd <= 0) { alert("Quantidade inválida"); return; }

  let saldoMoeda = 0;
  let valorAtual = 0;
  if (tipo === "Likra") { saldoMoeda = saldoLikra; valorAtual = valorLikra; }
  else if (tipo === "SAD") { saldoMoeda = saldoSAD; valorAtual = valorSAD; }
  else if (tipo === "DAF") { saldoMoeda = saldoDAF; valorAtual = valorDAF; }

  if (qtd > saldoMoeda) { alert("Saldo insuficiente da moeda"); return; }

  const valorBruto = qtd * valorAtual;
  const taxaOper = valorBruto * taxa;
  const valorLiquido = valorBruto - taxaOper;

  if (tipo === "Likra") saldoLikra -= qtd;
  else if (tipo === "SAD") saldoSAD -= qtd;
  else if (tipo === "DAF") saldoDAF -= qtd;

  saldoReais += valorLiquido;
  alert(`Vendeu ${qtd.toFixed(2)} ${tipo} por R$ ${valorLiquido.toFixed(2)} (taxa R$ ${taxaOper.toFixed(2)})`);

  atualizarTudo();
  atualizarBolsa();
  atualizarReais();
}

// -----------------------
// INICIALIZAÇÃO
// -----------------------
document.addEventListener("DOMContentLoaded", () => {
  carregarJogador();
  atualizarTudo();
  atualizarBolsa();
  atualizarReais();
  setInterval(oscilarMoeda, 5000);
});
