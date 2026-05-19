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
