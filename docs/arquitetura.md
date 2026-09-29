# Pokédex API

## 1. Visão Geral

A **Pokédex API** é uma aplicação didática desenvolvida para demonstrar, de forma integrada, os principais conceitos envolvidos na arquitetura e no desenvolvimento de APIs.

A aplicação permitirá pesquisar Pokémon utilizando dados fornecidos pela **PokéAPI** e manter uma Pokédex própria, persistida em banco de dados.

O projeto será composto por:

- Frontend em HTML, CSS e JavaScript;
- Backend desenvolvido com Python e FastAPI;
- Consumo da PokéAPI;
- API REST própria;
- Persistência em banco de dados MySQL;
- ORM utilizando SQLAlchemy;
- Validação de dados com Pydantic;
- Configuração de CORS;
- Documentação OpenAPI/Swagger;
- Versionamento com Git e GitHub.

---

# 2. Objetivos do Projeto

O projeto tem como objetivo demonstrar a diferença entre:

**Consumir uma API externa**

e

**Desenvolver e disponibilizar uma API própria.**

A PokéAPI será utilizada como fonte externa de informações sobre Pokémon.

Nossa API será responsável por gerenciar os dados pertencentes à aplicação, permitindo cadastrar, consultar, atualizar e excluir Pokémon da Pokédex pessoal.

Ao final do projeto deverão estar presentes:

- [ ] Consumo de API externa;
- [ ] Desenvolvimento de API própria;
- [ ] Persistência de dados;
- [ ] ORM;
- [ ] GET;
- [ ] POST;
- [ ] PATCH;
- [ ] DELETE;
- [ ] CORS;
- [ ] Documentação da API.

---

# 3. Arquitetura Geral

A aplicação utilizará quatro componentes principais:

```text
┌──────────────────────────────┐
│           FRONTEND           │
│      HTML + CSS + JS         │
│                              │
│ Pesquisa / Cards / Ações     │
└──────────────┬───────────────┘
               │
               │ HTTP
               ▼
┌──────────────────────────────┐
│          NOSSA API           │
│           FastAPI            │
│                              │
│ GET /externo/pokemon         │
│ GET /pokemons                │
│ POST /pokemons               │
│ PATCH /pokemons/{id}         │
│ DELETE /pokemons/{id}        │
└───────────┬──────────┬───────┘
            │          │
            │          │ SQLAlchemy
            ▼          ▼
┌──────────────────┐ ┌──────────────────┐
│     PokéAPI      │ │      MySQL       │
│                  │ │                  │
│ Dados externos   │ │ Dados da nossa   │
│ Somente leitura  │ │ aplicação        │
└──────────────────┘ └──────────────────┘
```

O frontend **não acessará diretamente a PokéAPI**.

Todas as requisições serão intermediadas pelo nosso backend.

Portanto:

```text
Frontend
    ↓
FastAPI
    ↓
PokéAPI
```

ou:

```text
Frontend
    ↓
FastAPI
    ↓
SQLAlchemy
    ↓
MySQL
```

---

# 4. Responsabilidades

## 4.1 Frontend

O frontend será responsável pela interação com o usuário.

Deverá permitir:

- Pesquisar Pokémon;
- Escolher entre pesquisa externa e pesquisa local;
- Visualizar os Pokémon utilizando cards;
- Adicionar um Pokémon à Pokédex;
- Favoritar ou desfavoritar Pokémon;
- Excluir Pokémon cadastrados;
- Exibir feedback das operações realizadas.

O frontend não deverá acessar diretamente o banco de dados.

---

## 4.2 Backend

O backend será responsável pela lógica da aplicação.

Será desenvolvido utilizando **FastAPI**.

Suas responsabilidades incluem:

- Receber requisições do frontend;
- Consultar a PokéAPI;
- Validar dados utilizando Pydantic;
- Executar operações no banco utilizando SQLAlchemy;
- Disponibilizar endpoints REST;
- Aplicar regras da aplicação;
- Configurar CORS;
- Retornar respostas HTTP adequadas;
- Gerar documentação OpenAPI.

---

## 4.3 PokéAPI

A PokéAPI será nossa fonte externa de informações.

Ela fornecerá informações como:

- Número do Pokémon;
- Nome;
- Tipos;
- Sprite/imagem.

Esses dados não serão alterados pela nossa aplicação.

---

## 4.4 Banco de Dados

O MySQL será responsável pela persistência dos Pokémon adicionados à Pokédex.

O acesso ao banco será realizado através do ORM SQLAlchemy.

A aplicação não deverá utilizar comandos SQL diretamente em seus endpoints.

---

# 5. Pesquisa

A interface permitirá selecionar a origem da pesquisa.

Exemplo:

