# 🚀 Guia Prático: Prisma ORM v7 + Node.js (CommonJS) + MySQL

Este guia apresenta o passo a passo completo para configurar e utilizar o **Prisma ORM v7** em uma API construída com **Node.js, Express e JavaScript puro (`require`)**, conectada a um banco de dados **MySQL**.

---

## 📋 Pré-requisitos

* **Node.js** instalado (versão 20 LTS ou superior).
* **Servidor MySQL** ativo na máquina (XAMPP, WampServer, Laragon ou MySQL Installer).
* Projeto Express base já estruturado (`src/routes`, `src/controllers`, `src/models`).

---

## 1️⃣ Instalação e Inicialização

Na raiz do projeto, execute os comandos abaixo no terminal:

```bash
# 1. Instala a CLI do Prisma v7 como dependência de desenvolvimento
npm install prisma@7 --save-dev

# 2. Instala o Cliente Prisma, o adaptador oficial para MySQL e o dotenv
npm install @prisma/client@7 @prisma/adapter-mariadb dotenv

# 3. Inicializa a estrutura do Prisma configurada para MySQL
npx prisma init --datasource-provider mysql
```

> ⚠️ **Atenção:** Sempre especifique `@7` na instalação para evitar baixar versões experimentais ou incompatíveis com este roteiro.

---

## 2️⃣ Arquivos Gerados Automaticamente

O comando `npx prisma init` cria **3 itens** na raiz do seu projeto:

1. **`.env`**: Arquivo para armazenar a string de conexão com o banco de dados.
2. **`prisma.config.ts`**: Arquivo de configuração utilizado pela CLI do Prisma.
3. **`prisma/schema.prisma`**: Arquivo onde desenhamos as tabelas (`models`) do banco.

---

## 3️⃣ Configuração Passo a Passo (Antes de criar o banco)

Siga esta ordem exata para ajustar os arquivos gerados e criar os arquivos de conexão da API:

### Passo A: Configurar a conexão no `.env`
Abra o arquivo **`.env`** na raiz e informe os dados de acesso ao seu MySQL local (no ambiente padrão de laboratório, o usuário é `root` sem senha):

```env
DATABASE_URL="mysql://root:@localhost:3306/loja"
```

---

### Passo B: Ajustar o `prisma.config.js` para JavaScript (`require`)
Renomeie o arquivo gerado `prisma.config.ts` para **`prisma.config.js`** e substitua seu conteúdo por:

```javascript
require('dotenv').config();
const { defineConfig, env } = require('prisma/config');

module.exports = defineConfig({
  schema: 'prisma/schema.prisma',
  migrations: {
    path: 'prisma/migrations',
  },
  datasource: {
    url: env('DATABASE_URL'),
  },
});
```

---

### Passo C: Definir as tabelas no `prisma/schema.prisma`
Abra **`prisma/schema.prisma`**, configure o `generator` com **`provider = "prisma-client-js"`** (obrigatório para gerar código JavaScript puro compatível com `require`) e crie o modelo `Produto`:

```prisma
generator client {
  provider = "prisma-client-js"
  output   = "../src/generated/prisma"
}

datasource db {
  provider = "mysql"
}

model Produto {
  id           Int      @id @default(autoincrement())
  codigo       Int      @unique
  nome         String
  quantidade   Int
  preco        Decimal  @db.Decimal(10, 2)
  total        Decimal  @db.Decimal(10, 2)
  criadoEm     DateTime @default(now())
  atualizadoEm DateTime @updatedAt

  @@map("produtos")
}
```
### Passo C1: após a mudança do arquivo `prisma.config.js` e na linha provider para `prisma-client-js` é necessário instalar 
```bash
npm install @prisma/client-runtime-utils@7
```


> 💡 **Dica de organização (Schemas separados):** Caso o projeto cresça e você queira separar cada tabela em um arquivo `.prisma` próprio (ex: `prisma/schema/usuario.prisma` e `prisma/schema/produto.prisma`), basta alterar `schema: 'prisma/schema'` no `prisma.config.js` e ajustar o `output` para `"../../src/generated/prisma"`.

