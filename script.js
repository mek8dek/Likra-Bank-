// -----------------------
// BANCO E JOGADORES
// -----------------------
let jogador = "";
let saldoLikra = 100;
let saldoReais = 1000;
let saldoSAD = 0;
let saldoDAF = 0;
let historico = [];

let precoMedioLikra = 0;
let precoMedioSAD = 0;
let precoMedioDAF = 0;

let fundoEmprestimo = 74000000;

// taxa de juros diária para empréstimos
const jurosDiario = 0.02;

// controle dos empréstimos
let emprestimos = JSON.parse(localStorage.getItem("emprestimos_" + jogador)) || [];

// -----------------------
// FUNÇÕES DE BANCO
// -----------------------
function carregarJogador(nome) {
  jogador = nome || localStorage.getItem("jogadorLikra");
  if (!jogador) {
    jogador = prompt("Digite seu nome:");
    if (!jogador) jogador = "Jogador";
  }
  localStorage.setItem("jogadorLikra", jogador);

  let listaJogadores = JSON.parse(localStorage.getItem("listaJogadores")) || [];
  if (!listaJogadores.includes(jogador)) listaJogadores.push(jogador);
  localStorage.setItem("listaJogadores", JSON.stringify(listaJogadores));

  saldoLikra = parseFloat(localStorage.getItem("saldo_" + jogador)) || 100;
  saldoReais = parseFloat(localStorage.getItem("saldoReais_" + jogador)) || 1000;
  saldoSAD = parseFloat(localStorage.getItem("saldoSAD_" + jogador)) || 0;
  saldoDAF = parseFloat(localStorage.getItem("saldoDAF_" + jogador)) || 0;
  historico = JSON.parse(localStorage.getItem("historico_" + jogador)) || [];

  precoMedioLikra = parseFloat(localStorage.getItem("precoLikra_" + jogador)) || 0;
  precoMedioSAD = parseFloat(localStorage.getItem("precoSAD_" + jogador)) || 0;
  precoMedioDAF = parseFloat(localStorage.getItem("precoDAF_" + jogador)) || 0;

  emprestimos = JSON.parse(localStorage.getItem("emprestimos_" + jogador)) || [];

  document.getElementById("fundoEmprestimo").innerText = fundoEmprestimo.toLocaleString() + " Likra K$";
}

function agora() { return new Date().toLocaleString(); }

function atualizarTudo() {
  document.getElementById("saldo").innerText = saldoLikra.toFixed(2) + " Likra K$";
  document.getElementById("nomeJogador").innerText = jogador;
  document.getElementById("saldoReais").innerText = `R$ ${saldoReais.toFixed(2)}`;

  const lista = document.getElementById("historico");
  lista.innerHTML = "";
  historico.forEach(item => {
    const li = document.createElement("li");
    li.innerText = `[${item.hora}] ${item.texto}`;
    lista.appendChild(li);
  });

  localStorage.setItem("saldo_" + jogador, saldoLikra);
  localStorage.setItem("saldoReais_" + jogador, saldoReais);
  localStorage.setItem("saldoSAD_" + jogador, saldoSAD);
  localStorage.setItem("saldoDAF_" + jogador, saldoDAF);
  localStorage.setItem("historico_" + jogador, JSON.stringify(historico));

  localStorage.setItem("precoLikra_" + jogador, precoMedioLikra);
  localStorage.setItem("precoSAD_" + jogador, precoMedioSAD);
  localStorage.setItem("precoDAF_" + jogador, precoMedioDAF);

  localStorage.setItem("emprestimos_" + jogador, JSON.stringify(emprestimos));

  atualizarListaJogadores();
  atualizarBolsaTotais();
  atualizarEmprestimos();
}

