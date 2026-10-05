from fastapi import FastAPI, HTTPException

import requests


app = FastAPI(
    title="Pokédex API",
    description="API para consulta da PokéAPI e gerenciamento de uma Pokédex pessoal.",
    version="1.0.0"
)


@app.get("/")
def inicio():
    return {
        "mensagem": "Pokédex API funcionando!"
    }



@app.get("/externo/pokemon/{nome}")
def buscar_pokemon(nome: str):

    url = f"https://pokeapi.co/api/v2/pokemon/{nome.lower()}"

    resposta = requests.get(url)

    if resposta.status_code == 404:
        raise HTTPException(
            status_code=404,
            detail="Pokémon não encontrado."
        )

    dados = resposta.json()

    return dados