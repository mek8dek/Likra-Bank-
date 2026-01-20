let saldo = 100;

function atualizarSaldo() {
  document.getElementById("saldo").innerText = saldo + " Likra K$";
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
