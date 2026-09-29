const pokemonsAPI = [
    {
        id: 1,
        nome: "bulbasaur",
        numero: 1,
        tipos: ["grass", "poison"],
        imagem: "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/1.png"
    },
    {
        id: 4,
        nome: "charmander",
        numero: 4,
        tipos: ["fire"],
        imagem: "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/4.png"
    },
    {
        id: 7,
        nome: "squirtle",
        numero: 7,
        tipos: ["water"],
        imagem: "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/7.png"
    },
    {
        id: 25,
        nome: "pikachu",
        numero: 25,
        tipos: ["electric"],
        imagem: "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/25.png"
    }
];


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


inputPesquisa.addEventListener(
    "input",
    renderizarCards
);


fontePesquisa.addEventListener(
    "change",
    renderizarCards
);


renderizarCards();