from datetime import datetime
from pydantic import BaseModel


class PokemonExternoResponse(BaseModel):
    numero: int
    nome: str
    imagem: str | None
    tipos: list[str]


class PokemonCreate(BaseModel):
    pokeapi_id: int
    nome: str
    numero: int
    sprite_url: str | None = None
    tipo_primario: str
    tipo_secundario: str | None = None


class PokemonResponse(BaseModel):
    id: int
    pokeapi_id: int
    nome: str
    numero: int
    sprite_url: str | None
    tipo_primario: str
    tipo_secundario: str | None
    favorito: bool
    criado_em: datetime

    model_config = {
        "from_attributes": True
    }