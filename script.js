let jogador = "";
let saldo = 100;
let historico = [];

// carregar jogador
function carregarJogador(nome) {
  jogador = nome || localStorage.getItem("jogadorLikra");
  if (!jogador) {
    jogador = prompt("Digite seu nome:");
    if (!jogador) jogador = "Jogador";
    localStorage.setItem("jogadorLikra", jogador);
  }

  // carregar saldo e histórico do jogador
  const saldoSalvo = localStorage.getItem("saldo_" + jogador);
  saldo = saldoSalvo ? parseInt(saldoSalvo) : 100;

  const historicoSalvo = localStorage.getItem("historico_" + jogador);
  historico = historicoSalvo ? JSON.parse(historicoSalvo) : [];
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

  localStorage.setItem("saldo_" + jogador, saldo);
  localStorage.setItem("historico_" + jogador, JSON.stringify(historico));
  localStorage.setItem("jogadorLikra", jogador);
}

// funções básicas
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

// transferir para outro jogador
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

  // subtrai do remetente
  saldo -= valor;
  historico.unshift({ texto: `Transferiu ${valor} Likra K$ para ${destinatario}`, hora: agora() });

  // adiciona ao destinatário
  let saldoDest = localStorage.getItem("saldo_" + destinatario);
  saldoDest = saldoDest ? parseInt(saldoDest) : 0;

  let histDest = localStorage.getItem("historico_" + destinatario);
  histDest = histDest ? JSON.parse(histDest) : [];

  histDest.unshift({ texto: `Recebeu ${valor} Likra K$ de ${jogador}`, hora: agora() });

  localStorage.setItem("saldo_" + destinatario, saldoDest + valor);
  localStorage.setItem("historico_" + destinatario, JSON.stringify(histDest));

  atualizarTudo();
}

// trocar de conta
function trocarConta() {
  const novoNome = prompt("Digite o nome da conta que deseja acessar:");
  if (!novoNome) return;
  carregarJogador(novoNome);
  atualizarTudo();
}

document.addEventListener("DOMContentLoaded", () => {
  carregarJogador();
  atualizarTudo();
});