```text
Pesquisar Pokémon

[ Pikachu________________________ ]

Fonte:

[ PokéAPI ▼ ]
```

As opções serão:

```text
PokéAPI
Minha Pokédex
```

---

## 5.1 Pesquisa externa

Ao selecionar:

```text
PokéAPI
```

a aplicação pesquisará Pokémon utilizando a API externa.

Fluxo:

```text
Usuário
   ↓
Frontend
   ↓
Nossa API
   ↓
PokéAPI
   ↓
Nossa API
   ↓
Frontend
```

Os resultados ainda **não pertencem à nossa Pokédex**.

---

## 5.2 Pesquisa local

Ao selecionar:

```text
Minha Pokédex
```

a aplicação pesquisará apenas os Pokémon previamente cadastrados.

Fluxo:

```text
Usuário
   ↓
Frontend
   ↓
Nossa API
   ↓
SQLAlchemy
   ↓
MySQL
```

---

# 6. Cards de Pokémon

Os resultados serão apresentados utilizando cards.

Exemplo:

```text
┌──────────────────────┐
│                      │
│       [sprite]       │
│                      │
│        #0025         │
│       Pikachu        │
│                      │
│       Electric       │
│                      │
└──────────────────────┘
```

Ao passar o mouse sobre o card, serão apresentadas ações disponíveis.

---

## 6.1 Card proveniente da PokéAPI

Um Pokémon que ainda não pertence à Pokédex apresentará:

```text
┌──────────────────────┐
│                   +  │
│                      │
│       [sprite]       │
│                      │
│        #0025         │
│       Pikachu        │
│       Electric       │
└──────────────────────┘
```

O botão:

```text
+
```

representa:

**Adicionar à minha Pokédex.**

Essa ação executará um `POST`.

---

## 6.2 Card da Minha Pokédex

Quando o Pokémon já estiver cadastrado:

```text
┌──────────────────────┐
│                ☆     │
│                      │
│       [sprite]       │
│                      │
│        #0025         │
│       Pikachu        │
│       Electric       │
│                      │
│                  🗑  │
└──────────────────────┘
```

As ações serão:

```text
☆ Favoritar

★ Desfavoritar

🗑 Excluir
```

Favoritar/desfavoritar utilizará `PATCH`.

Excluir utilizará `DELETE`.

---

# 7. Modelo Inicial de Dados

Inicialmente será utilizada uma tabela:

## pokemon

| Campo | Tipo | Descrição |
|---|---|---|
| id | INT | Identificador interno |
| pokeapi_id | INT | Identificador na PokéAPI |
| nome | VARCHAR | Nome do Pokémon |
| numero | INT | Número da Pokédex |
| sprite_url | VARCHAR | URL da imagem |
| tipo_primario | VARCHAR | Tipo principal |
| tipo_secundario | VARCHAR / NULL | Segundo tipo |
| favorito | BOOLEAN | Pokémon favorito |
| criado_em | DATETIME | Data do cadastro |

É importante diferenciar:

```text
pokeapi_id
```

Identifica o Pokémon na API externa.

Enquanto:

```text
id
```

identifica o registro dentro da **nossa aplicação**.

---

# 8. Endpoints Planejados

## API externa

### Pesquisar Pokémon

```http
GET /externo/pokemon/{nome}
```

Responsável por consultar a PokéAPI.

---

# Nossa Pokédex

## Listar Pokémon

```http
GET /pokemons
```

Retorna Pokémon cadastrados.

Poderá posteriormente aceitar filtros:

```http
GET /pokemons?nome=pika
```

---

## Buscar Pokémon específico

```http
GET /pokemons/{id}
```

---

## Adicionar Pokémon

```http
POST /pokemons
```

Exemplo:

```json
{
    "pokeapi_id": 25,
    "nome": "pikachu",
    "numero": 25,
    "sprite_url": "...",
    "tipo_primario": "electric",
    "tipo_secundario": null
}
```

---

## Atualizar Pokémon

```http
PATCH /pokemons/{id}
```

Inicialmente será utilizado para alterar o status de favorito.

Exemplo:

```json
{
    "favorito": true
}
```

---

## Excluir Pokémon

```http
DELETE /pokemons/{id}
```

Remove o Pokémon da Pokédex local.

Essa operação **não remove o Pokémon da PokéAPI**.

---

# 9. Verbos HTTP

Cada verbo terá uma responsabilidade clara no projeto.

| Verbo | Utilização |
|---|---|
| GET | Consultar Pokémon |
| POST | Adicionar Pokémon |
| PATCH | Favoritar/desfavoritar |
| DELETE | Remover Pokémon |

Isso permitirá demonstrar operações CRUD utilizando uma API REST.

---

# 10. ORM

O projeto utilizará **SQLAlchemy**.

O ORM será responsável pelo mapeamento entre:

