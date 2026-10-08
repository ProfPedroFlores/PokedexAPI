from sqlalchemy import (
    Column,
    Integer,
    String,
    Boolean,
    DateTime
)

from sqlalchemy.sql import func

from database import Base


class Pokemon(Base):

    # Nome da tabela que será criada no MySQL.
    __tablename__ = "pokemon"


    # Identificador interno da nossa aplicação.
    id = Column(
        Integer,
        primary_key=True,
        index=True
    )


    # Identificador original do Pokémon na PokéAPI.
    pokeapi_id = Column(
        Integer,
        unique=True,
        nullable=False
    )


    nome = Column(
        String(100),
        nullable=False
    )


    numero = Column(
        Integer,
        nullable=False
    )


    sprite_url = Column(
        String(500),
        nullable=True
    )


    tipo_primario = Column(
        String(50),
        nullable=False
    )


    tipo_secundario = Column(
        String(50),
        nullable=True
    )


    favorito = Column(
        Boolean,
        default=False,
        nullable=False
    )


    criado_em = Column(
        DateTime,
        server_default=func.now(),
        nullable=False
    )
