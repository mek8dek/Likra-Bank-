<!DOCTYPE html>
<html lang="pt-BR">
<head>
  <meta charset="UTF-8">
  <title>Banco & Bolsa Likra</title>
  <link rel="stylesheet" href="style.css">
  <link rel="manifest" href="manifest.json">
  <meta name="theme-color" content="#0d1117">
</head>
<body>

<div class="container">
  <!-- BANCO -->
  <div class="app">
    <p>Bem-vindo, <strong id="nomeJogador"></strong>!</p>

    <div class="card">
      <p>Saldo Likra</p>
      <p class="saldo" id="saldo">100 Likra K$</p>
    </div>

    <button onclick="ganhar()">Ganhar 10 Likra K$</button>
    <button onclick="gastar()">Gastar 5 Likra K$</button>
    <button onclick="transferir()">Transferir Likra</button>

    <h3>Trocar de Conta</h3>
    <div id="listaJogadores"></div>

    <h3>Histórico</h3>
    <ul id="historico"></ul>

    <!-- FUNDO DE EMPRÉSTIMOS -->
    <div class="card">
      <h3>Fundo de Empréstimos</h3>
      <p id="fundoEmprestimo">74.000.000 Likra K$</p>
      <button onclick="pegarEmprestimo()">Pegar Empréstimo</button>
      <button onclick="pagarEmprestimo()">Pagar Empréstimo</button>
    </div>
  </div>

  <!-- BOLSA -->
  <div class="card bolsa">
    <h3>Bolsa de Moedas</h3>

    <p id="valorLikra">Likra K$: R$ 3.44 (0%)</p>
    <p>Saldo Likra: <span id="saldoLikraBolsa">0</span> | Valor total: R$ <span id="totalLikra">0</span> | <span id="lucroLikra" class="ganho">0</span></p>

    <p id="valorSAD">SAD$: R$ 2.34 (0%)</p>
    <p>Saldo SAD$: <span id="saldoSADBolsa">0</span> | Valor total: R$ <span id="totalSAD">0</span> | <span id="lucroSAD" class="ganho">0</span></p>

    <p id="valorDAF">DAF¥: R$ 7.89 (0%)</p>
    <p>Saldo DAF¥: <span id="saldoDAFBolsa">0</span> | Valor total: R$ <span id="totalDAF">0</span> | <span id="lucroDAF" class="ganho">0</span></p>

    <p id="saldoReais">R$ 1000.00</p>

    <button onclick="comprarMoeda('Likra')">Comprar Likra</button>
    <button onclick="venderMoeda('Likra')">Vender Likra</button>

    <button onclick="comprarMoeda('SAD')">Comprar SAD$</button>
    <button onclick="venderMoeda('SAD')">Vender SAD$</button>

    <button onclick="comprarMoeda('DAF')">Comprar DAF¥</button>
    <button onclick="venderMoeda('DAF')">Vender DAF¥</button>
  </div>
</div>

<script src="script.js?ver=20"></script>
<script>
  if ("serviceWorker" in navigator) {
    navigator.serviceWorker.register("service-worker.js").then(()=>{
      console.log("Service Worker registrado com sucesso!");
    });
  }
</script>
</body>
</html>