```text
Objeto Python
      ↕
SQLAlchemy
      ↕
Tabela MySQL
```

O model `Pokemon` representará a tabela `pokemon`.

Isso permitirá trabalhar operações como:

```python
db.add()
db.commit()
db.refresh()
db.query()
db.delete()
```

sem escrever SQL diretamente nos endpoints.

---

# 11. Schemas

Os schemas serão implementados utilizando **Pydantic**.

Inicialmente serão necessários schemas para diferentes responsabilidades, por exemplo:

```text
PokemonCreate
PokemonUpdate
PokemonResponse
```

Isso permitirá discutir por que **Model do banco e Schema da API não representam necessariamente a mesma coisa**.

---

# 12. CORS

Frontend e backend serão executados separadamente.

Exemplo:

```text
Frontend
http://localhost:5500
```

```text
Backend
http://localhost:8000
```

Por serem origens diferentes, será necessário configurar CORS no backend.

A configuração deverá autorizar explicitamente o frontend utilizado durante o desenvolvimento.

O projeto evitará utilizar indiscriminadamente:

```python
allow_origins=["*"]
```

para demonstrar uma configuração mais controlada.

---

# 13. Documentação

A documentação será gerada inicialmente através do OpenAPI disponibilizado pelo FastAPI.

Durante o desenvolvimento serão configurados:

- Título da API;
- Descrição;
- Versão;
- Tags;
- Descrição dos endpoints;
- Schemas;
- Exemplos;
- Status HTTP;
- Mensagens de erro.

A documentação poderá ser acessada através de:

```text
/docs
```

A intenção não será apenas possuir documentação automática, mas organizá-la para que seja compreensível para outro desenvolvedor que queira consumir nossa API.

---

# 14. Tratamento de Erros

A aplicação deverá considerar situações como:

```text
Pokémon não encontrado na PokéAPI

Pokémon já cadastrado

Pokémon não encontrado no banco

Falha na comunicação com API externa

Dados inválidos

Falha de conexão com banco
```

Os endpoints deverão retornar códigos HTTP adequados para cada situação.

Exemplos:

```text
200 OK
201 Created
204 No Content
400 Bad Request
404 Not Found
409 Conflict
422 Unprocessable Entity
500 Internal Server Error
```

---

# 15. Estrutura Inicial Planejada

```text
pokedex-api/
│
├── backend/
│   ├── main.py
│   ├── database.py
│   ├── models.py
│   ├── schemas.py
│   └── requirements.txt
│
├── frontend/
│   ├── index.html
│   │
│   ├── css/
│   │   └── style.css
│   │
│   └── js/
│       └── app.js
│
├── docs/
│   └── arquitetura.md
│
├── .gitignore
├── README.md
└── LICENSE
```

Essa estrutura poderá evoluir conforme a aplicação crescer.

---

# 16. Estratégia de Desenvolvimento

O projeto será desenvolvido incrementalmente.

## Etapa 0 — Arquitetura

Definir:

- Problema;
- Tecnologias;
- Arquitetura;
- Responsabilidades;
- Modelo de dados;
- Endpoints;
- Fluxos.

## Etapa 1 — Frontend

Construir:

- Layout;
- Barra de pesquisa;
- Seletor de fonte;
- Cards;
- Hover;
- Botões;
- Feedback visual.

Inicialmente algumas ações poderão ser simuladas.

## Etapa 2 — Consumo da PokéAPI

Implementar:

```text
Frontend
   ↓
FastAPI
   ↓
PokéAPI
```

## Etapa 3 — Persistência

Configurar:

```text
MySQL
SQLAlchemy
Models
Schemas
```

## Etapa 4 — CRUD

Implementar:

```text
GET
POST
PATCH
DELETE
```

## Etapa 5 — Integração

Conectar completamente:

```text
Frontend
+
Backend
+
PokéAPI
+
MySQL
```

## Etapa 6 — CORS

Demonstrar o problema entre origens diferentes e configurar as origens permitidas.

## Etapa 7 — Documentação

Organizar e melhorar a documentação OpenAPI/Swagger.

---

# 17. Resultado Esperado

Ao final, o projeto deverá permitir o seguinte fluxo:

```text
Pesquisar "Pikachu"
        ↓
Consultar PokéAPI
        ↓
Visualizar card
        ↓
Adicionar à Pokédex
        ↓
POST
        ↓
SQLAlchemy
        ↓
MySQL
        ↓
Pesquisar "Pikachu"
em "Minha Pokédex"
        ↓
GET
        ↓
Favoritar
        ↓
PATCH
        ↓
Excluir
        ↓
DELETE
```

O projeto servirá como demonstração completa dos principais conceitos estudados na disciplina de **Arquitetura e Desenvolvimento de APIs**.
