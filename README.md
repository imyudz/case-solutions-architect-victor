# Houses of Hogwarts 🏰 - Solutions Architect Case

Uma aplicação React moderna que exibe as casas de Hogwarts School of Witchcraft and Wizardry, consumindo dados da Wizard World API.

![React](https://img.shields.io/badge/React-19.1.0-61DAFB?style=flat-square&logo=react)
![TypeScript](https://img.shields.io/badge/TypeScript-5.8.3-3178C6?style=flat-square&logo=typescript)
![Vite](https://img.shields.io/badge/Vite-7.0.4-646CFF?style=flat-square&logo=vite)
![TailwindCSS](https://img.shields.io/badge/TailwindCSS-4.1.11-06B6D4?style=flat-square&logo=tailwindcss)

## ✨ Funcionalidades

- 🏠 **Lista de Casas**: Visualização das quatro casas de Hogwarts com designs únicos
- 🔍 **Detalhes das Casas**: Página dedicada com informações detalhadas de cada casa
- 📊 **Analytics**: Rastreamento de eventos com Amplitude Analytics
- 🎨 **UI Responsiva**: Interface moderna e responsiva com TailwindCSS
- ⚡ **Performance**: Otimizada com lazy loading e code splitting
- 🛡️ **Error Handling**: Tratamento robusto de erros com Error Boundaries
- 🔄 **Loading States**: Estados de carregamento elegantes com animações

## 🚀 Quick Start

### Pré-requisitos

- Node.js 18+ 
- npm ou yarn

### Instalação

```bash
# Clone o repositório
git clone <repository-url>
cd case-solutions-architect-victor

# Instale as dependências
npm install

# Execute em modo desenvolvimento
npm run dev

# Build para produção
npm run build

# Visualize o build
npm run preview
```

## 📁 Estrutura do Projeto

```
src/
├── components/          # Componentes reutilizáveis
├── context/            # Context API e providers
├── hooks/              # Custom hooks
├── pages/              # Páginas da aplicação
├── services/           # Serviços e APIs
│   ├── analytics/      # Serviços de analytics
│   └── container.ts    # Injeção de dependência
├── types/              # Definições TypeScript
└── utils/              # Utilitários
```

## 🛠️ Scripts Disponíveis

```bash
npm run dev          # Servidor de desenvolvimento
npm run build        # Build para produção
npm run preview      # Preview do build
npm run lint         # Executar ESLint
npm run build:analyze # Build com análise de bundle
```

## 🏗️ Arquitetura

Este projeto foi desenvolvido seguindo princípios de **Clean Architecture** e **SOLID**:

- **Separation of Concerns**: Cada camada tem responsabilidades bem definidas
- **Dependency Injection**: Container de serviços para facilitar testes e manutenção
- **Context Pattern**: Gerenciamento de estado com Context API + useReducer
- **Custom Hooks**: Lógica reutilizável e testável
- **Error Boundaries**: Captura e tratamento de erros de forma elegante

## 📈 Analytics

A aplicação inclui um sistema robusto de analytics que rastreia:

- Navegação entre páginas
- Interações com componentes
- Erros e performance de API
- Comportamento do usuário

## 🎨 Design System

- **TailwindCSS**: Framework CSS utilitário
- **Glass Morphism**: Design moderno com efeitos de vidro
- **Responsividade**: Mobile-first approach
- **Animações**: Transições suaves e micro-interações

## 🔧 Tecnologias Utilizadas

### Core
- **React 19**: Framework principal
- **TypeScript**: Tipagem estática
- **Vite**: Build tool e dev server
- **React Router**: Roteamento SPA

### Styling
- **TailwindCSS 4**: Framework CSS
- **CSS Animations**: Animações customizadas

### Analytics & Monitoring
- **Amplitude**: Analytics de eventos
- **Error Tracking**: Monitoramento de erros

### Quality & Tools
- **ESLint**: Linting de código
- **Cross-env**: Variáveis de ambiente multiplataforma

## 📚 Documentação Adicional

Para informações detalhadas sobre a arquitetura e decisões técnicas, consulte:

- [**Arquitetura Geral**](./docs/architecture.md)
- [**Gerenciamento de Estado**](./docs/state-management.md)
- [**Sistema de Analytics**](./docs/analytics.md)
- [**Injeção de Dependência**](./docs/dependency-injection.md)
- [**Estrutura de Componentes**](./docs/components.md)
- [**Configuração de Build**](./docs/build-config.md)

---