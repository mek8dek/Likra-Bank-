let saldo = localStorage.getItem("saldoLikra");

if (saldo === null) {
  saldo = 100;
} else {
  saldo = parseInt(saldo);
}

function atualizarSaldo() {
  document.getElementById("saldo").innerText = saldo + " Likra K$";
  localStorage.setItem("saldoLikra", saldo);
}

function ganhar() {
  saldo = saldo + 10;
  atualizarSaldo();
}

function gastar() {
  if (saldo >= 5) {
    saldo = saldo - 5;
    atualizarSaldo();
  } else {
    alert("Saldo insuficiente");
  }
}

window.onload = atualizarSaldo;
