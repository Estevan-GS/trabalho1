
// Variáveis do controle
let transacoes = [];
let indexEdicao = null; // Variável para controlar a transação que está sendo editada

// mudar modo claro e escuro
document.getElementById('btn-tema').addEventListener('click', () => {
    const tema = document.getElementById('tema');
    const body = document.body;

    if (body.classList.contains('escuro')) {
        body.classList.remove('escuro');
        tema.querySelector('button').textContent = 'Modo Escuro';
    } else {
        body.classList.add('escuro');
        tema.querySelector('button').textContent = 'Modo Claro';
    }
});

// formatar valores monetários
function formatarValor(valor) {
    return valor.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
}

// atualizar o financeiro geral
function atualizarResumo() {
    const receitas = transacoes.filter(t => t.categoria === 'receita');
    const despesas = transacoes.filter(t => t.categoria === 'despesa');

    const totalReceitas = receitas.reduce((acc, t) => acc + t.valor, 0);
    const totalDespesas = despesas.reduce((acc, t) => acc + t.valor, 0);
    const saldoFinal = totalReceitas - totalDespesas;

    document.getElementById('total-receitas').textContent = formatarValor(totalReceitas);
    document.getElementById('total-despesas').textContent = formatarValor(totalDespesas);
    document.getElementById('saldo-final').textContent = formatarValor(saldoFinal);
}

// adiciona ou edita uma nova transação
document.getElementById('form-cadastro').addEventListener('submit', (event) => {
    event.preventDefault();

    const nome = document.getElementById('nome').value;
    const categoria = document.getElementById('categoria').value;
    const data = document.getElementById('data').value;
    const valor = parseFloat(document.getElementById('valor').value);

    if (indexEdicao === null) {
        // Se não tem uma transação sen editada adiciona uma nova
        const transacao = { nome, categoria, data, valor };
        transacoes.push(transacao);
    } else {
        // Caso contrário, editar a transação existente
        transacoes[indexEdicao] = { nome, categoria, data, valor };
        indexEdicao = null; // Limpar o índice de edição
    }

    // Limpar o formulário
    document.getElementById('form-cadastro').reset();

    // Atualizar a tabela e o resumo
    atualizarTabela(transacoes);
    atualizarResumo();
});

// atualiza toda a tabela de transações
function atualizarTabela(transacoes) {
    const tbody = document.getElementById('tabela-transacoes').querySelector('tbody');
    tbody.innerHTML = '';

    transacoes.forEach((transacao, index) => {
        const row = document.createElement('tr');

        row.innerHTML = `
            <td>${transacao.nome}</td>
            <td>${transacao.categoria}</td>
            <td>${transacao.data}</td>
            <td>${formatarValor(transacao.valor)}</td>
            <td>
                <button onclick="editarTransacao(${index})">Editar</button>
                <button onclick="removerTransacao(${index})">Remover</button>
            </td>
        `;
        tbody.appendChild(row);
    });
}

// remove a transação
function removerTransacao(index) {
    transacoes.splice(index, 1);

    atualizarTabela(transacoes);
    atualizarResumo();
}

// a edição de uma transação
function editarTransacao(index) {
    const transacao = transacoes[index];

    // preeenche o formulário com os dados
    document.getElementById('nome').value = transacao.nome;
    document.getElementById('categoria').value = transacao.categoria;
    document.getElementById('data').value = transacao.data;
    document.getElementById('valor').value = transacao.valor;

    //transação que está sendo editada
    indexEdicao = index;
}
