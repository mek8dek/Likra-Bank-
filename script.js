// -----------------------------
// JOGADOR E SALDOS
// -----------------------------
let jogador = localStorage.getItem("jogadorAtual") || "Teste";
let saldoLikra = parseFloat(localStorage.getItem("saldo_" + jogador)) || 100;
let fundoEmprestimo = parseFloat(localStorage.getItem("fundoEmprestimo")) || 74000000;

// Fundo Soberano
let fundoSoberano = parseFloat(localStorage.getItem("fundoSoberano")) || 3600000000;

// Histórico de transações
let historico = JSON.parse(localStorage.getItem("historico_" + jogador)) || [];

// Lista de jogadores
let jogadores = JSON.parse(localStorage.getItem("jogadores")) || [jogador];

// Juros e taxa padrão para empréstimos
const jurosDiario = 0.02;
const taxaEmprestimo = 0.025;

// Lista de todos os empréstimos
// [{ jogador: "Nome", valorOriginal: 1000, data: "2026-01-20T12:00:00", juros: 0.02, taxa: 0.025 }]
let todosEmprestimos = JSON.parse(localStorage.getItem("todosEmprestimos")) || [];

// -----------------------------
// FUNÇÕES DE BANCO
// -----------------------------
function atualizarTudo(){
  document.getElementById("nomeJogador").innerText = jogador;
  document.getElementById("saldo").innerText = saldoLikra.toLocaleString() + " Likra K$";
  document.getElementById("fundoEmprestimo").innerText = fundoEmprestimo.toLocaleString() + " Likra K$";

  // Histórico
  const ul = document.getElementById("historico");
  ul.innerHTML = "";
  historico.slice(0,10).forEach(h => {
    const li = document.createElement("li");
    li.textContent = `[${h.hora}] ${h.texto}`;
    ul.appendChild(li);
  });

  // Salva tudo
  localStorage.setItem("saldo_" + jogador, saldoLikra);
  localStorage.setItem("fundoEmprestimo", fundoEmprestimo);
  localStorage.setItem("historico_" + jogador, JSON.stringify(historico));
  localStorage.setItem("todosEmprestimos", JSON.stringify(todosEmprestimos));
  localStorage.setItem("fundoSoberano", fundoSoberano);
}

// Ganhar e gastar
function ganhar(){ saldoLikra += 10; historico.unshift({ texto: "Ganhou 10 Likra K$", hora: agora() }); atualizarTudo(); }
function gastar(){ saldoLikra -= 5; historico.unshift({ texto: "Gastou 5 Likra K$", hora: agora() }); atualizarTudo(); }

// Transferência
function transferir(){
  const nomeDestino = prompt("Para qual jogador deseja transferir?");
  if(!nomeDestino) return alert("Jogador inválido");
  const valor = parseFloat(prompt("Quanto deseja transferir?"));
  if(isNaN(valor) || valor<=0) return alert("Valor inválido");
  if(valor>saldoLikra) return alert("Saldo insuficiente");

  saldoLikra -= valor;
  jogadores.includes(nomeDestino) || jogadores.push(nomeDestino);
  localStorage.setItem("jogadores", JSON.stringify(jogadores));
  let saldoDestino = parseFloat(localStorage.getItem("saldo_" + nomeDestino)) || 0;
  saldoDestino += valor;
  localStorage.setItem("saldo_" + nomeDestino, saldoDestino);

  historico.unshift({ texto: `Transferiu ${valor.toLocaleString()} Likra K$ para ${nomeDestino}`, hora: agora() });
  atualizarTudo();
}

// -----------------------------
// FUNÇÕES DE EMPRÉSTIMOS
// -----------------------------
function pegarEmprestimo(){
  const valor = parseFloat(prompt("Quanto deseja pegar de empréstimo em Likra K$?"));
  if(isNaN(valor) || valor<=0) return alert("Valor inválido");
  if(valor>fundoEmprestimo) return alert("O fundo não tem esse valor");

  // adiciona empréstimo à lista
  const dataHoje = new Date().toISOString();
  const emprestimo = { jogador, valorOriginal: valor, data: dataHoje, juros: jurosDiario, taxa: taxaEmprestimo };
  todosEmprestimos.push(emprestimo);

  saldoLikra += valor;
  fundoEmprestimo -= valor;

  historico.unshift({ texto: `Pegou empréstimo de ${valor.toLocaleString()} Likra K$ (juros 2%/dia + taxa 2,5%)`, hora: agora() });
  atualizarTudo();
}

function pagarEmprestimo(){
  const meusEmprestimos = todosEmprestimos.filter(e => e.jogador === jogador);
  if(meusEmprestimos.length===0) return alert("Você não tem empréstimos");

  let msg = "Seus empréstimos:\n";
  meusEmprestimos.forEach((e,i)=>{
    const total = calcularJuros(e);
    msg += `${i+1}) Valor original: ${e.valorOriginal.toLocaleString()} | Total com juros: ${total}\n`;
  });
  const escolha = parseInt(prompt(msg + "Qual empréstimo deseja pagar? (Número)"));
  if(isNaN(escolha) || escolha<1 || escolha>meusEmprestimos.length) return alert("Escolha inválida");

  const emprestimo = meusEmprestimos[escolha-1];
  const total = parseFloat(calcularJuros(emprestimo));
  const pagamento = parseFloat(prompt(`Total a pagar: ${total} Likra K$\nQuanto deseja pagar?`));
  if(isNaN(pagamento) || pagamento<=0) return alert("Pagamento inválido");
  if(pagamento>saldoLikra) return alert("Saldo insuficiente");

  saldoLikra -= pagamento;

  // Juros e taxa vão para Fundo Soberano
  const jurosETaxa = pagamento - emprestimo.valorOriginal;
  fundoSoberano += jurosETaxa;

  // Atualiza ou remove empréstimo
  if(pagamento>=total){
    const index = todosEmprestimos.indexOf(emprestimo);
    if(index>-1) todosEmprestimos.splice(index,1);
    historico.unshift({ texto: `Quitou empréstimo de ${emprestimo.valorOriginal.toLocaleString()} Likra K$`, hora: agora() });
  } else {
    const restante = total - pagamento;
    const dataHoje = new Date().toISOString();
    const index = todosEmprestimos.indexOf(emprestimo);
    todosEmprestimos[index] = { ...emprestimo, valorOriginal: restante, data: dataHoje };
    historico.unshift({ texto: `Pagou ${pagamento.toLocaleString()} Likra K$ do empréstimo`, hora: agora() });
  }

  atualizarTudo();
}

// Calcula juros de um empréstimo
function calcularJuros(emprestimo){
  const dataInicio = new Date(emprestimo.data);
  const dataAgora = new Date();
  const dias = Math.floor((dataAgora - dataInicio)/(1000*60*60*24));
  return (emprestimo.valorOriginal * Math.pow(1 + emprestimo.juros, dias)).toFixed(2);
}

// -----------------------------
// AUXILIARES
// -----------------------------
function agora(){ 
  const d = new Date(); 
  return `${d.getDate()}/${d.getMonth()+1}/${d.getFullYear()} ${d.getHours()}:${d.getMinutes()}`;
}

function atualizarJogadores(){
  const div = document.getElementById("listaJogadores");
  div.innerHTML = "";
  jogadores.forEach(j=>{
    const btn = document.createElement("button");
    btn.textContent = j;
    btn.onclick = ()=>{ jogador = j; atualizarTudo(); }
    div.appendChild(btn);
  });
}

atualizarTudo();
atualizarJogadores();
