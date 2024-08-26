# Nome do Projeto

Este projeto é uma plataforma integrada que utiliza tecnologias modernas como Vercel, React, Flask, e a API da OpenAI para fornecer uma experiência interativa para os clientes da Stone. A plataforma inclui um chatbot, um dashboard dinâmico desenvolvido com PowerBI, e uma seção educacional que gera automaticamente blogs com textos e imagens utilizando o GPT-4.

## Índice

- [Funcionalidades](#funcionalidades)
- [Tecnologias Utilizadas](#tecnologias-utilizadas)
- [Instalação](#instalação)
- [Uso](#uso)


## Funcionalidades

- **Chatbot Interativo**: Converse em tempo real com um assistente virtual inteligente, capaz de entender e responder a uma ampla gama de perguntas e ajudar no dia a dia do cliente, seja com texto ou com voz.
- **Dashboard Personalizável**: Visualize dados importantes de maneira intuitiva e interativa, com gráficos e relatórios dinâmicos.
- **Gerador Automático de Conteúdo**: Crie blogs automaticamente, com textos e imagens gerados pelo GPT-4, ideal para educação e marketing de conteúdo.

## Tecnologias Utilizadas

- **Frontend**: React, hospedado na Vercel.
- **Backend**: Flask, para integração com a API da OpenAI.
- **Integração com OpenAI**: Utilização da API da OpenAI para o chatbot e geração de conteúdo.
- **Visualização de Dados**: PowerBI, para o dashboard interativo.
- **Hospedagem**: Plataforma hospedada na Vercel.

## Instalação

Para instalar e rodar o projeto localmente, siga os passos abaixo:

1. Clone este repositório:
   ```bash
   git clone https://github.com/MartinSteinmayer/brasahacks
   ```
2. Configure suas variáveis de ambiente, principalmente a OPEN_API_KEY, em um arquivo .env. 
3. Instale as dependências:
    ```bash
    npm i -g vercel
    vercel link
    vercel env pull
    pnpm install
    pnpm dev
    ```
O App deveria agora estar rodando em **localhost:3000.**

## USO

Caso queira fazer uma build estável do app, rode:
  ```bash
   pnpm next build
   pnpm next start
   ``` 