function ganhar() { saldoLikra += 10; historico.unshift({ texto: "Ganhou 10 Likra K$", hora: agora() }); atualizarTudo(); }
function gastar() { if(saldoLikra>=5){saldoLikra-=5; historico.unshift({ texto:"Gastou 5 Likra K$", hora: agora() }); atualizarTudo();}else{alert("Saldo insuficiente");} }
function transferir() {
  const dest = prompt("Digite o nome do jogador que vai receber:");
  if(!dest) return;
  const valor=parseFloat(prompt("Quanto deseja transferir?"));
  if(isNaN(valor)||valor<=0){alert("Valor inválido");return;}
  if(valor>saldoLikra){alert("Saldo insuficiente");return;}
  saldoLikra-=valor;
  historico.unshift({texto:`Transferiu ${valor.toFixed(2)} Likra para ${dest}`,hora:agora()});
  let saldoDest=parseFloat(localStorage.getItem("saldo_"+dest))||0;
  let histDest=JSON.parse(localStorage.getItem("historico_"+dest))||[];
  histDest.unshift({texto:`Recebeu ${valor.toFixed(2)} Likra de ${jogador}`,hora:agora()});
  localStorage.setItem("saldo_"+dest,saldoDest+valor);
  localStorage.setItem("historico_"+dest,JSON.stringify(histDest));
  atualizarTudo();
}
function atualizarListaJogadores() {
  const divLista=document.getElementById("listaJogadores");
  divLista.innerHTML="";
  const lista=JSON.parse(localStorage.getItem("listaJogadores"))||[];
  lista.forEach(nome=>{
    const btn=document.createElement("button");
    btn.innerText=nome;
    btn.className="trocar";
    btn.onclick=()=>{carregarJogador(nome); atualizarTudo();};
    divLista.appendChild(btn);
  });
}

// -----------------------
// BOLSA DE MOEDAS
// -----------------------
let valorLikraBolsa=3.44;
let valorSAD=2.34;
let valorDAF=7.89;
let prevLikra=valorLikraBolsa, prevSAD=valorSAD, prevDAF=valorDAF;
const taxa=0.025;

function oscilarMoeda(){
  function oscilar(valor){return parseFloat((valor*(1+Math.random()*0.1-0.05)).toFixed(2));}
  const novoLikra=oscilar(valorLikraBolsa);
  const novoSAD=oscilar(valorSAD);
  const novoDAF=oscilar(valorDAF);
  const percLikra=((novoLikra-prevLikra)/prevLikra*100).toFixed(2);
  const percSAD=((novoSAD-prevSAD)/prevSAD*100).toFixed(2);
  const percDAF=((novoDAF-prevDAF)/prevDAF*100).toFixed(2);
  document.getElementById("valorLikra").innerHTML=`Likra K$: R$ ${novoLikra} <span style="color:${percLikra>=0?'green':'red'}">(${percLikra>=0?'+':''}${percLikra}%)</span>`;
  document.getElementById("valorSAD").innerHTML=`SAD$: R$ ${novoSAD} <span style="color:${percSAD>=0?'green':'red'}">(${percSAD>=0?'+':''}${percSAD}%)</span>`;
  document.getElementById("valorDAF").innerHTML=`DAF¥: R$ ${novoDAF} <span style="color:${percDAF>=0?'green':'red'}">(${percDAF>=0?'+':''}${percDAF}%)</span>`;
  prevLikra=valorLikraBolsa; prevSAD=valorSAD; prevDAF=valorDAF;
  valorLikraBolsa=novoLikra; valorSAD=novoSAD; valorDAF=novoDAF;
  atualizarBolsaTotais();
}

function atualizarBolsaTotais(){
  function calcLucro(saldo, precoAtual, precoMedio){
    const total=saldo*precoAtual;
    const lucro=saldo>0?((precoAtual-precoMedio)*saldo).toFixed(2):0;
    return {total, lucro};
  }
  let r=calcLucro(saldoLikra,valorLikraBolsa,precoMedioLikra);
  document.getElementById("saldoLikraBolsa").innerText=saldoLikra.toFixed(2);
  document.getElementById("totalLikra").innerText=r.total.toFixed(2);
  document.getElementById("lucroLikra").innerText=r.lucro;
  document.getElementById("lucroLikra").style.color=r.lucro>=0?'green':'red';

  r=calcLucro(saldoSAD,valorSAD,precoMedioSAD);
  document.getElementById("saldoSADBolsa").innerText=saldoSAD.toFixed(2);
  document.getElementById("totalSAD").innerText=r.total.toFixed(2);
  document.getElementById("lucroSAD").innerText=r.lucro;
  document.getElementById("lucroSAD").style.color=r.lucro>=0?'green':'red';

  r=calcLucro(saldoDAF,valorDAF,precoMedioDAF);
  document.getElementById("saldoDAFBolsa").innerText=saldoDAF.toFixed(2);
  document.getElementById("totalDAF").innerText=r.total.toFixed(2);
  document.getElementById("lucroDAF").innerText=r.lucro;
  document.getElementById("lucroDAF").style.color=r.lucro>=0?'green':'red';
}

