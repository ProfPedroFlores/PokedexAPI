from fastapi import FastAPI, HTTPException, Depends

from fastapi.middleware.cors import CORSMiddleware

from database import engine, get_db

from schemas import (
    PokemonExternoResponse,
    PokemonCreate,
    PokemonResponse
)

import requests

import models

from sqlalchemy.orm import Session

models.Base.metadata.create_all(bind=engine)

origins = [
    "http://127.0.0.1:5500",
    "http://localhost:5500"
]
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

@app.post(
    "/pokemons",
    tags=["Minha Pokédex"],
    summary="Adicionar Pokémon à Pokédex",
    status_code=201,
    response_model=PokemonResponse
)
def adicionar_pokemon(
    pokemon: PokemonCreate,
    db: Session = Depends(get_db)
):

    # Verifica se o Pokémon já foi cadastrado.
    pokemon_existente = db.query(models.Pokemon).filter(
        models.Pokemon.pokeapi_id == pokemon.pokeapi_id
    ).first()


    if pokemon_existente:

        raise HTTPException(
            status_code=409,
            detail="Este Pokémon já está cadastrado na Pokédex."
        )


    # Converte os dados recebidos pelo Schema
    # em uma entidade do nosso Model.
    novo_pokemon = models.Pokemon(
        pokeapi_id=pokemon.pokeapi_id,
        nome=pokemon.nome,
        numero=pokemon.numero,
        sprite_url=pokemon.sprite_url,
        tipo_primario=pokemon.tipo_primario,
        tipo_secundario=pokemon.tipo_secundario
    )


    # Adiciona o objeto à sessão.
    db.add(novo_pokemon)


    # Confirma a operação no banco.
    db.commit()


    # Atualiza o objeto Python com os valores
    # gerados pelo banco, como ID e data.
    db.refresh(novo_pokemon)


    return novo_pokemon

@app.get(
    "/pokemons",
    tags=["Minha Pokédex"],
    summary="Listar Pokémon da Pokédex",
    response_model=list[PokemonResponse]
)
def listar_pokemons(
    db: Session = Depends(get_db)
):

    # Consulta todos os Pokémon cadastrados.
    pokemons = db.query(models.Pokemon).all()

    return pokemons


