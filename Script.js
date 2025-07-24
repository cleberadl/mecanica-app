// Configuração do Firebase (substitua pelos seus dados!)
const firebaseConfig = {
  apiKey: "SUA_API_KEY",
  authDomain: "SEU_PROJETO.firebaseapp.com",
  projectId: "SEU_PROJETO",
  storageBucket: "SEU_PROJETO.appspot.com",
  messagingSenderId: "SEU_SENDER_ID",
  appId: "SEU_APP_ID"
};

// Inicializa o Firebase
firebase.initializeApp(firebaseConfig);
const db = firebase.firestore();

// Carrega clientes do banco de dados
function carregarClientes(filtro = 'TODOS') {
  const lista = document.getElementById('lista-clientes');
  lista.innerHTML = '';

  let query = db.collection('clientes');
  
  if (filtro === 'CONFIRMADOS') query = query.where('status', '==', 'confirmado');
  if (filtro === 'PENDENTES') query = query.where('status', '==', 'pendente');

  query.onSnapshot((snapshot) => {
    snapshot.forEach((doc) => {
      const cliente = doc.data();
      lista.innerHTML += `
        <div class="cliente-card">
          <div class="status ${cliente.status}"></div>
          <div>
            <strong>${cliente.nome}</strong> - ${cliente.veiculo}
          </div>
        </div>
      `;
    });
  });
}

// Filtra clientes
function filtrar(tipo) {
  document.querySelectorAll('.filtros button').forEach(btn => {
    btn.classList.remove('ativo');
    if (btn.textContent === tipo) btn.classList.add('ativo');
  });
  carregarClientes(tipo);
}

// Cadastra novo cliente
document.getElementById('form-cliente').addEventListener('submit', (e) => {
  e.preventDefault();
  const nome = document.getElementById('nome').value;
  const veiculo = document.getElementById('veiculo').value;

  db.collection('clientes').add({
    nome,
    veiculo,
    status: 'pendente',
    data: new Date()
  }).then(() => {
    alert('Cliente cadastrado!');
    document.getElementById('form-cliente').reset();
  });
});

// Inicializa
carregarClientes();
