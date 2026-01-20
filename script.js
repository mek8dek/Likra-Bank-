let saldo = 100;
let historico = [];

// carregar dados salvos
if (localStorage.getItem("saldoLikra")) {
  saldo = parseInt(localStorage.getItem("saldoLikra"));
}

if (localStorage.getItem("historicoLikra")) {
  historico = JSON.parse(localStorage.getItem("historicoLikra"));
}

// atualizar tela + salvar
function atualizarTudo() {
  document.getElementById("saldo").innerText = saldo + " Likra K$";

  const lista = document.getElementById("historico");
  lista.innerHTML = "";

  historico.forEach(item => {
    const li = document.createElement("li");
    li.innerText = item;
    lista.appendChild(li);
  });

  localStorage.setItem("saldoLikra", saldo);
  localStorage.setItem("historicoLikra", JSON.stringify(historico));
}

function ganhar() {
  saldo += 10;
  historico.unshift("➕ Ganhou 10 Likra K$");
  atualizarTudo();
}

function gastar() {
  if (saldo >= 5) {
    saldo -= 5;
    historico.unshift("➖ Gastou 5 Likra K$");
    atualizarTudo();
  } else {
    alert("Saldo insuficiente");
  }
}

document.addEventListener("DOMContentLoaded", atualizarTudo);
