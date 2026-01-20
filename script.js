let saldo = 100;
let historico = [];

// carregar dados salvos
if (localStorage.getItem("saldoLikra")) {
  saldo = parseInt(localStorage.getItem("saldoLikra"));
}

if (localStorage.getItem("historicoLikra")) {
  historico = JSON.parse(localStorage.getItem("historicoLikra"));
}

// função para obter data/hora atual
function agora() {
  const d = new Date();
  return d.toLocaleString(); // formato local
}

// atualizar tela + salvar
function atualizarTudo() {
  document.getElementById("saldo").innerText = saldo + " Likra K$";

  const lista = document.getElementById("historico");
  lista.innerHTML = "";

  historico.forEach(item => {
    const li = document.createElement("li");
    li.innerText = `[${item.hora}] ${item.texto}`;
    lista.appendChild(li);
  });

  localStorage.setItem("saldoLikra", saldo);
  localStorage.setItem("historicoLikra", JSON.stringify(historico));
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

document.addEventListener("DOMContentLoaded", atualizarTudo);
