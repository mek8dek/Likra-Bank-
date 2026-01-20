let saldo = 100;

// carregar saldo salvo
if (localStorage.getItem("saldoLikra") !== null) {
  saldo = parseInt(localStorage.getItem("saldoLikra"));
}

// atualizar tela + salvar
function atualizarSaldo() {
  document.getElementById("saldo").innerText = saldo + " Likra K$";
  localStorage.setItem("saldoLikra", saldo);
}

function ganhar() {
  saldo += 10;
  atualizarSaldo();
}

function gastar() {
  if (saldo >= 5) {
    saldo -= 5;
    atualizarSaldo();
  } else {
    alert("Saldo insuficiente");
  }
}

// garante que a tela carregue com o valor salvo
document.addEventListener("DOMContentLoaded", atualizarSaldo);
