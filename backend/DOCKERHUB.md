# inventory-backend

Backend API for the **StockFlow** Inventory & Order Management System.

Built with **Python 3.11 + FastAPI + SQLAlchemy + PostgreSQL**.

## Quick Start

```bash
docker pull tejsvibhat/inventory-backend:latest

docker run -p 8000:8000 \
  -e DATABASE_URL=postgresql://user:pass@host:5432/dbname \
  -e ALLOWED_ORIGINS=http://localhost:3000 \
  tejsvibhat/inventory-backend:latest
```

The API will be available at `http://localhost:8000`.

Interactive docs at `http://localhost:8000/docs`.

## Environment Variables

| Variable | Description | Default |
|----------|-------------|---------|
| `DATABASE_URL` | PostgreSQL connection string | `postgresql://postgres:postgres@localhost:5432/inventory_db` |
| `ALLOWED_ORIGINS` | Comma-separated CORS origins | `http://localhost:5173,http://localhost:3000` |

## API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/products/` | Create product |
| GET | `/products/` | List products |
| GET | `/products/{id}` | Get product |
| PUT | `/products/{id}` | Update product |
| DELETE | `/products/{id}` | Delete product |
| POST | `/customers/` | Create customer |
| GET | `/customers/` | List customers |
| GET | `/customers/{id}` | Get customer |
| DELETE | `/customers/{id}` | Delete customer |
| POST | `/orders/` | Create order |
| GET | `/orders/` | List orders |
| GET | `/orders/{id}` | Get order |
| DELETE | `/orders/{id}` | Delete order |
| GET | `/dashboard` | Dashboard stats |

## With Docker Compose

For the full stack (frontend + backend + database), use the `docker-compose.yml` from the main repo:

```bash
git clone https://github.com/Tejsvi-Bhat/inventory-management.git
cd inventory-management
cp .env.example .env
docker compose up --build
```

## Source Code

[github.com/Tejsvi-Bhat/inventory-management](https://github.com/Tejsvi-Bhat/inventory-management)
