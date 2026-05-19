<div align="center">

# 🌐 GuiaServ Público — Frontend

**Interface web para a plataforma de orientação em serviços públicos brasileiros**

[![Angular](https://img.shields.io/badge/Angular-19-DD0031?style=for-the-badge&logo=angular&logoColor=white)](https://angular.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.x-3178C6?style=for-the-badge&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![CSS3](https://img.shields.io/badge/CSS3-Custom-1572B6?style=for-the-badge&logo=css3&logoColor=white)](https://developer.mozilla.org/en-US/docs/Web/CSS)
[![RxJS](https://img.shields.io/badge/RxJS-7.x-B7178C?style=for-the-badge&logo=reactivex&logoColor=white)](https://rxjs.dev/)
[![Node](https://img.shields.io/badge/Node.js-20+-339933?style=for-the-badge&logo=nodedotjs&logoColor=white)](https://nodejs.org/)

[![GitHub repo](https://img.shields.io/badge/GitHub-nicholasfocke%2Fguia--serv--front-181717?style=flat-square&logo=github)](https://github.com/nicholasfocke/guia-serv-front)
[![API](https://img.shields.io/badge/API-guia--serv--publico-0ea5a0?style=flat-square)](https://github.com/nicholasfocke/guia-serv-publico)
[![Status](https://img.shields.io/badge/Status-Em%20Desenvolvimento-yellow?style=flat-square)]()

</div>

---

## 📋 Sumário

1. [Sobre o Projeto](#-sobre-o-projeto)
2. [Tecnologias Utilizadas](#-tecnologias-utilizadas)
3. [Funcionalidades Implementadas](#-funcionalidades-implementadas)
4. [Arquitetura do Frontend](#-arquitetura-do-frontend)
5. [Estrutura de Pastas](#-estrutura-de-pastas)
6. [Integração com a API](#-integração-com-a-api)
7. [Autenticação JWT no Frontend](#-autenticação-jwt-no-frontend)
8. [Perfis de Acesso e Rotas Protegidas](#-perfis-de-acesso-e-rotas-protegidas)
9. [Como Executar o Projeto](#-como-executar-o-projeto)
10. [Variáveis de Ambiente](#-variáveis-de-ambiente)
11. [Telas Implementadas](#-telas-implementadas)
12. [Melhorias Futuras](#-melhorias-futuras)
13. [Repositório da API](#-repositório-da-api)
14. [Autor](#-autor)

---

## 📖 Sobre o Projeto

O **GuiaServ Público — Frontend** é a interface web da plataforma de orientação em serviços públicos brasileiros. Desenvolvido em **Angular 19**, consome diretamente a [API REST GuiaServPublico](https://github.com/nicholasfocke/guia-serv-publico) (Java 21 + Spring Boot 3) e oferece ao cidadão uma experiência clara, responsiva e acessível para encontrar serviços, unidades de atendimento, documentos necessários e avaliações de outros usuários.

O projeto segue as melhores práticas do ecossistema Angular moderno: componentes standalone, signals, lazy loading por rota, interceptors HTTP e guards de navegação baseados em perfil de acesso.

---

## 🛠️ Tecnologias Utilizadas

| Categoria | Tecnologia | Versão |
|---|---|---|
| Framework | Angular | 19 |
| Linguagem | TypeScript | 5.x |
| Estilização | CSS3 customizado | — |
| Reatividade | RxJS | 7.x |
| HTTP Client | Angular HttpClient | — |
| Roteamento | Angular Router | — |
| Autenticação | JWT (via HttpInterceptor) | — |
| Ambiente | Node.js | 20+ |
| Package manager | npm | — |

---

## ✅ Funcionalidades Implementadas

| Funcionalidade | Perfil | Status |
|---|---|---|
| Tela de login com JWT | Público | ✅ Implementado |
| Tela de cadastro de usuário | Público | ✅ Implementado |
| Listagem de serviços públicos | Público | ✅ Implementado |
| Busca e filtro de serviços | Público | ✅ Implementado |
| Listagem de unidades de atendimento | Público | ✅ Implementado |
| Visualização de horários e documentos | USER | ✅ Implementado |
| Avaliação de serviços e unidades | USER | ✅ Implementado |
| Painel administrativo (CRUD) | ADMIN | ✅ Implementado |
| Integração completa com a API REST | — | ✅ Funcionando |

---

## 🏗️ Arquitetura do Frontend

O projeto segue a arquitetura recomendada pelo Angular moderno, organizada em três grandes camadas:
┌─────────────────────────────────────────────────────┐
│                     Componentes                      │
│   Responsáveis pela renderização da UI e interação   │
│   do usuário. Consomem Services via injeção.         │
└──────────────────────────┬──────────────────────────┘
│
┌──────────────────────────▼──────────────────────────┐
│                      Services                        │
│   Centralizam a lógica de negócio e as chamadas      │
│   HTTP à API. Utilizam RxJS (Observable / Signal).   │
└──────────────────────────┬──────────────────────────┘
│
┌──────────────────────────▼──────────────────────────┐
│               HttpClient + Interceptors              │
│   AuthInterceptor injeta o token JWT em toda         │
│   requisição autenticada automaticamente.            │
└──────────────────────────┬──────────────────────────┘
│ HTTP (REST)
┌──────────────────────────▼──────────────────────────┐
│              API — GuiaServPublico                   │
│         Java 21 · Spring Boot 3 · PostgreSQL         │
└─────────────────────────────────────────────────────┘

### Padrões adotados

**Componentes standalone** — todos os componentes usam `standalone: true`, eliminando a necessidade de NgModules e tornando o código mais simples e tree-shakable.

**Lazy loading por rota** — cada feature (serviços, unidades, admin, auth) é carregada sob demanda via `loadComponent()` no roteador, reduzindo o bundle inicial.

**Services como fonte de verdade** — toda lógica de requisição HTTP e transformação de dados vive nos services, nunca nos componentes. Componentes apenas exibem dados e disparam ações.

**Interceptor de autenticação** — o `AuthInterceptor` lê o token JWT do `localStorage` e o injeta automaticamente no header `Authorization: Bearer` de todas as requisições que exigem autenticação.

**Guards de navegação** — `AuthGuard` e `AdminGuard` protegem rotas com base no perfil do usuário logado, redirecionando para `/login` ou `/home` conforme o caso.

**Models/interfaces TypeScript** — cada entidade da API (Serviço, Unidade, Avaliação etc.) tem uma interface TypeScript correspondente, garantindo tipagem estática de ponta a ponta.

---

## 📁 Estrutura de Pastas
guia-serv-front/
├── src/
│   ├── app/
│   │   ├── core/
│   │   │   ├── auth/
│   │   │   │   ├── auth.guard.ts           # Guard para rotas USER
│   │   │   │   ├── admin.guard.ts          # Guard para rotas ADMIN
│   │   │   │   ├── auth.interceptor.ts     # Injeta JWT em toda requisição
│   │   │   │   └── auth.service.ts         # Login, logout, token, perfil
│   │   │   └── services/
│   │   │       ├── servico.service.ts      # CRUD + busca de serviços
│   │   │       ├── unidade.service.ts      # CRUD de unidades
│   │   │       ├── avaliacao.service.ts    # Avaliações
│   │   │       ├── documento.service.ts    # Documentos por serviço
│   │   │       ├── categoria.service.ts    # Categorias de serviço
│   │   │       └── horario.service.ts      # Horários de funcionamento
│   │   │
│   │   ├── features/
│   │   │   ├── home/
│   │   │   │   └── home.component.ts       # Página inicial com busca e destaques
│   │   │   ├── auth/
│   │   │   │   ├── login/
│   │   │   │   │   └── login.component.ts  # Tela de login
│   │   │   │   └── register/
│   │   │   │       └── register.component.ts # Tela de cadastro
│   │   │   ├── servicos/
│   │   │   │   ├── lista/
│   │   │   │   │   └── servicos-lista.component.ts
│   │   │   │   └── detalhe/
│   │   │   │       └── servico-detalhe.component.ts
│   │   │   ├── unidades/
│   │   │   │   ├── lista/
│   │   │   │   │   └── unidades-lista.component.ts
│   │   │   │   └── detalhe/
│   │   │   │       └── unidade-detalhe.component.ts
│   │   │   └── admin/
│   │   │       ├── dashboard/
│   │   │       │   └── admin-dashboard.component.ts
│   │   │       ├── servicos/
│   │   │       │   └── admin-servicos.component.ts
│   │   │       └── unidades/
│   │   │           └── admin-unidades.component.ts
│   │   │
│   │   ├── shared/
│   │   │   ├── components/
│   │   │   │   ├── navbar/                 # Navbar responsiva
│   │   │   │   ├── footer/                 # Rodapé
│   │   │   │   ├── search-bar/             # Barra de busca reutilizável
│   │   │   │   ├── service-card/           # Card de serviço
│   │   │   │   ├── unit-card/              # Card de unidade
│   │   │   │   └── rating/                 # Componente de avaliação por estrelas
│   │   │   └── models/
│   │   │       ├── servico.model.ts
│   │   │       ├── unidade.model.ts
│   │   │       ├── avaliacao.model.ts
│   │   │       ├── categoria.model.ts
│   │   │       ├── documento.model.ts
│   │   │       ├── horario.model.ts
│   │   │       └── usuario.model.ts
│   │   │
│   │   ├── app.routes.ts                   # Roteamento principal com lazy loading
│   │   ├── app.config.ts                   # Providers globais (HttpClient, Router)
│   │   └── app.component.ts                # Componente raiz
│   │
│   ├── environments/
│   │   ├── environment.ts                  # API URL: http://localhost:8080
│   │   └── environment.prod.ts             # API URL de produção
│   │
│   ├── styles.css                          # Estilos globais e variáveis CSS
│   └── index.html
│
├── angular.json
├── package.json
├── tsconfig.json
└── README.md

---

## 🔌 Integração com a API

O frontend consome a [API GuiaServPublico](https://github.com/nicholasfocke/guia-serv-publico) via **Angular HttpClient**. A URL base é configurada por ambiente:

```typescript
// environments/environment.ts
export const environment = {
  production: false,
  apiUrl: 'http://localhost:8080/api'
};

// environments/environment.prod.ts
export const environment = {
  production: true,
  apiUrl: 'https://sua-api.dominio.com/api'
};
```

### Exemplo de service

```typescript
// core/services/servico.service.ts
@Injectable({ providedIn: 'root' })
export class ServicoService {
  private http = inject(HttpClient);
  private apiUrl = `${environment.apiUrl}/servicos`;

  getAll(): Observable<Servico[]> {
    return this.http.get<Servico[]>(this.apiUrl);
  }

  search(nome: string): Observable<Servico[]> {
    return this.http.get<Servico[]>(`${this.apiUrl}?nome=${nome}`);
  }

  getById(id: number): Observable<Servico> {
    return this.http.get<Servico>(`${this.apiUrl}/${id}`);
  }

  create(servico: ServicoRequest): Observable<Servico> {
    return this.http.post<Servico>(this.apiUrl, servico);
  }

  update(id: number, servico: ServicoRequest): Observable<Servico> {
    return this.http.put<Servico>(`${this.apiUrl}/${id}`, servico);
  }

  delete(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }
}
```

---

## 🔑 Autenticação JWT no Frontend

O fluxo de autenticação é completamente stateless e segue o padrão Bearer Token:
┌──────────┐    POST /api/auth/login     ┌─────────────┐
│  Login   │ ──────────────────────────> │     API     │
│ Component│ <────────────────────────── │ Spring Boot │
└──────────┘    { token: "eyJ..." }      └─────────────┘
│
│  localStorage.setItem('token', ...)
▼
┌──────────────────┐
│   AuthService    │  getToken() / getRole() / isLoggedIn()
└──────────────────┘
│
│  token injetado automaticamente
▼
┌──────────────────────┐    GET /api/me           ┌─────────────┐
│  AuthInterceptor     │ ──────────────────────── │     API     │
│  Bearer eyJ...       │ Authorization: Bearer... │ Spring Boot │
└──────────────────────┘                          └─────────────┘

### AuthInterceptor

```typescript
// core/auth/auth.interceptor.ts
export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const token = localStorage.getItem('token');

  if (token) {
    const cloned = req.clone({
      setHeaders: { Authorization: `Bearer ${token}` }
    });
    return next(cloned);
  }

  return next(req);
};
```

---

## 🛡️ Perfis de Acesso e Rotas Protegidas

O roteamento é protegido por guards baseados no perfil JWT decodificado:

```typescript
// app.routes.ts
export const routes: Routes = [
  { path: '', loadComponent: () => import('./features/home/home.component') },
  { path: 'login', loadComponent: () => import('./features/auth/login/login.component') },
  { path: 'cadastro', loadComponent: () => import('./features/auth/register/register.component') },
  { path: 'servicos', loadComponent: () => import('./features/servicos/lista/servicos-lista.component') },
  { path: 'servicos/:id', loadComponent: () => import('./features/servicos/detalhe/servico-detalhe.component') },
  { path: 'unidades', loadComponent: () => import('./features/unidades/lista/unidades-lista.component') },
  {
    path: 'admin',
    canActivate: [adminGuard],
    loadComponent: () => import('./features/admin/dashboard/admin-dashboard.component')
  },
  { path: '**', redirectTo: '' }
];
```

| Rota | Guard | Perfil necessário |
|---|---|---|
| `/` | — | Público |
| `/servicos` | — | Público |
| `/unidades` | — | Público |
| `/login` | — | Público |
| `/cadastro` | — | Público |
| `/me` | `authGuard` | USER |
| `/admin` | `adminGuard` | ADMIN |

---

## ▶️ Como Executar o Projeto

### Pré-requisitos

- Node.js 20+
- npm 9+
- Angular CLI 19 (`npm install -g @angular/cli`)
- API [GuiaServPublico](https://github.com/nicholasfocke/guia-serv-publico) rodando em `localhost:8080`

### Passo a passo

```bash
# 1. Clone o repositório
git clone https://github.com/nicholasfocke/guia-serv-front.git
cd guia-serv-front

# 2. Instale as dependências
npm install

# 3. Inicie o servidor de desenvolvimento
ng serve

# 4. Acesse no navegador
# http://localhost:4200
```

### Build para produção

```bash
# Gera os arquivos otimizados em /dist
ng build --configuration production
```

---

## ⚙️ Variáveis de Ambiente

A URL da API é definida nos arquivos de environment — **nunca hardcoded nos services**.

```typescript
// src/environments/environment.ts (desenvolvimento)
export const environment = {
  production: false,
  apiUrl: 'http://localhost:8080/api'
};
```

```typescript
// src/environments/environment.prod.ts (produção)
export const environment = {
  production: true,
  apiUrl: 'https://sua-api.dominio.com/api'
};
```

Para alterar a URL da API em desenvolvimento, edite apenas `environment.ts`. O Angular CLI substitui automaticamente pelo arquivo `environment.prod.ts` no build de produção.

---

## 🖥️ Telas Implementadas

| Tela | Rota | Descrição |
|---|---|---|
| Home | `/` | Página inicial com busca, categorias, serviços em destaque e unidades disponíveis |
| Login | `/login` | Autenticação com e-mail e senha, retorno do token JWT |
| Cadastro | `/cadastro` | Registro de novo usuário com perfil USER |
| Serviços | `/servicos` | Listagem completa com busca parcial por nome e filtro por categoria |
| Detalhe do serviço | `/servicos/:id` | Documentos exigidos, unidades que oferecem o serviço e avaliações |
| Unidades | `/unidades` | Listagem de unidades com nome, endereço, horários e status (aberto/fechado) |
| Detalhe da unidade | `/unidades/:id` | Serviços disponíveis, horários de funcionamento e avaliações |
| Painel Admin | `/admin` | Dashboard com métricas, CRUD de serviços, unidades, documentos e horários |

---

## 🚧 Melhorias Futuras

- [ ] Modo escuro (dark mode) com variáveis CSS
- [ ] Paginação nas listagens de serviços e unidades
- [ ] Mapa interativo com localização das unidades (Google Maps / Leaflet)
- [ ] Notificações toast para feedback de ações do usuário
- [ ] Skeleton loading nas listagens
- [ ] PWA (Progressive Web App) para acesso offline e instalação mobile
- [ ] Testes unitários com Jest + Angular Testing Library
- [ ] Testes E2E com Cypress ou Playwright
- [ ] Pipeline CI/CD com GitHub Actions (build + lint + testes)
- [ ] Deploy automatizado (Vercel / Netlify / Firebase Hosting)
- [ ] Internacionalização (i18n) para suporte multilíngue

---

## 🔗 Repositório da API

Este frontend consome a API **GuiaServPublico**, desenvolvida em Java 21 + Spring Boot 3.

➡️ **[github.com/nicholasfocke/guia-serv-publico](https://github.com/nicholasfocke/guia-serv-publico)**

Consulte o README do backend para instruções de como subir a API localmente ou via Docker.

---

## 👨‍💻 Autor

<div align="center">

**Nicholas Focke**

Frontend & Backend Developer · Angular · Java · Spring Boot

[![GitHub](https://img.shields.io/badge/GitHub-nicholasfocke-181717?style=for-the-badge&logo=github)](https://github.com/nicholasfocke)
[![LinkedIn](https://img.shields.io/badge/LinkedIn-nicholas--focke-0A66C2?style=for-the-badge&logo=linkedin)](https://linkedin.com/in/nicholas-focke-833049269)

</div>

---

<div align="center">
· © Nicholas Focke

</div>
