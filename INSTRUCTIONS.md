# Arquivo de intruções

Neste arquivo você encontrará a estrutura de pastas do projeto as instruções para subir o banco de dados com Docker, executar migrations e rodar seeds.

### 📁 Estrutura dos Diretórios do projeto (pastas) 
```
📦 Meu-REPOSITÓRIO
│
├── package.json
├── package-lock.json
├── .gitignore
├── server.js
├── .env
├── knexfile.js
├── INSTRUCTIONS.md
├── docker-compose.yml
│
├── db/
│ ├── migrations/
│ │ └──20250809203342_solution_migrations.js
│ │ └──20250810210628_create_agentes.js
│ │ └──20250810213103_create_casos.js
│ ├── seeds/
│ │ └──agentes.js
│ │ └──casos.js
│ │ └──20250810213103_create_casos.js
│ │
│ └── db.js
│
├── routes/
│ ├── agentesRoutes.js
│ └── casosRoutes.js
│
├── controllers/
│ ├── agentesController.js
│ └── casosController.js
│
├── repositories/
│ ├── agentesRepository.js
│ └── casosRepository.js
│
├── utils/
│ └── errorHandler.js
| └── validateSchema.js
| └── ZodSchemas.js
│
├── docs/
│   └── swagger.js
│
```

## Subir o banco com Docker

Este projeto possui um arquivo `docker-compose.yml` na raiz. Seu conteúdo é:

```yaml
services:
    postgres-database:
        container_name: postgres-database
        image: postgres:17
        restart: unless-stopped
        environment:
            POSTGRES_USER: ${POSTGRES_USER}
            POSTGRES_PASSWORD: ${POSTGRES_PASSWORD}
            POSTGRES_DB: ${POSTGRES_DB}
        ports:
            - "5432:5432"
        volumes:
            - postgres-data:/var/lib/postgresql/data

volumes:
    postgres-data:
```

Para subir o banco, execute o comando correspondente ao seu sistema operacional no terminal:

**Windows**
```sh
docker compose up -d
```

**Linux**
```sh
sudo docker compose up -d
```

Caso seja utilizado outras versões do docker talvez seja necessário acrescentar um " - "(hífen) entre os comandos de docker e composer, como exemplificado a baixo: 

**Windows**
```sh
docker-compose up -d
```

**Linux**
```sh
sudo docker-compose up -d
```

### Executar migrations

Esse projeto possui 3 arquivos de migrations, 20250809203342_solution_migrations.js, 20250809194946_create_casos.js e 20250809194946_create_casos.js.
No qual, 20250809194931_create_agentes.js serve para definir as migrações da tabela que conterá os dados dos agentes, e por sua vez 20250809194946_create_casos.js, para definir as migrações da tabela que conterá os dados dos casos. Já 20250809203342_solution_migrations.js serve para chamar as duas migrações definidas anteriormente em uma só.

As migrações podem ser executas com o comando a baixo:

Para executar todas as migrações:
```sh
 npx knext migrate:latest 
```

Ou para executar uma migração em especifico, como no caso somente a 20250809203342_solution_migrations.js:
```sh
 npx knex migrate:up 20250809203342_solution_migrations.js
```

Conteúdo:
```js
const migrationsAgentes = require("./20250810210628_create_agentes");
const migrationsCasos = require("./20250810213103_create_casos");

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = async function (knex) {
  await migrationsAgentes.up(knex);
  await migrationsCasos.up(knex);
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function (knex) {
  knex.schema
    .dropTableIfExists("agentes")
    .then(() => knex.schema.dropTableIfExists("casos"));
};

```

ou cada uma delas separadamente, como no caso da tabela agentes:
```sh
 npx knex migrate:up 20250810210628_create_agentes.js
```

Conteúdo:
```js
/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function (knex) {
  return knex.schema.dropTableIfExists("agentes").then(() => {
    return knex.schema.createTable("agentes", (table) => {
      table.increments("id").primary();
      table.string("nome").notNullable();
      table.date("dataDeIncorporacao").notNullable();
      table.string("cargo").notNullable();
    });
  });
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function (knex) {
  return knex.schema.alterTable("casos", (table) => {
    table.dropForeign("agente_id");
    table.dropColumn("agente_id");
    return knex.schema.dropTable("agentes");
  });
};
```

