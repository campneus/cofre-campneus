# Cofre de Senhas - Campneus

Sistema web completo para gerenciamento de senhas desenvolvido em Node.js com PostgreSQL, interface moderna e recursos avançados de segurança.

## 🚀 Características

- **Autenticação segura** com JWT e bcrypt
- **Interface moderna** nas cores branco, cinza e amarelo
- **Sistema de perfis** (Administrador, Loja, Analista)
- **CRUD completo** para senhas, localidades e usuários
- **Sistema de relatórios** com exportação CSV
- **Dashboard** com estatísticas e visualizações
- **Responsivo** para desktop e mobile
- **Segurança avançada** com rate limiting e validações

## 📋 Funcionalidades

### Autenticação
- Tela de login com validação
- Recuperação de senha
- Controle de sessão com JWT
- Diferentes níveis de acesso por perfil

### Cofre de Senhas
- Cadastro, edição e exclusão de senhas
- Senhas ocultas por padrão (segurança)
- Funcionalidade copiar/visualizar senha
- URLs clicáveis
- Filtros por categoria e localidade
- Histórico de modificações

### Gerenciamento
- **Localidades**: Código, CNPJ, Nome, Estado, Cidade
- **Categorias**: Prefeituras, Locadoras, Órgãos Governamentais, Fornecedores
- **Usuários**: Controle de perfis e permissões

### Relatórios
- Exportação por localidade
- Exportação por categoria
- Exportação por data de atualização
- Exportação por analista responsável
- Formato CSV com encoding UTF-8

### Dashboard
- Quantidade de senhas por categoria
- Últimas senhas cadastradas
- Últimas senhas alteradas
- Estatísticas gerais do sistema

## 🛠️ Tecnologias

- **Backend**: Node.js, Express.js
- **Banco de Dados**: PostgreSQL
- **Autenticação**: JWT, bcrypt
- **Frontend**: HTML5, CSS3, JavaScript (Vanilla)
- **Segurança**: Helmet, CORS, Rate Limiting
- **Validação**: Express Validator

## 📦 Instalação

### Pré-requisitos
- Node.js 18+ 
- PostgreSQL
- Git

### 1. Clone o repositório
```bash
git clone <url-do-repositorio>
cd cofre-senhas-campneus
```

### 2. Instale as dependências
```bash
npm install
```

### 3. Configure o banco de dados

#### 3.1. Execute o script SQL no seu banco PostgreSQL:
```bash
psql -h ep-crimson-meadow-a8krhs13.eastus2.azure.neon.tech -U senhas_campneus_owner -d senhas_campneus -f database_setup.sql
```

#### 3.2. Configure as variáveis de ambiente
Copie o arquivo `.env` fornecido ou crie um novo com as seguintes variáveis:

```env
# Configurações do Banco de Dados PostgreSQL
PGHOST=ep-crimson-meadow-a8krhs13.eastus2.azure.neon.tech
PGDATABASE=senhas_campneus
PGUSER=senhas_campneus_owner
PGPASSWORD=npg_MXP5UK4CqToH
PGPORT=5432

# Configurações da Aplicação
NODE_ENV=production
PORT=3000

# Chave secreta para JWT (IMPORTANTE: Altere em produção)
JWT_SECRET=sua_chave_jwt_super_secreta_e_complexa_aqui_2024_campneus_cofre_senhas
```

### 4. Execute a aplicação
```bash
# Desenvolvimento
npm run dev

# Produção
npm start
```

A aplicação estará disponível em `http://localhost:3000`

## 👥 Usuários de Teste

Após executar o script do banco de dados, os seguintes usuários estarão disponíveis:

| Usuário | Senha | Perfil |
|---------|-------|--------|
| admin | admin123 | Administrador |
| loja_user | admin123 | Loja |
| analista_user | admin123 | Analista |

## 🔐 Perfis de Usuário

### Administrador
- Acesso total ao sistema
- Pode criar, editar e excluir usuários
- Pode gerenciar todas as senhas
- Pode visualizar e copiar senhas
- Pode gerenciar localidades e categorias
- Acesso a todos os relatórios

### Analista
- Pode criar e editar senhas
- Pode visualizar e copiar senhas
- Pode ser definido como responsável por senhas
- Acesso a relatórios
- Não pode gerenciar usuários

### Loja
- Apenas visualização de senhas (ocultas)
- Não pode visualizar ou copiar senhas
- Acesso limitado a relatórios
- Não pode criar ou editar dados

## 🚀 Deploy no Render

### 1. Preparação
- Certifique-se de que o arquivo `.env` está configurado
- Verifique se o banco de dados PostgreSQL está acessível

