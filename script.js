  let jogador = "";
let saldo = 100;
let historico = [];

// carregar jogador
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
  saldo = parseInt(localStorage.getItem("saldo_" + jogador)) || 100;
  historico = JSON.parse(localStorage.getItem("historico_" + jogador)) || [];
}

// data/hora atual
function agora() {
  const d = new Date();
  return d.toLocaleString();
}

// atualizar tela + salvar dados
function atualizarTudo() {
  document.getElementById("saldo").innerText = saldo + " Likra K$";
  document.getElementById("nomeJogador").innerText = jogador;

  const lista = document.getElementById("historico");
  lista.innerHTML = "";
  historico.forEach(item => {
    const li = document.createElement("li");
    li.innerText = `[${item.hora}] ${item.texto}`;
    lista.appendChild(li);
  });

  // salvar dados do jogador
  localStorage.setItem("saldo_" + jogador, saldo);
  localStorage.setItem("historico_" + jogador, JSON.stringify(historico));

  // atualizar lista de jogadores na tela
  atualizarListaJogadores();
}

function ganhar() {
  saldo += 10;
  historico.unshift({ texto: "Ganhou 10 Likra K$", hora: agora() });
  atualizarTudo();
}

function gastar() {
  if (saldo >= 5) {
    saldo -= 5;
    historico.unshift({ texto: "Gastou 5 Likra K$", hora: agora() });
    atualizarTudo();
  } else {
    alert("Saldo insuficiente");
  }
}

function transferir() {
  const destinatario = prompt("Digite o nome do jogador que vai receber:");
  if (!destinatario) return;

  const valorStr = prompt("Quanto deseja transferir?");
  const valor = parseInt(valorStr);
  if (isNaN(valor) || valor <= 0) {
    alert("Valor inválido");
    return;
  }

  if (saldo < valor) {
    alert("Saldo insuficiente para transferir");
    return;
  }

  saldo -= valor;
  historico.unshift({ texto: `Transferiu ${valor} Likra K$ para ${destinatario}`, hora: agora() });

  let saldoDest = parseInt(localStorage.getItem("saldo_" + destinatario)) || 0;
  let histDest = JSON.parse(localStorage.getItem("historico_" + destinatario)) || [];

  histDest.unshift({ texto: `Recebeu ${valor} Likra K$ de ${jogador}`, hora: agora() });

  localStorage.setItem("saldo_" + destinatario, saldoDest + valor);
  localStorage.setItem("historico_" + destinatario, JSON.stringify(histDest));

  atualizarTudo();
}

// atualizar lista de jogadores na tela
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
// valor base da moeda em R$
let valorLikra = 3.44; 

// função para simular variação (±5%)
function oscilarMoeda() {
  const variacao = (Math.random() * 0.1) - 0.05; // -5% a +5%
  valorLikra = parseFloat((valorLikra * (1 + variacao)).toFixed(2));

  document.getElementById("valorLikra").innerText = `Valor da Likra: R$ ${valorLikra}`;
}

// oscilar a cada 5 segundos
setInterval(oscilarMoeda, 5000);
// saldo em reais (ou unidade fictícia)
let saldoReais = 1000; // cada jogador pode ter R$ para comprar Likra

// mostrar saldo em reais
function atualizarReais() {
  document.getElementById("saldoReais").innerText = `R$ ${saldoReais.toFixed(2)}`;
}

// comprar Likra
function comprarLikra() {
  const valorCompraStr = prompt("Quantos R$ deseja gastar para comprar Likra?");
  const valorCompra = parseFloat(valorCompraStr);
  if (isNaN(valorCompra) || valorCompra <= 0) {
    alert("Valor inválido");
    return;
  }
  if (valorCompra > saldoReais) {
    alert("Saldo insuficiente em R$");
    return;
  }

  const quantidadeLikra = valorCompra / valorLikra;
  saldo += quantidadeLikra;
  saldoReais -= valorCompra;

  historico.unshift({ texto: `Comprou ${quantidadeLikra.toFixed(2)} Likra por R$ ${valorCompra}`, hora: agora() });
  atualizarTudo();
  atualizarReais();
}

// vender Likra
function venderLikra() {
  const quantidadeStr = prompt("Quantas Likra deseja vender?");
  const quantidade = parseFloat(quantidadeStr);
  if (isNaN(quantidade) || quantidade <= 0) {
    alert("Quantidade inválida");
    return;
  }
  if (quantidade > saldo) {
    alert("Saldo de Likra insuficiente");
    return;
  }

  const valorVenda = quantidade * valorLikra;
  saldo -= quantidade;
  saldoReais += valorVenda;

  historico.unshift({ texto: `Vendeu ${quantidade.toFixed(2)} Likra por R$ ${valorVenda.toFixed(2)}`, hora: agora() });
  atualizarTudo();
  atualizarReais();
}
document.addEventListener("DOMContentLoaded", () => {
  carregarJogador();
  atualizarTudo();
});
