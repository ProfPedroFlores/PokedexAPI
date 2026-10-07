from pydantic import BaseModel

class PokemonExternoResponse(BaseModel):
    numero: int
    nome: str
    imagem: str | None
    tipos: list[str]