// -----------------------
// BANCO E JOGADORES
// -----------------------
let jogador = "";
let saldoLikra = 100;
let saldoReais = 1000;
let saldoSAD = 0;
let saldoDAF = 0;
let historico = [];

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
  saldoReais = parseFloat(localStorage.getItem("saldoReais_" + jogador)) || 1000;
  saldoSAD = parseFloat(localStorage.getItem("saldoSAD_" + jogador)) || 0;
  saldoDAF = parseFloat(localStorage.getItem("saldoDAF_" + jogador)) || 0;
  historico = JSON.parse(localStorage.getItem("historico_" + jogador)) || [];
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
  localStorage.setItem("saldoReais_" + jogador, saldoReais);
  localStorage.setItem("saldoSAD_" + jogador, saldoSAD);
  localStorage.setItem("saldoDAF_" + jogador, saldoDAF);
  localStorage.setItem("historico_" + jogador, JSON.stringify(historico));

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
let valorLikraBolsa = 3.44;
let valorSAD = 2.34;
let valorDAF = 7.89;

// armazenar valor anterior para calcular % variação
let prevLikra = valorLikraBolsa;
let prevSAD = valorSAD;
let prevDAF = valorDAF;

const taxa = 0.025; // 2,5%

// função para oscilar moedas (±5%) e calcular variação %
function oscilarMoeda() {
  function oscilar(valor) {
    const variacao = (Math.random() * 0.1) - 0.05; // -5% a +5%
    return parseFloat((valor * (1 + variacao)).toFixed(2));
  }

  // calcular novas oscilações
  const novoLikra = oscilar(valorLikraBolsa);
  const novoSAD = oscilar(valorSAD);
  const novoDAF = oscilar(valorDAF);

  // calcular porcentagem de variação
  const percLikra = ((novoLikra - prevLikra) / prevLikra * 100).toFixed(2);
  const percSAD = ((novoSAD - prevSAD) / prevSAD * 100).toFixed(2);
  const percDAF = ((novoDAF - prevDAF) / prevDAF * 100).toFixed(2);

  // atualizar cores: verde = alta, vermelho = queda
  document.getElementById("valorLikra").innerHTML = `Likra K$: R$ ${novoLikra} <span style="color:${percLikra>=0?'green':'red'}">(${percLikra>=0?'+':''}${percLikra}%)</span>`;
  document.getElementById("valorSAD").innerHTML = `SAD$: R$ ${novoSAD} <span style="color:${percSAD>=0?'green':'red'}">(${percSAD>=0?'+':''}${percSAD}%)</span>`;
  document.getElementById("valorDAF").innerHTML = `DAF¥: R$ ${novoDAF} <span style="color:${percDAF>=0?'green':'red'}">(${percDAF>=0?'+':''}${percDAF}%)</span>`;

  // salvar valores para próxima variação
  prevLikra = valorLikraBolsa;
  prevSAD = valorSAD;
  prevDAF = valorDAF;

  valorLikraBolsa = novoLikra;
  valorSAD = novoSAD;
  valorDAF = novoDAF;
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

  if (tipo === "Likra") { quantidade = valorLiquido / valorLikraBolsa; saldoLikra += quantidade; }
  else if (tipo === "SAD") { quantidade = valorLiquido / valorSAD; saldoSAD += quantidade; }
  else if (tipo === "DAF") { quantidade = valorLiquido / valorDAF; saldoDAF += quantidade; }

  saldoReais -= valor;
  alert(`Comprou ${quantidade.toFixed(2)} ${tipo} (taxa R$ ${taxaOper.toFixed(2)})`);
  atualizarTudo();
}

// vender moeda
function venderMoeda(tipo) {
  const qtdStr = prompt(`Quantas ${tipo} deseja vender?`);
  const qtd = parseFloat(qtdStr);
  if (isNaN(qtd) || qtd <= 0) { alert("Quantidade inválida"); return; }

  let saldoMoeda = 0;
  let valorAtual = 0;
  if (tipo === "Likra") { saldoMoeda = saldoLikra; valorAtual = valorLikraBolsa; }
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
}

// -----------------------
// INICIALIZAÇÃO
// -----------------------
document.addEventListener("DOMContentLoaded", () => {
  carregarJogador();
  atualizarTudo();
  oscilarMoeda(); // primeira atualização
  setInterval(oscilarMoeda, 5000); // oscila a cada 5s
});
