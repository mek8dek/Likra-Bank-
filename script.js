let jogador = "";
let saldo = 100;
let historico = [];

// função para carregar jogador
function carregarJogador() {
  jogador = localStorage.getItem("jogadorLikra");
  if (!jogador) {
    jogador = prompt("Digite seu nome:");
    if (!jogador) jogador = "Jogador";
    localStorage.setItem("jogadorLikra", jogador);
  }

  // carregar saldo e histórico do jogador
  const saldoSalvo = localStorage.getItem("saldo_" + jogador);
  if (saldoSalvo !== null) saldo = parseInt(saldoSalvo);

  const historicoSalvo = localStorage.getItem("historico_" + jogador);
  if (historicoSalvo !== null) historico = JSON.parse(historicoSalvo);
}

// função para obter data/hora atual
function agora() {
  const d = new Date();
  return d.toLocaleString(); // formato local
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

document.addEventListener("DOMContentLoaded", () => {
  carregarJogador();
  atualizarTudo();
});
