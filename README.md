# TeamLinks Frontend

Interface web do **TeamLinks** para organizar e gerenciar links de projetos: clientes, projetos, tags, URLs curtas e contagem de cliques.

Faz parte do ecossistema **TeamLinks**:

| Serviço | Repositório | Função |
|---------|-------------|---------|
| Frontend (este) | `TeamLinks-frontend` | SPA Angular |
| API | `TeamLinks` | Backend Spring Boot + PostgreSQL |
| Encurtador | `TeamLinks-shortner` | Microsserviço de short links (`.NET`) |
| Deploy | [`teamlinks-deploy`](https://github.com/buritizinhw/teamlinks-deploy) | Compose que sobe o stack completo |

---

## Tecnologias

- Angular 21 (standalone components, signals)
- TypeScript ~5.9
- RxJS
- SCSS + Font Awesome
- Vitest (testes unitários)
- npm
- Docker / Nginx (produção)

> Autenticação não está implementada nesta versão. A interface está em português (pt-BR).

---

## Pré-requisitos

### Desenvolvimento local

- [Node.js 22+](https://nodejs.org/)
- npm 11+ (declarado em `packageManager`)
- API TeamLinks rodando em `http://localhost:8080` (ou ajuste `apiUrl` em `environment.ts`)

### Docker

- [Docker](https://docs.docker.com/get-docker/) e Docker Compose
- Rede externa `teamlinks-network` (criada ao subir a API)
- Containers da API (`teamlinks-api`) e, opcionalmente, do encurtador (`teamlinks-shortener`) na mesma rede

---

## Estrutura do repositório

```
TeamLinks-frontend/
├── docker-compose.yml          # Orquestração do frontend
├── .env.example
└── team-links-frontend/        # Aplicação Angular
    ├── src/app/
    │   ├── pages/              # Home, projects, clients, tags
    │   ├── components/         # Sidebar, modais, cards, etc.
    │   ├── services/           # API, tema, toasts
    │   ├── models/             # Tipos de domínio
    │   └── environments/       # apiUrl (dev / prod)
    ├── Dockerfile
    └── nginx.conf              # SPA + proxy /api e /r/
```

---

## Início rápido (desenvolvimento)

```bash
cd team-links-frontend
npm install
npm start
```

A aplicação fica em `http://localhost:4200/`.

Por padrão, as chamadas HTTP usam `http://localhost:8080/api` (`src/environments/environment.ts`).

---

## Scripts npm

Execute dentro de `team-links-frontend/`:

| Script | Comando | Descrição |
|--------|---------|-----------|
| `npm start` | `ng serve` | Servidor de desenvolvimento |
| `npm run build` | `ng build` | Build de produção |
| `npm run watch` | `ng build --watch --configuration development` | Build contínuo |
| `npm test` | `ng test` | Testes unitários (Vitest) |

---

## Docker

1. Suba a API TeamLinks para criar a rede `teamlinks-network`.
2. Copie e configure o ambiente na raiz deste repositório:

```bash
cp .env.example .env
```

```env
FRONTEND_HOST_PORT=4200
```

3. Suba o frontend:

```bash
docker compose up --build
```

| Recurso | Valor |
|---------|--------|
| URL | `http://localhost:4200` (ou a porta de `FRONTEND_HOST_PORT`) |
| Imagem | `teamlinks-frontend:local` |
| Container | `teamlinks-frontend` |

### Proxy Nginx (produção)

No container, o Nginx:

- Serve o build Angular com fallback SPA (`index.html`)
- Encaminha `/api/` → `http://teamlinks-api:8080/api/`
- Encaminha `/r/` → `http://teamlinks-shortener:8080/r/`

Em produção, `environment.production.ts` usa `apiUrl: '/api'`.

---

## Variáveis e configuração

| Nome | Onde | Descrição |
|------|------|-----------|
| `FRONTEND_HOST_PORT` | `.env` (Compose) | Porta no host mapeada para `:80` do container |
| `apiUrl` | `environment.ts` / `environment.production.ts` | Base da API (`http://localhost:8080/api` em dev; `/api` em prod) |

---

## Funcionalidades

| Rota | Página | O que faz |
|------|--------|-----------|
| `/` | Home | Adição rápida de URL a um projeto, com tags |
| `/projects` | Projetos | Listar, buscar e CRUD de projetos |
| `/projects/:id` | Detalhe | Links do projeto, cliques, CRUD de links |
| `/clients` | Clientes | CRUD de clientes |
| `/tags` | Tags | CRUD de tags com cores |

Extras:

- Tema claro/escuro (persistido em `localStorage`)
- Toasts de feedback
- Contagem de cliques nos links

---

## Arquitetura

SPA com shell (sidebar + router outlet). As páginas consomem um `ApiService` centralizado que chama a API REST. Em Docker, o browser fala com a mesma origem; o Nginx faz o proxy para API e encurtador.

```
Browser → Angular (4200)
            ├─ dev: HTTP → API :8080
            └─ Docker: /api, /r → Nginx → teamlinks-api / teamlinks-shortener
```

---

## Serviços relacionados

Para subir o stack completo, use [`teamlinks-deploy`](https://github.com/buritizinhw/teamlinks-deploy).

Ordem sugerida para desenvolvimento isolado:

1. **API** (`TeamLinks`) — `docker compose up --build`
2. **Encurtador** (`TeamLinks-shortner`) — mesma rede Docker
3. **Frontend** (este repositório) — `docker compose up --build`
