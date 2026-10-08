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
    executarPesquisa
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
    const fonte = fontePesquisa.value;


    try {

        mensagem.textContent = "Buscando Pokémon...";
        mensagem.classList.remove("oculto");


        // =========================
        // PESQUISA NA POKÉAPI
        // =========================

        if (fonte === "api") {

            if (termo.length < 2) {
                pokemonsAPI = [];
                renderizarCards();
                return;
            }

            const pokemon = await buscarPokemonAPI(termo);

            pokemonsAPI = [pokemon];
        }


        // =========================
        // PESQUISA NO NOSSO BANCO
        // =========================

        else {

            minhaPokedex = await buscarMinhaPokedex(termo);

        }


        renderizarCards();


    } catch (erro) {

        gridPokemon.innerHTML = "";

        contador.textContent = "0 Pokémon";

        mensagem.textContent =
            "Não foi possível realizar a busca.";

        mensagem.classList.remove("oculto");

    }
}

async function buscarMinhaPokedex(nome = "") {

    let url = "http://127.0.0.1:8000/pokemons";


    // Caso exista um termo de pesquisa,
    // enviamos como Query Parameter.
    if (nome) {
        url += `?nome=${encodeURIComponent(nome)}`;
    }


    const resposta = await fetch(url);


    if (!resposta.ok) {
        throw new Error("Erro ao consultar a Pokédex.");
    }


    const dados = await resposta.json();


    return dados.map(pokemon => ({
        id: pokemon.id,

        // Guardamos também o ID externo porque
        // precisaremos dele em outras operações.
        pokeapi_id: pokemon.pokeapi_id,

        nome: pokemon.nome,
        numero: pokemon.numero,

        tipos: [
            pokemon.tipo_primario,
            pokemon.tipo_secundario
        ].filter(Boolean),

        imagem: pokemon.sprite_url,
        favorito: pokemon.favorito
    }));
}

async function adicionarPokemon(id) {

    const pokemon = pokemonsAPI.find(
        pokemon => pokemon.id === id
    );


    if (!pokemon) {
        return;
    }


    const dados = {
        pokeapi_id: pokemon.id,
        nome: pokemon.nome,
        numero: pokemon.numero,
        sprite_url: pokemon.imagem,
        tipo_primario: pokemon.tipos[0],
        tipo_secundario: pokemon.tipos[1] || null
    };


    const resposta = await fetch(
        "http://127.0.0.1:8000/pokemons",
        {
            method: "POST",

            headers: {
                "Content-Type": "application/json"
            },

            body: JSON.stringify(dados)
        }
    );


    if (resposta.status === 409) {

        alert(
            "Este Pokémon já está na sua Pokédex."
        );

        return;
    }


    if (!resposta.ok) {

        alert(
            "Não foi possível adicionar o Pokémon."
        );

        return;
    }


    alert(
        `${pokemon.nome} foi adicionado à sua Pokédex!`
    );

}
