from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker, declarative_base


# URL de conexão com o banco.
#
# Estrutura:
# mysql+pymysql://usuario:senha@servidor/banco
DATABASE_URL = "mysql+pymysql://root:root@localhost/pokedex"


# Engine representa a conexão do SQLAlchemy
# com o banco de dados.
engine = create_engine(DATABASE_URL)


# SessionLocal será utilizada para criar sessões
# de comunicação com o banco.
SessionLocal = sessionmaker(
    autocommit=False,
    autoflush=False,
    bind=engine
)


# Base será utilizada pelos nossos Models.
# Toda classe que representar uma tabela herdará dela.
Base = declarative_base()

def get_db():

    db = SessionLocal()

    try:
        yield db

    finally:
        db.close()