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

document.addEventListener("DOMContentLoaded", () => {
  carregarJogador();
  atualizarTudo();
});
