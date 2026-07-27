# COOPERCARNE - Portal do Associado

Aplicativo PWA mobile para associados da COOPERCARNE gerenciarem suas operações com o frigorífico.

## 🚀 Funcionalidades Implementadas

### 1. Autenticação e Perfis
- ✅ Login com e-mail e senha
- ✅ Múltiplos perfis de usuário (Comprador, Financeiro, Gerente, Admin)
- ✅ Controle de acesso por CNPJ
- ✅ Persistência de sessão

### 2. Pedidos de Carne
- ✅ Criar, editar e visualizar pedidos
- ✅ Tipos de carne: Bovina, Suína, Ovina
- ✅ Status: Rascunho, Enviado, Em Separação, Faturado, Entregue, Cancelado
- ✅ Repetir pedidos anteriores
- ✅ Histórico completo

### 3. Agenda de Abate
- ✅ Visualizar capacidade diária por tipo de animal
- ✅ Agendar abates (Bovino, Suíno, Ovino)
- ✅ Controle de vagas disponíveis
- ✅ Cancelamento de agendamentos
- ✅ Validação de capacidade

### 4. Documentos
- ✅ Solicitar documentos sanitários
- ✅ Relatórios de abate
- ✅ Declarações e comprovantes
- ✅ Download em PDF e XML
- ✅ Status: Solicitado, Em Análise, Disponível, Entregue

### 5. Comunicação
- ✅ Avisos oficiais
- ✅ Mensagens diretas
- ✅ Notificações push
- ✅ Histórico de leitura
- ✅ Segmentação por tipo

### 6. Preços de Animais
- ✅ Preços atualizados (Bovino, Suíno, Ovino)
- ✅ Histórico de variação
- ✅ Gráficos semanais e mensais
- ✅ Indicadores de tendência

### 7. Cotações
- ✅ Solicitar cotações
- ✅ Receber propostas do frigorífico
- ✅ Validade das cotações
- ✅ Gerar pedidos a partir de cotações

### 8. Financeiro
- ✅ Listagem de NF-e
- ✅ Download de XML e PDF
- ✅ Listagem de boletos
- ✅ Copiar linha digitável
- ✅ Status: Aberto, Pago, Vencido

### 9. Funcionalidades Extras
- ✅ Aniversário do usuário (banner comemorativo)
- ✅ Caixa de sugestões
- ✅ Central de relacionamento (chamados)
- ✅ Pesquisa de satisfação
- ✅ Avaliação de serviços

### 10. PWA (Progressive Web App)
- ✅ Instalável em dispositivos móveis
- ✅ Funciona offline (service worker)
- ✅ Ícones e splash screens
- ✅ Manifesto configurado
- ✅ Layout responsivo mobile-first

## 🎨 Design System

### Cores da Marca
- **Vermelho Principal**: `#c51d1f`
- **Vermelho Escuro**: `#a01517`
- **Vermelho Mais Escuro**: `#8b1214`
- **Verde (Complementar)**: `#10b981`

### Componentes UI
- **Framework**: React + TypeScript
- **Estilização**: Tailwind CSS v4
- **Componentes**: Radix UI
- **Gráficos**: Recharts
- **Formulários**: React Hook Form
- **Notificações**: Sonner
- **Roteamento**: React Router v7 (Data Mode)

## 📱 Navegação

### Bottom Navigation
- **Início**: Dashboard com ações rápidas
- **Pedidos**: Gerenciamento de pedidos
- **Abate**: Agenda de abate
- **Preços**: Preços dos animais
- **Perfil**: Dados do associado

### Menu Completo
Acessível através do dashboard principal com acesso a todos os módulos.

## 🔐 Segurança

- ✅ RBAC (Role-Based Access Control)
- ✅ Logs de auditoria (estrutura implementada)
- ✅ Associados visualizam apenas dados próprios
- ✅ Autenticação por sessão

## 📊 Dados Mockados

O aplicativo utiliza dados mockados para demonstração. Em produção, deve ser conectado a:
- Backend API (Node.js/NestJS sugerido)
- Banco de dados PostgreSQL
- Firebase para notificações push
- Storage S3 para documentos

## 🚀 Como Executar

1. Instalar dependências:
```bash
npm install
```

2. Executar em desenvolvimento:
```bash
npm run dev
```

3. Build para produção:
```bash
npm run build
```

## 📝 Credenciais de Teste

Qualquer e-mail e senha funcionarão no ambiente de demonstração.

**Usuário Mockado**:
- Nome: João Silva
- CNPJ: 12.345.678/0001-90
- Razão Social: Supermercado Silva Ltda
- Perfil: Gerente

## 🏗️ Estrutura do Projeto

```
/src
  /app
    /components      # Componentes reutilizáveis
      /ui           # Componentes da UI (Radix + Tailwind)
    /contexts       # Context API (Auth)
    /pages          # Páginas da aplicação
    App.tsx         # Componente principal
    routes.tsx      # Configuração de rotas
  /styles           # Estilos globais
  main.tsx          # Entry point
/public
  manifest.json     # PWA Manifest
  sw.js            # Service Worker
```

## 📦 Modelo de Dados (Sugerido para Backend)

### Entidades Principais
- `associados` - Dados dos associados
- `usuarios` - Usuários do sistema
- `permissoes` - Controle de acesso
- `pedidos` - Pedidos de carne
- `pedido_itens` - Itens dos pedidos
- `agenda_abate` - Agendamentos
- `capacidade_abate_diaria` - Controle de capacidade
- `documentos` - Documentos solicitados
- `mensagens` - Comunicados
- `notificacoes` - Notificações push
- `precos_animais` - Histórico de preços
- `cotacoes` - Cotações solicitadas
- `nfe` - Notas fiscais
- `boletos` - Boletos bancários
- `sugestoes` - Caixa de sugestões
- `pesquisas` - Pesquisas de satisfação
- `respostas_pesquisa` - Respostas das pesquisas
- `chamados` - Chamados de suporte
- `avaliacoes` - Avaliações de serviços

## 🔄 Próximos Passos

1. **Backend**: Implementar API REST com NestJS
2. **Banco de Dados**: Configurar PostgreSQL
3. **Autenticação**: JWT + Refresh Tokens
4. **Uploads**: Integrar com S3 para documentos
5. **Notificações**: Firebase Cloud Messaging
6. **Testes**: Implementar testes unitários e E2E
7. **CI/CD**: Pipeline de deploy automatizado
8. **Monitoramento**: Logs e métricas de uso

## 📄 Licença

© 2026 COOPERCARNE - Todos os direitos reservados

---

**Desenvolvido com ❤️ para otimizar a gestão entre associados e o frigorífico**
