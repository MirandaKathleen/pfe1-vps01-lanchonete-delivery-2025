const produtos = [
    { id: 1, nome: "Hamburguer", preco: 15.00 },
    { id: 2, nome: "X-Burguer", preco: 20.00 },
    { id: 3, nome: "X-Salada", preco: 20.00 },
    { id: 4, nome: "X-Bacon", preco: 25.00 },
    { id: 5, nome: "X-Egg", preco: 30.00 },
    { id: 6, nome: "X-Tudo", preco: 35.00 }
];

document.addEventListener("DOMContentLoaded", () => {
    const produtoSelect = document.getElementById("produtoSelect");
    const pedidosEmExecucao = document.getElementById("pedidosEmExecucao");
    const verFinalizados = document.getElementById("verFinalizados");

    produtos.forEach(produto => {
        const option = document.createElement("option");
        option.value = produto.id;
        option.textContent = `${produto.nome} - R$ ${produto.preco.toFixed(2)}`;
        produtoSelect.appendChild(option);
    });

    document.getElementById("pedidoForm").addEventListener("submit", (event) => {
        event.preventDefault();
        const clienteNome = document.getElementById("clienteNome").value;
        const produto = produtos.find(p => p.id === parseInt(produtoSelect.value));
        const dataHora = new Date().toLocaleString();

        if (produto) {
            const pedido = { clienteNome, produto: produto.nome, dataHora };
            adicionarPedido(pedido);
            document.getElementById("pedidoForm").reset();
        }
    });

    function adicionarPedido(pedido) {
        const card = document.createElement("div");
        card.className = "card";
        card.innerHTML = `
            <h3>${pedido.produto}</h3>
            <p>Cliente: ${pedido.clienteNome}</p>
            <p>Data e Hora: ${pedido.dataHora}</p>
            <button onclick="moverParaEntrega(this)">
            <img src="icone.png" alt="Mover para Entrega" class="iconeMover" onclick="moverParaEntrega(this)"></button>
        `;
        pedidosEmExecucao.appendChild(card);
    }

    window.moverParaEntrega = function(button) {
        const card = button.parentElement;
        const pedido = {
            clienteNome: card.querySelector("p").textContent.split(": ")[1],
            produto: card.querySelector("h3").textContent,
            dataHora: card.querySelector("p:nth-child(3)").textContent
        };
        card.querySelector("button").remove();
        adicionarFinalizadoButton(card, pedido);
        document.getElementById("pedidosEmEntrega").appendChild(card);
    }

    function adicionarFinalizadoButton(card, pedido) {
        const finalizarButton = document.createElement("button");
        finalizarButton.textContent = "Finalizar Pedido";
        finalizarButton.onclick = function() {
            finalizarPedido(pedido);
            card.remove();
        };
        card.appendChild(finalizarButton);
    }

    function finalizarPedido(pedido) {
        let finalizados = JSON.parse(localStorage.getItem("pedidosFinalizados")) || [];
        finalizados.push(pedido);
        localStorage.setItem("pedidosFinalizados", JSON.stringify(finalizados));
    }

    verFinalizados.addEventListener("click", () => {
        window.location.href = "finalizados.html";
    });
});

if (document.title === "Pedidos Finalizados") {
    const tabelaFinalizados = document.getElementById("tabelaFinalizados").getElementsByTagName('tbody')[0];
    const finalizados = JSON.parse(localStorage.getItem("pedidosFinalizados")) || [];

    finalizados.forEach(pedido => {
        const row = tabelaFinalizados.insertRow();
        row.insertCell(0).textContent = pedido.clienteNome;
        row.insertCell(1).textContent = pedido.produto;
        row.insertCell(2).textContent = pedido.dataHora;
    });
}