function comprarMoeda(tipo){
  const valor=parseFloat(prompt(`Quanto em R$ deseja gastar para comprar ${tipo}?`));
  if(isNaN(valor)||valor<=0){alert("Valor inválido"); return;}
  if(valor>saldoReais){alert("Saldo insuficiente"); return;}
  const taxaOper=valor*taxa;
  const valorLiquido=valor-taxaOper;
  let qtd=0;
  if(tipo==="Likra"){qtd=valorLiquido/valorLikraBolsa; precoMedioLikra=(precoMedioLikra*saldoLikra+valorLiquido)/ (saldoLikra+qtd); saldoLikra+=qtd;}
  else if(tipo==="SAD"){qtd=valorLiquido/valorSAD; precoMedioSAD=(precoMedioSAD*saldoSAD+valorLiquido)/(saldoSAD+qtd); saldoSAD+=qtd;}
  else if(tipo==="DAF"){qtd=valorLiquido/valorDAF; precoMedioDAF=(precoMedioDAF*saldoDAF+valorLiquido)/(saldoDAF+qtd); saldoDAF+=qtd;}
  saldoReais-=valor;
  alert(`Comprou ${qtd.toFixed(2)} ${tipo} (taxa R$ ${taxaOper.toFixed(2)})`);
  atualizarTudo();
}

function venderMoeda(tipo){
  const qtd=parseFloat(prompt(`Quantas ${tipo} deseja vender?`));
  if(isNaN(qtd)||qtd<=0){alert("Quantidade inválida"); return;}
  let saldoMoeda=0, precoAtual=0;
  if(tipo==="Likra"){saldoMoeda=saldoLikra; precoAtual=valorLikraBolsa;}
  else if(tipo==="SAD"){saldoMoeda=saldoSAD; precoAtual=valorSAD;}
  else if(tipo==="DAF"){saldoMoeda=saldoDAF; precoAtual=valorDAF;}
  if(qtd>saldoMoeda){alert("Saldo insuficiente da moeda"); return;}
  const valorBruto=qtd*precoAtual;
  const taxaOper=valorBruto*taxa;
  const valorLiquido=valorBruto-taxaOper;
  if(tipo==="Likra"){saldoLikra-=qtd;}
  else if(tipo==="SAD"){saldoSAD-=qtd;}
  else if(tipo==="DAF"){saldoDAF-=qtd;}
  saldoReais+=valorLiquido;
  alert(`Vendeu ${qtd.toFixed(2)} ${tipo} por R$ ${valorLiquido.toFixed(2)} (taxa R$ ${taxaOper.toFixed(2)})`);
  atualizarTudo();
}

// -----------------------
// FUNDO DE EMPRÉSTIMO COM JUROS
// -----------------------
function calcularJuros(emprestimo) {
  const dataInicio = new Date(emprestimo.data);
  const dataAgora = new Date();
  const dias = Math.floor((dataAgora - dataInicio) / (1000*60*60*24));
  const total = emprestimo.valorOriginal * Math.pow(1 + emprestimo.juros, dias);
  return total.toFixed(2);
}

function pagarEmprestimo() {
  if(emprestimos.length===0){ alert("Você não tem empréstimos."); return; }
  let msg="Seus empréstimos:\n";
  emprestimos.forEach((e,i)=>{ msg+=`${i+1}) Valor original: ${e.valorOriginal.toLocaleString()} | Total com juros: ${calcularJuros(e)}\n`; });
  const escolha = parseInt(prompt(msg + "Qual empréstimo deseja pagar? (Número)"));
  if(isNaN(escolha) || escolha<1 || escolha>emprestimos.length){ alert("Escolha inválida"); return; }
  const emprestimo = emprestimos[escolha-1];
  const total = parseFloat(calcularJuros(emprestimo));
  const pagamento = parseFloat(prompt(`Total a pagar: ${total} Likra K$. Quanto deseja pagar?`));
  if(isNaN(pagamento) || pagamento<=0){ alert("Pagamento inválido"); return; }
  if(pagamento>saldoLikra){ alert("Saldo insuficiente"); return; }
  saldoLikra-=pagamento;
  if(pagamento>=total){ emprestimos.splice(escolha-1,1); historico.unshift({texto:`Quitou empréstimo de ${emprestimo.valorOriginal.toLocaleString()} Lik
