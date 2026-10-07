let minhaPokedex = [
    {
        id: 25,
        nome: "pikachu",
        numero: 25,
        tipos: ["electric"],
        imagem: "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/25.png",
        favorito: true
    }
];

// Criação variável para buscar da API
let pokemonsAPI = [];

const inputPesquisa = document.getElementById("inputPesquisa");
const fontePesquisa = document.getElementById("fontePesquisa");
const gridPokemon = document.getElementById("gridPokemon");
const mensagem = document.getElementById("mensagem");
const contador = document.getElementById("contador");
const tituloResultados = document.getElementById("tituloResultados");
const descricaoResultados = document.getElementById("descricaoResultados");


function renderizarCards() {

    const termo = inputPesquisa.value.toLowerCase();
    const fonte = fontePesquisa.value;

    let lista;

    if (fonte === "api") {

        lista = pokemonsAPI;

        tituloResultados.textContent = "PokéAPI";

        descricaoResultados.textContent =
            "Pesquise Pokémon disponíveis na API externa.";

    } else {

        lista = minhaPokedex;

        tituloResultados.textContent = "Minha Pokédex";

        descricaoResultados.textContent =
            "Pokémon cadastrados em sua coleção.";

    }


    const resultados = lista.filter(pokemon =>
        pokemon.nome.toLowerCase().includes(termo)
    );


    gridPokemon.innerHTML = "";


    if (resultados.length === 0) {

        mensagem.textContent = "Nenhum Pokémon encontrado.";

        mensagem.classList.remove("oculto");

        contador.textContent = "0 Pokémon";

        return;

    }


    mensagem.classList.add("oculto");


    resultados.forEach(pokemon => {

        const card = document.createElement("article");

        card.classList.add("card-pokemon");


        let botoes = "";


        if (fonte === "api") {

            botoes = `
                <button
                    class="botao-acao botao-adicionar"
                    title="Adicionar à Pokédex"
                    onclick="adicionarPokemon(${pokemon.id})">
                    +
                </button>
            `;

        } else {

            const estrela = pokemon.favorito ? "★" : "☆";

            botoes = `
                <button
                    class="botao-acao botao-favorito"
                    title="Favoritar"
                    onclick="favoritarPokemon(${pokemon.id})">
                    ${estrela}
                </button>

                <button
                    class="botao-acao botao-excluir"
                    title="Excluir"
                    onclick="excluirPokemon(${pokemon.id})">
                    🗑
                </button>
            `;

        }


        const tipos = pokemon.tipos
            .map(tipo =>
                `<span class="tipo ${tipo}">${tipo}</span>`
            )
            .join("");


        card.innerHTML = `

            <div class="acoes">
                ${botoes}
            </div>

            <img
                src="${pokemon.imagem}"
                alt="${pokemon.nome}"
            >

            <span class="numero">
                #${String(pokemon.numero).padStart(4, "0")}
            </span>

            <h3>${pokemon.nome}</h3>

            <div class="tipos">
                ${tipos}
            </div>
        `;


        gridPokemon.appendChild(card);

    });


    contador.textContent =
        `${resultados.length} Pokémon`;

}


function adicionarPokemon(id) {

    const pokemon = pokemonsAPI.find(
        pokemon => pokemon.id === id
    );


    const jaExiste = minhaPokedex.some(
        pokemon => pokemon.id === id
    );


    if (jaExiste) {

        alert("Este Pokémon já está na sua Pokédex.");

        return;

    }


    minhaPokedex.push({
        ...pokemon,
        favorito: false
    });


    alert(
        `${pokemon.nome} foi adicionado à sua Pokédex!`
    );

}


function favoritarPokemon(id) {

    const pokemon = minhaPokedex.find(
        pokemon => pokemon.id === id
    );


    if (!pokemon) {
        return;
    }


    pokemon.favorito = !pokemon.favorito;


    renderizarCards();

}


function excluirPokemon(id) {

    minhaPokedex = minhaPokedex.filter(
        pokemon => pokemon.id !== id
    );


    renderizarCards();

}

// Boa prática para inserir um "timeout" entre requisições
let temporizadorPesquisa;

inputPesquisa.addEventListener("input", () => {
    clearTimeout(temporizadorPesquisa);

    temporizadorPesquisa = setTimeout(executarPesquisa, 500);
});


fontePesquisa.addEventListener(
    "change",
    renderizarCards
);


renderizarCards();

async function buscarPokemonAPI(nome) {
    
    const resposta = await fetch(
        `http://127.0.0.1:8000/externo/pokemon/${nome}`
    );

    if (!resposta.ok) {
        throw new Error("Pokémon não encontrado!");
    }

    const pokemon = await resposta.json();

    return {
        id: pokemon.numero,
        nome: pokemon.nome,
        numero: pokemon.numero,
        tipos: pokemon.tipos,
        imagem: pokemon.imagem
    };

}

async function executarPesquisa() {

    const termo = inputPesquisa.value.trim().toLowerCase();

    if (fontePesquisa.value === "local") {
        renderizarCards();
        return;
    }

    if (termo.length < 2) {
        pokemonsAPI = [];
        renderizarCards();
        return;
    }

    try {

        mensagem.textContent = "Buscando Pokémon...";
        mensagem.classList.remove("oculto");

        const pokemon = await buscarPokemonAPI(termo);

        pokemonsAPI = [pokemon];

        renderizarCards();

    } catch (erro) {

        pokemonsAPI = [];

        gridPokemon.innerHTML = "";

        contador.textContent = "0 Pokémon";

        mensagem.textContent = "Pokémon não encontrado.";
        mensagem.classList.remove("oculto");

    }
}