### 2. Configuração no Render
1. Conecte seu repositório Git ao Render
2. Configure as variáveis de ambiente no painel do Render
3. Defina o comando de build: `npm install`
4. Defina o comando de start: `npm start`
5. Configure a porta: `3000`

### 3. Variáveis de Ambiente no Render
Configure as seguintes variáveis no painel do Render:

```
PGHOST=ep-crimson-meadow-a8krhs13.eastus2.azure.neon.tech
PGDATABASE=senhas_campneus
PGUSER=senhas_campneus_owner
PGPASSWORD=npg_MXP5UK4CqToH
PGPORT=5432
NODE_ENV=production
JWT_SECRET=sua_chave_jwt_super_secreta_e_complexa_aqui_2024_campneus_cofre_senhas
```

### 4. Deploy
O Render fará o deploy automaticamente após a configuração.

## 📁 Estrutura do Projeto

```
cofre-senhas-campneus/
├── src/
│   ├── config/
│   │   └── database.js          # Configuração do PostgreSQL
│   ├── controllers/
│   │   ├── AuthController.js    # Autenticação
│   │   ├── PasswordController.js # Gerenciamento de senhas
│   │   ├── UserController.js    # Gerenciamento de usuários
│   │   ├── LocationController.js # Localidades e categorias
│   │   └── ReportController.js  # Relatórios
│   ├── middleware/
│   │   └── auth.js              # Middleware de autenticação
│   ├── models/
│   │   ├── User.js              # Modelo de usuário
│   │   ├── Password.js          # Modelo de senha
│   │   ├── Location.js          # Modelo de localidade
│   │   └── Category.js          # Modelos de categoria
│   └── routes/
│       ├── auth.js              # Rotas de autenticação
│       ├── passwords.js         # Rotas de senhas
│       ├── users.js             # Rotas de usuários
│       ├── locations.js         # Rotas de localidades
│       └── reports.js           # Rotas de relatórios
├── public/
│   ├── css/
│   │   └── styles.css           # Estilos CSS
│   ├── js/
│   │   └── app.js               # JavaScript frontend
│   └── index.html               # Interface principal
├── database_setup.sql           # Script de criação do banco
├── .env                         # Variáveis de ambiente
├── package.json                 # Dependências do projeto
└── server.js                    # Servidor principal
```

## 🔧 API Endpoints

### Autenticação
- `POST /api/auth/login` - Login
- `POST /api/auth/forgot-password` - Recuperar senha
- `GET /api/auth/profile` - Perfil do usuário
- `POST /api/auth/change-password` - Alterar senha
- `POST /api/auth/register` - Registrar usuário (admin)

### Senhas
- `GET /api/passwords` - Listar senhas
- `POST /api/passwords` - Criar senha
- `GET /api/passwords/:id` - Obter senha
- `PUT /api/passwords/:id` - Atualizar senha
- `DELETE /api/passwords/:id` - Excluir senha
- `GET /api/passwords/:id/reveal` - Revelar senha

### Usuários
- `GET /api/users` - Listar usuários
- `POST /api/users` - Criar usuário
- `GET /api/users/:id` - Obter usuário
- `PUT /api/users/:id` - Atualizar usuário
- `DELETE /api/users/:id` - Excluir usuário

### Localidades
- `GET /api/locations` - Listar localidades
- `POST /api/locations` - Criar localidade
- `GET /api/locations/categories` - Listar categorias
- `GET /api/locations/subcategories` - Listar subcategorias

### Relatórios
- `GET /api/reports/export` - Exportar dados
- `GET /api/reports/filters` - Filtros disponíveis
- `GET /api/reports/statistics` - Estatísticas

## 🔒 Segurança

- Senhas criptografadas com bcrypt (12 rounds)
- Autenticação JWT com expiração de 24h
- Rate limiting (100 requests por 15 minutos)
- Validação de entrada em todas as rotas
- Headers de segurança com Helmet
- CORS configurado
- Sanitização de dados

## 🐛 Solução de Problemas

### Erro de conexão com banco
- Verifique as credenciais no arquivo `.env`
- Certifique-se de que o banco PostgreSQL está acessível
- Execute o script `database_setup.sql`

### Erro "relation does not exist"
- Execute o script de criação do banco: `database_setup.sql`
- Verifique se está conectado ao banco correto

### Erro de autenticação
- Verifique se o JWT_SECRET está configurado
- Certifique-se de que os usuários foram criados no banco

## 📞 Suporte

Para suporte técnico ou dúvidas sobre o sistema, entre em contato com a equipe de desenvolvimento.

## 📄 Licença

Este projeto é propriedade da Campneus. Todos os direitos reservados.

