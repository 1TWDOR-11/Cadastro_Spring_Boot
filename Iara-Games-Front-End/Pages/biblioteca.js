let idEmEdicao = null; // Para saber se estamos editando um jogo

window.onload = () => {
    fetch("http://localhost:3000/jogos")
        .then(res => res.json())
        .then(jogos => {
            jogos.forEach(jogo => renderGameCard(jogo));
        });
};

function renderGameCard(jogo) {
    const card = document.createElement("div");
    card.classList.add("game-card");
    card.setAttribute("data-id", jogo.id);
    card.setAttribute("onclick", `openGamePopup('${jogo.nome}', '${jogo.imagem}', '${jogo.genero}')`);
    card.innerHTML = `
    <img src="${jogo.imagem}" alt="${jogo.nome}">
    <h3>${jogo.nome}</h3>
    <p>${jogo.genero}</p>
    <button onclick="addToCart(event, '${jogo.nome}')">Adicionar ao Carrinho</button>
    <i class="bi bi-heart favorite-icon" onclick="toggleFavorite(event, '${jogo.nome}')"></i>
    <div class="card-actions">
      <button class="edit-btn" onclick="editGame(event)">
        <i class="bi bi-pencil-square"></i>
      </button>
      <button class="delete-btn" onclick="deleteGame(event)">
        <i class="bi bi-trash-fill"></i>
      </button>
    </div>
  `;
    document.querySelector(".games-grid").appendChild(card);
}

function addNewGame(event) {
    event.preventDefault();

    const nome = document.getElementById("gameName").value;
    const genero = document.getElementById("gameGenre").value;
    const imagem = document.getElementById("gameImage").value;
    const jogo = { nome, genero, imagem };

    // EDITAR
    if (idEmEdicao) {
        fetch(`http://localhost:3000/jogos/${idEmEdicao}`, {
            method: "PUT",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(jogo)
        })
            .then(res => res.json())
            .then(jogoAtualizado => {
                renderGameCard({ ...jogoAtualizado, id: idEmEdicao });
                document.getElementById("addGameForm").reset();
                idEmEdicao = null;
            })
            .catch(err => console.error("Erro ao editar jogo:", err));
    } else {
        // CRIAR
        fetch("http://localhost:3000/jogos", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(jogo)
        })
            .then(res => res.json())
            .then(jogoCriado => {
                renderGameCard(jogoCriado);
                document.getElementById("addGameForm").reset();
            })
            .catch(err => console.error("Erro ao adicionar jogo:", err));
    }
}

function deleteGame(event) {
    event.stopPropagation();
    const card = event.target.closest(".game-card");
    const id = card.getAttribute("data-id");

    fetch(`http://localhost:3000/jogos/${id}`, {
        method: "DELETE"
    })
        .then(() => card.remove())
        .catch(err => console.error("Erro ao excluir jogo:", err));
}

function editGame(event) {
    event.stopPropagation();
    const card = event.target.closest(".game-card");
    const id = card.getAttribute("data-id");
    const nome = card.querySelector("h3").textContent;
    const genero = card.querySelector("p").textContent;
    const imagem = card.querySelector("img").src;

    // Preenche o formulário com os dados
    document.getElementById("gameName").value = nome;
    document.getElementById("gameGenre").value = genero;
    document.getElementById("gameImage").value = imagem;

    idEmEdicao = id;

    // Remove o card atual da tela, pois será substituído após edição
    card.remove();
}

function openGamePopup(nome, imagem, genero) {
    document.getElementById("popupImage").src = imagem;
    document.getElementById("popupImage").alt = nome;
    document.getElementById("popupTitle").textContent = nome;
    document.getElementById("popupGenre").textContent = genero;
    document.getElementById("popup").style.display = "flex";
}

function closeGamePopup() {
    document.getElementById("popup").style.display = "none";
}
