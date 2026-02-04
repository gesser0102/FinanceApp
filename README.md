# 🏠 API de Controle de Despesas Residenciais

Sistema completo para gerenciamento de despesas compartilhadas entre moradores de uma residência, com backend em .NET e frontend em React.

## 🚀 Tecnologias

### Backend
- **.NET 10** - Framework principal
- **ASP.NET Core Web API** - RESTful API
- **Entity Framework Core** - ORM
- **SQLite** - Banco de dados
- **Scalar** - Documentação interativa da API

### Frontend
- **React 19** - Biblioteca UI
- **TypeScript** - Tipagem estática
- **Vite** - Build tool
- **TanStack Query** - Gerenciamento de estado server-side
- **React Hook Form** - Gerenciamento de formulários
- **Zod** - Validação de schemas
- **Radix UI** - Componentes acessíveis
- **Tailwind CSS** - Estilização

## 📋 Pré-requisitos

- [.NET SDK 10.0](https://dotnet.microsoft.com/download) ou superior
- [Node.js 18+](https://nodejs.org/) ou superior
- Git

## 🔧 Instalação e Execução

### 1. Clone o repositório

```bash
git clone <url-do-repositorio>
cd Api-Despesas
```

### 2. Executar a aplicação completa

Você precisará de **dois terminais** abertos simultaneamente:

**Terminal 1 - Backend:**
```bash
# Navegar para o diretório do backend
cd Api-Despesas

# Restaurar dependências e executar
dotnet restore
dotnet run
```

**Terminal 2 - Frontend:**
```bash
# Navegar para o diretório do frontend
cd frontend

# Instalar dependências e executar
npm install
npm run dev
```

A aplicação estará disponível em:
- **Frontend (Interface):** `http://localhost:5173`
- **Backend (API):** `http://localhost:5140`
- **Documentação Scalar:** `http://localhost:5140/scalar/v1`

> **Nota:** O banco de dados SQLite (`despesas.db`) é criado automaticamente na primeira execução do backend com as migrações aplicadas.

## 📁 Estrutura do Projeto

```
Api-Despesas/
├── Api-Despesas/              # Backend (.NET)
│   ├── Controllers/           # Endpoints da API
│   ├── Data/                  # DbContext e repositórios
│   ├── DTOs/                  # Data Transfer Objects
│   ├── Migrations/            # Migrações do EF Core
│   ├── Models/                # Entidades do banco
│   ├── Services/              # Lógica de negócio
│   └── Program.cs             # Configuração da aplicação
│
├── frontend/                  # Frontend (React)
│   ├── src/
│   │   ├── components/        # Componentes reutilizáveis
│   │   ├── hooks/             # Custom hooks
│   │   ├── pages/             # Páginas principais
│   │   ├── services/          # Cliente API (axios)
│   │   └── types/             # Definições TypeScript
│   └── package.json
│
└── README.md
```

## 🗄️ Banco de Dados

O projeto usa **SQLite** com Entity Framework Core. O banco de dados (`despesas.db`) é criado automaticamente na primeira execução do backend.

### Migrações

As migrações são aplicadas automaticamente ao iniciar o backend. Para criar novas migrações:

```bash
cd Api-Despesas

# Criar nova migração
dotnet ef migrations add NomeDaMigracao

# Reverter última migração
dotnet ef migrations remove
```

## 🎯 Funcionalidades

### ✅ Pessoas
- Cadastro de moradores
- Listagem com totais de despesas
- Edição e exclusão (com validação de transações vinculadas)

### 📂 Categorias
- Criação de categorias de despesas
- Cores personalizáveis
- Relatórios por categoria

### 💰 Transações
- Registro de despesas
- Vinculação a pessoa e categoria
- Data e descrição

### 📊 Relatórios
- Totais por pessoa (receitas, despesas, saldo)
- Totais por categoria
- Dashboard com visão geral

## 🔌 API Endpoints

### Pessoas
- `GET /api/pessoas` - Listar todas
- `GET /api/pessoas/{id}` - Buscar por ID
- `POST /api/pessoas` - Criar
- `PUT /api/pessoas/{id}` - Atualizar
- `DELETE /api/pessoas/{id}` - Deletar

### Categorias
- `GET /api/categorias` - Listar todas
- `GET /api/categorias/{id}` - Buscar por ID
- `POST /api/categorias` - Criar

### Transações
- `GET /api/transacoes` - Listar todas
- `GET /api/transacoes/{id}` - Buscar por ID
- `POST /api/transacoes` - Criar

### Relatórios
- `GET /api/relatorios/totais-por-pessoa` - Totais agrupados por pessoa
- `GET /api/relatorios/totais-por-categoria` - Totais agrupados por categoria

Documentação completa disponível em: `http://localhost:5140/scalar/v1`

## 🧪 Build de Produção

Para gerar os builds otimizados de produção:

```bash
# Build do Backend
cd Api-Despesas
dotnet publish -c Release -o ./publish

# Build do Frontend
cd ../frontend
npm run build
```

Arquivos gerados:
- **Backend:** `Api-Despesas/publish/`
- **Frontend:** `frontend/dist/`

## 🎨 Tema

O frontend possui tema escuro moderno com paleta de cores personalizável via Tailwind CSS.

## 📝 Comandos Úteis

```bash
# ===== Backend (Api-Despesas/) =====
dotnet run                              # Executar em modo desenvolvimento
dotnet build                            # Compilar projeto
dotnet ef migrations add <Nome>         # Criar nova migração
dotnet ef migrations remove             # Reverter última migração
dotnet publish -c Release               # Build de produção

# ===== Frontend (frontend/) =====
npm run dev                             # Servidor de desenvolvimento
npm run build                           # Build de produção
npm run preview                         # Preview do build de produção
npm run lint                            # Verificar código com ESLint
```

## 📄 Licença

Este projeto está sob a licença MIT.
