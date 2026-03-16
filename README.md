# React Todo App Add and Delete

Aplicação desenvolvida em React com foco em adicionar e remover todos utilizando uma API externa, com componentização clara, separação de responsabilidades e tratamento de estados de carregamento e erro.

[DEMO LINK](https://Igor-hrm.github.io/react_todo-app-add-and-delete/)

---

## Sobre o projeto

Este projeto é a segunda parte do React Todo App com API. A aplicação permite que o usuário adicione novos todos, remova todos individuais ou todos completados, e trate respostas de sucesso e erro da API.

A aplicação foi construída do zero respeitando o markup e as classes CSS fornecidas, garantindo compatibilidade total com os testes automatizados.

---

## Tecnologias utilizadas

- React
- TypeScript
- SCSS
- Bulma CSS
- Vite
- GitHub Pages

---

## Funcionalidades implementadas

**Adicionar todos:**

- Criação de novos todos via input de texto.
- Trim do título antes de enviar.
- Loader temporário (`tempTodo`) exibido até a resposta da API.
- Input desabilitado enquanto a requisição está em andamento.
- Notificação de erro caso a requisição falhe.
- Foco automático no input após adicionar ou falhar.

**Remover todos:**

- Remoção individual com loader enquanto espera a resposta da API.
- Botão `Clear completed` habilitado apenas quando houver todos completados.
- Processamento de múltiplas exclusões simultâneas.
- Notificação de erro para todos que falharem na exclusão, mantendo os restantes na lista.

**Extras:**

- Foco automático no input após ações.
- Estado de carregamento (`processingId`) para mostrar loaders nos itens corretos.

## Conceitos praticados

- Componentização no React
- Uso de Hooks (`useState`, `useEffect`, `useRef`)
- Renderização condicional e mapeamento de listas
- Comunicação entre componentes via props
- Tratamento de estados de carregamento e erro
- Foco automático em elementos do DOM
- Integração com API externa (POST, PATCH, DELETE)

---

## Como rodar o projeto localmente

Clone o repositório:

```bash
git clone https://github.com/Igor-hrm/react_todo-app-add-and-delete.git
```
