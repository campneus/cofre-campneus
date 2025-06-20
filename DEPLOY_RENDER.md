# Instruções para Deploy no Render

## 📋 Pré-requisitos

1. Conta no Render (https://render.com)
2. Repositório Git com o código do projeto
3. Banco de dados PostgreSQL configurado e acessível

## 🚀 Passo a Passo para Deploy

### 1. Preparar o Repositório

Certifique-se de que os seguintes arquivos estão no repositório:
- `package.json` com scripts de start
- `server.js` como arquivo principal
- Arquivo `.env` (será configurado no Render)
- `database_setup.sql` para criação das tabelas

### 2. Configurar o Banco de Dados

Execute o script SQL no banco PostgreSQL:

```bash
psql -h ep-crimson-meadow-a8krhs13.eastus2.azure.neon.tech -U senhas_campneus_owner -d senhas_campneus -f database_setup.sql
```

### 3. Criar Web Service no Render

1. Acesse o dashboard do Render
2. Clique em "New +" → "Web Service"
3. Conecte seu repositório Git
4. Configure as seguintes opções:

#### Configurações Básicas:
- **Name**: `cofre-senhas-campneus`
- **Environment**: `Node`
- **Region**: `Oregon (US West)` ou mais próximo
- **Branch**: `main` ou `master`
- **Root Directory**: deixe vazio se o projeto está na raiz

#### Comandos de Build e Start:
- **Build Command**: `npm install`
- **Start Command**: `npm start`

### 4. Configurar Variáveis de Ambiente

Na seção "Environment Variables", adicione:

```
PGHOST=ep-crimson-meadow-a8krhs13.eastus2.azure.neon.tech
PGDATABASE=senhas_campneus
PGUSER=senhas_campneus_owner
PGPASSWORD=npg_MXP5UK4CqToH
PGPORT=5432
NODE_ENV=production
PORT=10000
JWT_SECRET=sua_chave_jwt_super_secreta_e_complexa_aqui_2024_campneus_cofre_senhas
```

**⚠️ IMPORTANTE**: 
- O Render usa a porta 10000 por padrão
- Altere o `JWT_SECRET` para uma chave única e segura
- Mantenha as credenciais do banco conforme fornecidas

### 5. Configurações Avançadas

#### Auto-Deploy:
- ✅ Habilite "Auto-Deploy" para deploy automático em push

#### Health Check:
- **Health Check Path**: `/` (opcional)

### 6. Deploy

1. Clique em "Create Web Service"
2. O Render iniciará o processo de build e deploy
3. Acompanhe os logs para verificar se não há erros
4. Após o deploy, você receberá uma URL pública

### 7. Verificar o Deploy

1. Acesse a URL fornecida pelo Render
2. Teste o login com as credenciais:
   - Usuário: `admin`
   - Senha: `admin123`

### 8. Configurações de Produção

#### Domínio Personalizado (Opcional):
1. Na aba "Settings" do seu serviço
2. Seção "Custom Domains"
3. Adicione seu domínio personalizado

#### SSL:
- O Render fornece SSL automático para todos os domínios

## 🔧 Solução de Problemas

### Build Falha
- Verifique se o `package.json` está correto
- Certifique-se de que todas as dependências estão listadas
- Verifique os logs de build no dashboard

### Aplicação não Inicia
- Verifique se o comando start está correto: `npm start`
- Confirme se o arquivo `server.js` existe
- Verifique se a porta está configurada corretamente

### Erro de Conexão com Banco
- Confirme se todas as variáveis de ambiente estão configuradas
- Teste a conexão com o banco externamente
- Verifique se o banco permite conexões externas

### Erro "relation does not exist"
- Execute o script `database_setup.sql` no banco
- Verifique se está conectando ao banco correto
- Confirme se as tabelas foram criadas

## 📊 Monitoramento

### Logs:
- Acesse a aba "Logs" no dashboard do Render
- Monitore erros e performance

### Métricas:
- CPU e memória são monitorados automaticamente
- Configure alertas se necessário

## 🔄 Atualizações

Para atualizar a aplicação:
1. Faça push das alterações para o repositório Git
2. O Render fará deploy automático (se habilitado)
3. Ou clique em "Manual Deploy" no dashboard

## 💰 Custos

- **Plano Free**: Limitado, mas suficiente para testes
- **Plano Starter**: $7/mês - Recomendado para produção
- **Plano Standard**: $25/mês - Para alta demanda

## 🔐 Segurança em Produção

1. **Altere o JWT_SECRET** para uma chave única
2. **Configure HTTPS** (automático no Render)
3. **Monitore logs** regularmente
4. **Mantenha dependências atualizadas**
5. **Configure backups** do banco de dados

## 📞 Suporte

- Documentação Render: https://render.com/docs
- Suporte Render: https://render.com/support
- Logs detalhados disponíveis no dashboard

## ✅ Checklist Final

- [ ] Repositório Git configurado
- [ ] Banco de dados criado e populado
- [ ] Variáveis de ambiente configuradas
- [ ] Build e deploy executados com sucesso
- [ ] Aplicação acessível via URL pública
- [ ] Login funcionando com usuários de teste
- [ ] SSL ativo (HTTPS)
- [ ] Logs sem erros críticos

