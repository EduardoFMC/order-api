# Order API

API REST para gerenciamento de pedidos, desenvolvida com Node.js e PostgreSQL.

## Tecnologias
- Node.js + Express
- PostgreSQL
- JWT (autenticação)
- Swagger (documentação)

---

## Setup

### 1. Clone e instale as dependências
```bash
npm install
```

### 2. Configure o banco de dados PostgreSQL
```sql
-- No psql ou pgAdmin, crie o banco:
CREATE DATABASE order_db;
```

### 3. Configure o .env
```bash
cp .env.example .env
# Edite o .env com suas credenciais do PostgreSQL
```

### 4. Rode a API
```bash
# Desenvolvimento (com hot reload)
npm run dev

# Produção
npm start
```

A API estará disponível em `http://localhost:3000`  
A documentação Swagger em `http://localhost:3000/docs`

---

## Autenticação

Todas as rotas de pedido exigem um token JWT.

### 1. Gerar token
```bash
curl -X POST http://localhost:3000/auth/token \
  -H "Content-Type: application/json" \
  -d '{"username": "admin", "password": "admin123"}'
```

### 2. Usar o token nas requisições
```
Authorization: Bearer <seu_token>
```

---

## Endpoints

| Método | URL | Descrição |
|--------|-----|-----------|
| POST | /auth/token | Gera token JWT |
| POST | /order | Cria pedido |
| GET | /order/list | Lista todos os pedidos |
| GET | /order/:orderId | Busca pedido por ID |
| PUT | /order/:orderId | Atualiza pedido |
| DELETE | /order/:orderId | Deleta pedido |

---

## Exemplo de uso

### Criar pedido
```bash
curl -X POST http://localhost:3000/order \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer <token>" \
  -d '{
    "numeroPedido": "v10089015vdb-01",
    "valorTotal": 10000,
    "dataCriacao": "2023-07-19T12:24:11.529Z",
    "items": [
      { "idItem": "2434", "quantidadeItem": 1, "valorItem": 1000 }
    ]
  }'
```