---

### Passo D: Criar o arquivo de conexão (`database/prisma.js`)
Crie manualmente a pasta `database` na raiz (se ainda não existir) e o arquivo **`database/prisma.js`**. Ele será responsável por abrir uma única conexão (pool) com o MySQL para toda a aplicação:

```javascript
require('dotenv').config();
const { PrismaClient } = require('../src/generated/prisma');
const { PrismaMariaDb } = require('@prisma/adapter-mariadb');

const adapter = new PrismaMariaDb(process.env.DATABASE_URL);
const prisma = new PrismaClient({ adapter });

module.exports = prisma;
```

---

### Passo E: Criar a Model Estática (`src/models/produtoModel.js`)
Crie ou atualize o arquivo **`src/models/produtoModel.js`** exportando o delegado do Prisma correspondente ao modelo `Produto`:

```javascript
const prisma = require('../../database/prisma');

// Expõe os métodos do Prisma (findMany, create, update, delete, etc.)
const ProdutoModel = prisma.produto;

module.exports = ProdutoModel;
```

---

### Passo F: Ignorar arquivos gerados no Git (`.gitignore`)
Adicione a pasta gerada pelo Prisma ao seu arquivo **`.gitignore`** na raiz do projeto para não enviar código compilado localmente para o GitHub:

```gitignore
src/generated/
.agents/
.claude/
.windsurf/
skills-lock.json
```

---

## 4️⃣ Criando o Banco de Dados, Tabelas e Cliente JS

Com o servidor MySQL ligado e os arquivos acima salvos, execute os dois comandos abaixo no terminal:

```bash
# 1. Cria o banco de dados e aplica as tabelas no MySQL
npx prisma migrate dev --name init

# 2. Gera o cliente JavaScript na pasta src/generated/prisma
npx prisma generate
```

### O que esses comandos fazem?
1. Criam o banco de dados `loja` no MySQL automaticamente.
2. Geram o histórico SQL dentro da pasta `prisma/migrations/`.
3. Criam a tabela `produtos` no MySQL.
4. Geram o cliente JavaScript puro na pasta `src/generated/prisma` para ser importado pelo `database/prisma.js`.

---

## 5️⃣ Testando a Conexão na Inicialização (`src/server.js`)

Por padrão, o Prisma só abre a conexão física com o MySQL quando a primeira requisição HTTP chega. Para validar se o banco está ligado assim que o servidor iniciar (*Fail-Fast*), utilize o `prisma.$connect()` no **`src/server.js`**:

```javascript
require('dotenv').config();
const express = require('express');
const routes = require('./routes');
const prisma = require('../database/prisma');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());
app.use(routes);

app.listen(PORT, async () => {
  console.log(`🚀 Servidor rodando na porta ${PORT}`);

  try {
    await prisma.$connect();
    console.log('🗄️  Conectado ao banco de dados MySQL com sucesso!');
  } catch (error) {
    console.error('❌ Falha ao conectar no MySQL. Verifique se o serviço está ligado!');
    console.error(error.message);
  }
});
```
---

## 6️⃣ Manutenção e Comandos Úteis do Dia a Dia

* **Alterei o `schema.prisma` (adicionei campo ou nova tabela):**
  Rode os dois comandos abaixo para atualizar o MySQL e o cliente JavaScript:
  ```bash
  npx prisma migrate dev --name descricao_da_alteracao
  npx prisma generate
  ```

* **Clonei o projeto do GitHub em outra máquina:**
  Para instalar as dependências, aplicar as migrations existentes e gerar o cliente localmente:
  ```bash
  npm install
  npx prisma migrate deploy
  npx prisma generate
  ```

* **Visualizar e editar dados pelo navegador (Prisma Studio):**
  Abre um painel visual em `http://localhost:5555` para inspecionar as tabelas do MySQL:
  ```bash
  npx prisma studio
  ```