E para a tabela casos: 
```sh
 npx knex migrate:up 20250810213103_create_casos.js
```

Conteúdo:
```js
/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function (knex) {
  //DROP TABLE IF EXISTS casos;
  return knex.schema.dropTableIfExists("casos").then(() => {
    return knex.schema.createTable("casos", (table) => {
      table.increments("id").primary();
      table.string("titulo").notNullable();
      table.string("descricao").notNullable();
      table.enum("status", ["aberto", "solucionado"]).notNullable();
      table
        .integer("agente_id")
        .references("id")
        .inTable("agentes")
        .onDelete("CASCADE")
        .onUpdate("CASCADE")
        .notNullable();
    });
  });
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function (knex) {
  return knex.schema.dropTable("casos");
};
```

OBS: Recomendo excetuar apenas a migração de 20250809203342_solution_migrations.js, pois ela já executa as duas migrações necessárias na ordem correta, ou seja, agentes e posteriormente casos.

### Rodar seeds

Para executar as seeds, também primeiramente é necessário saber que possui-se 3 arquivos de seeds agentes.js, casos.js e solution_migrations.js
No qual, agentes.js serve para definir as seeds, ou seja, os dados iniciais da tabela que conterá os dados dos agentes, e por sua vez casos.js, para definir as seeds da tabela que conterá os dados dos casos. Já solution_migrations.js serve para chamar as duas seeds definidas anteriormente em uma só.

As seeds podem ser executas com o comando a baixo:

Para executar todas as migrações:
```sh
 npx knex seed:run 
```

Ou para executar uma seed em especifico, como no caso somente a solution_migrations.js:
```sh 
 npx knex seed:run --specific=solution_migrations.js
```

ou cada uma delas separadamente, como no caso da tabela agentes:
```sh 
 npx knex seed:run --specific=agentes.js
```

E para a tabela casos: 
```sh 
 npx knex seed:run --specific=casos.js
```

## 🔒 Autenticação no Projeto

O projeto utiliza **JWT (JSON Web Token)** para autenticar usuários e proteger todas as rotas da API.

### Como funciona

1. **Login**

   * O usuário envia **email** e **senha** para a rota de login.
   * O servidor valida os dados.
   * Se estiverem corretos, um **token JWT** é gerado e retornado na resposta.
   * Exemplo de resposta:

     ```json
     {
       "acess_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
     }
     ```

2. **Acesso às rotas protegidas**

   * As rotas de /casos e /agentes exigem autenticação verificam a presença do **token** no cabeçalho HTTP:

     ```
     Authorization: Bearer <TOKEN>
     ```
   * Se o token for válido, o usuário pode acessar a rota.
   * Se o token estiver ausente ou inválido, a API retorna **401 Unauthorized**.

3. **Middleware de autenticação**

   * O projeto utiliza um middleware (por exemplo `authMiddleware.js`) que:

     * Lê o token do cabeçalho `Authorization`.
     * Decodifica o token e valida sua assinatura.
     * Coloca as informações do usuário autenticado (`id`, `nome`, `email`) no objeto `req.user` para uso nos controllers.

4. **Swagger**

   * Para acessar a documentação (`/docs`) com rotas autenticadas, é necessário incluir o token no Swagger.
   * No Swagger, há um esquema `bearerAuth` que exige inserir o JWT em todas as requisições protegidas.

### Exemplo de uso

* **Login:**

  ```http
  POST /login
  Content-Type: application/json

  {
    "email": "usuario@email.com",
    "senha": "Senha123"
  }
  ```

* **Requisição a rota protegida:**

  ```http
  GET /casos
  Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
  ```

* **Resposta se token válido:**

  ```json
  [
    {
      "id": 1,
      "titulo": "Roubo no centro",
      "descricao": "Descrição do caso",
      "status": "aberto",
      "agente_id": 2
    }
  ]
  ```

* **Resposta se token inválido:**

  ```json
  {
    "error": "Token inválido ou expirado"
  }
  ```
