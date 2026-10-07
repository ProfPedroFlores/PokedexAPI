from fastapi import FastAPI, HTTPException

from fastapi.middleware.cors import CORSMiddleware

from schemas import PokemonExternoResponse

import requests

# Criação de Tags automatizadas

tags_metadata = [
    {
        "name": "Geral",
        "description": "Operações gerais e informações sobre a API"
    },
    {
        "name": "PokéAPI",
        "description": "Operações responsáveis pela consulta de dados externos na PokéAPI"
    },
    {
        "name": "Minha Pokédex",
        "description": "Operações responsáveios pela gerenciamento dos Pokémons persistentes"
    }
]

app = FastAPI(
    title="Pokédex API",
    description="API para consulta da PokéAPI e gerenciamento de uma Pokédex pessoal.",
    version="1.0.0",
    openapi_tags=tags_metadata
)

origins = [
    "http://127.0.0.1:5500",
    "http://localhost:5500"
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"]
)

@app.get("/", tags=["Geral"], summary="Verificar funcionamento da API")
def inicio():
    return {
        "mensagem": "Pokédex API funcionando!"
    }



@app.get(
        "/externo/pokemon/{nome}", 
        tags=["PokéAPI"], 
        summary="Pesquisar Pokémon na API",
        response_model=PokemonExternoResponse
        )
def buscar_pokemon(nome: str):
    print(nome)
    url = f"https://pokeapi.co/api/v2/pokemon/{nome.lower()}"

    resposta = requests.get(url)

    if resposta.status_code == 404:
        raise HTTPException(
            status_code=404,
            detail="Pokémon não encontrado."
        )

    dados = resposta.json()

    # A PokéAPI retorna muitas informações
    # Nossa aplicação selecionará apenas os dados necessários para o nosso cliente
    pokemon = {
        "numero": dados["id"],
        "nome": dados["name"],
        "imagem": dados["sprites"]["other"]["official-artwork"]["front_default"],
        "tipos":[
            tipo["type"]["name"]
            for tipo in dados["types"]
        ]
    }

    return pokemon