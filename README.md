# Product Management API (PERN Stack)

## Description

REST API for managing products, built with **Node.js, Express 5, TypeScript, Sequelize and PostgreSQL**. It is the backend of a PERN (PostgreSQL, Express, React, Node) product management application and exposes full CRUD operations plus a dedicated endpoint to toggle product availability.

The API is versioned (`/api/v1`), validates every incoming request, restricts access to a single allowed frontend origin through CORS, documents itself with Swagger/OpenAPI, and ships with an integration test suite built on Jest and Supertest.

## Table of Contents

- [Description](#description)
- [Swagger](#swagger)
- [Features](#features)
- [Tech Stack](#tech-stack)
- [Project Structure](#project-structure)
- [State Management](#state-management)
- [Data Fetching and Validation](#data-fetching-and-validation)
- [Routes](#routes)

## Swagger

Interactive API documentation is generated from JSDoc `@swagger` annotations located in `src/router.ts` and served with `swagger-ui-express`.

- **URL:** `http://localhost:4000/docs`
- **OpenAPI version:** 3.0.2
- **Tag:** `Products`
- **Custom UI:** branded top bar logo and custom page title (see `src/config/swagger.ts`)

The documentation includes the reusable `Product` schema, request bodies, path parameters and the possible `200`, `201`, `400` and `404` responses for every endpoint.

## Features

- Full CRUD for products (create, read, update, delete)
- `PATCH` endpoint to toggle product availability
- Products listed newest first (ordered by `id DESC`)
- Request validation with `express-validator` and a centralized error-handling middleware
- CORS restricted to the origin defined in `FRONTEND_URL`
- HTTP request logging with Morgan (`dev` format)
- Auto-generated, interactive Swagger documentation
- Automatic table creation/sync on startup via Sequelize
- Integration tests with Jest and Supertest, including coverage reporting
- Strongly typed models using `sequelize-typescript` decorators

## Tech Stack

| Area | Technology |
| --- | --- |
| Runtime | Node.js |
| Language | TypeScript 5 |
| Framework | Express 5 |
| Database | PostgreSQL (`pg`, `pg-hstore`) |
| ORM | Sequelize 6 + `sequelize-typescript` |
| Validation | `express-validator` |
| Documentation | `swagger-jsdoc`, `swagger-ui-express` |
| Security / Middleware | `cors`, `morgan` |
| Configuration | `dotenv` |
| Testing | Jest, ts-jest, Supertest |
| Tooling | ts-node, nodemon |

### Environment variables

Create a `.env` file in the project root:

```env
DATABASE_URL=postgres://user:password@localhost:5432/your_database
FRONTEND_URL=http://localhost:5173
PORT=4000
```

### Scripts

| Script | Description |
| --- | --- |
| `npm run dev` | Start the server with nodemon and ts-node |
| `npm run build` | Compile TypeScript to `./dist` |
| `npm test` | Run the Jest suite (`pretest` first wipes the database) |
| `npm run test:coverage` | Run the tests with a coverage report |

> **Warning:** `pretest` runs `ts-node ./src/data --clear`, which calls `db.sync({ force: true })` and **drops and recreates all tables**. Use a dedicated test database.

## Project Structure

```
.
├── src
│   ├── __tests__
│   │   └── server.test.ts          # Database connection error test
│   ├── config
│   │   ├── db.ts                   # Sequelize instance and PostgreSQL connection
│   │   └── swagger.ts              # Swagger/OpenAPI configuration and UI options
│   ├── controllers
│   │   ├── __tests__
│   │   │   └── product.test.ts     # Integration tests for the product endpoints
│   │   └── Product.controller.ts   # Request handlers (business logic)
│   ├── data
│   │   └── index.ts                # CLI script to clear the database (--clear)
│   ├── middlewares
│   │   └── index.ts                # handleInputErrors validation middleware
│   ├── models
│   │   └── Product.model.ts        # Product Sequelize model
│   ├── index.ts                    # Entry point: connects to the DB and starts the server
│   ├── router.ts                   # Route definitions, validation chains and Swagger docs
│   └── server.ts                   # Express app, CORS, middlewares and connectDB()
├── jest.config.js
├── tsconfig.json
├── package.json
└── .gitignore
```

## Data Fetching and Validation

### Data access

All database access goes through Sequelize model methods in `Product.controller.ts`:

| Operation | Sequelize method |
| --- | --- |
| List products | `Product.findAll({ order: [['id', 'DESC']] })` |
| Get by ID | `Product.findByPk(id)` |
| Create | `Product.create(req.body)` |
| Update | `product.update(req.body)` + `product.save()` |
| Toggle availability | `product.save()` after negating `availability` |
| Delete (hard delete) | `product.destroy()` |

Every successful response wraps its payload in a `data` key, and not-found errors use an `error` key:

```json
{ "data": { "id": 1, "name": "Alienware Monitor", "price": 600, "availability": true } }
```

```json
{ "error": "Product not found" }
```

### Validation

Validation is declared per route in `src/router.ts` using `express-validator` and evaluated by the `handleInputErrors` middleware, which returns `400 Bad Request` with an `errors` array when any rule fails.

| Endpoint | Rules |
| --- | --- |
| `GET /:id`, `PATCH /:id`, `DELETE /:id` | `id` must be an integer (`Invalid product id`) |
| `POST /` | `name` is required; `price` is required, numeric and greater than 0 |
| `PUT /:id` | `id` must be an integer; `name` is required; `price` is required, numeric and greater than 0; `availability` must be a boolean |

Example `400` response:

```json
{
  "errors": [
    { "type": "field", "msg": "Name is required", "path": "name", "location": "body" }
  ]
}
```

### CORS

Only requests whose `Origin` matches `process.env.FRONTEND_URL` are accepted; any other origin triggers a CORS error.

## Routes

Base URL: `http://localhost:4000`

| Method | Endpoint | Description | Success | Errors |
| --- | --- | --- | --- | --- |
| `GET` | `/api/v1/products` | List all products (newest first) | `200` | — |
| `GET` | `/api/v1/products/:id` | Get a product by ID | `200` | `400`, `404` |
| `POST` | `/api/v1/products` | Create a new product | `201` | `400` |
| `PUT` | `/api/v1/products/:id` | Update a product (full update) | `200` | `400`, `404` |
| `PATCH` | `/api/v1/products/:id` | Toggle product availability | `200` | `400`, `404` |
| `DELETE` | `/api/v1/products/:id` | Delete a product (hard delete) | `200` | `400`, `404` |
| `GET` | `/docs` | Swagger UI documentation | `200` | — |

### Request examples

**Create a product**

```http
POST /api/v1/products
Content-Type: application/json

{
  "name": "Razer Tournament Edition keyboard",
  "price": 180
}
```

**Update a product**

```http
PUT /api/v1/products/1
Content-Type: application/json

{
  "name": "Alienware Monitor 49 Oled",
  "price": 600,
  "availability": true
}
```

**Toggle availability**

```http
PATCH /api/v1/products/1
```

**Delete a product**

```http
DELETE /api/v1/products/1
```

Response: `{ "data": "Product deleted successfully" }`

---

**Author:** Heber Martin Rodriguez · **License:** ISC
