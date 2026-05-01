# ⏱️ WorthMyTime Pro - O Custo Real das Coisas

[![Licença: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](https://opensource.org/licenses/MIT)
[![Versão](https://img.shields.io/badge/Vers%C3%A3o-1.1-brightgreen.svg)](#)
[![Stack](https://img.shields.io/badge/Stack-Vanilla_JS-yellow.svg)](#)

<p align="center">
  <img src="assets/logo-final.jpg" width="300" alt="WorthMyTime Logo - Balança de Tempo e Dinheiro">
</p>

O **WorthMyTime Pro** é uma extensão de produtividade e conscientização financeira para Google Chrome. Ela transforma a maneira como você enxerga os preços na internet: em vez de visualizar apenas o valor monetário de um produto, você visualiza **quanto tempo da sua vida** (em horas e minutos de trabalho) será necessário para adquiri-lo.

A ferramenta injeta etiquetas visuais minimalistas e nativas diretamente nas vitrines das maiores lojas de e-commerce, ajudando a combater compras por impulso através da tangibilização do seu esforço.

---

## ✨ Funcionalidades em Destaque

- **Injeção Dinâmica e Nativa:** Integra-se ao design original de cada site de forma limpa e profissional, sem quebrar os layouts de grade.
- **Radares Antifraude de Preço:** Algoritmo estrutural inteligente que identifica e ignora preços antigos/riscados, calculando o tempo sempre em cima do valor real que será pago.
- **Cálculo Desacoplado:** Conversão em tempo real baseada no seu salário líquido e horas trabalhadas mensalmente.
- **Performance:** Construído 100% em Vanilla JavaScript, sem bibliotecas externas, garantindo zero impacto no carregamento das lojas.

---

## 🛒 Lojas Suportadas

A extensão possui injetores específicos adaptados à árvore do DOM das seguintes lojas:

| E-commerce | Cobertura de Injeção | Estilo Visual |
| :--- | :--- | :--- |
| **Amazon Brasil** | Vitrines, Buscas e Página do Produto | Nativo Integrado |
| **Mercado Livre** | Home, Buscas e Listagens | Nativo Integrado |
| **Shopee Brasil** | Grid Principal de Produtos e Buscas | Nativo Integrado |
| **AliExpress** | Global, Choice e Combos de Ofertas | Nativo Integrado |

---

## 🛠️ Arquitetura e Estrutura do Projeto

O projeto segue padrões modernos de desenvolvimento de extensões de navegador (Manifest V3), utilizando arquitetura modular para facilitar manutenção e escalabilidade.

```text
WorthMyTimePro/
├── manifest.json         # Configurações e permissões (Manifest V3)
├── popup/                # Interface da extensão
│   ├── popup.html
│   ├── popup.css
│   └── popup.js
└── scripts/              # Injeção de conteúdo (Content Scripts)
    ├── config.js         # Variáveis de negócio e parametrização do usuário
    ├── utils.js          # Motores de cálculo e geradores de componentes DOM
    ├── content.js        # Regras de observação e injeção por domínio
    └── content.css       # Camada de estilos (CSS) isolada da lógica
🚀 Instalação (Modo Desenvolvedor)
Clone este repositório em sua máquina:

Bash
git clone [https://github.com/seu-usuario/worthmytime-pro.git](https://github.com/seu-usuario/worthmytime-pro.git)
Abra o Google Chrome e acesse chrome://extensions/.

No canto superior direito, ative o "Modo do desenvolvedor".

Clique em "Carregar sem compactação" (ou Load unpacked).

Selecione a pasta principal do projeto. O ícone da extensão ficará disponível em seu navegador.

⚙️ Configuração Pessoal
Para que a ferramenta calcule o tempo exato da sua realidade, edite as variáveis no arquivo scripts/config.js antes de carregar a extensão no Chrome:

JavaScript
// scripts/config.js
const SALARY_PER_MONTH = 3000; // Altere para seu salário líquido mensal
const HOURS_PER_MONTH = 220;   // Altere para sua jornada de horas mensais
Dica: Após alterar as configurações, clique no botão de "Recarregar" a extensão na aba chrome://extensions/.

🤝 Como Contribuir
Contribuições são extremamente bem-vindas! Se você deseja mapear o DOM de uma nova loja ou aprimorar os radares atuais:

Faça um Fork do projeto.

Crie uma branch para a sua feature (git checkout -b feature/suporte-nova-loja).

Utilize as funções globais base do arquivo utils.js (como createTimeDisplay()).

Faça o commit das suas alterações (git commit -m 'feat: adiciona suporte para NovaLoja').

Faça o push para a branch (git push origin feature/suporte-nova-loja).

Abra um Pull Request.

📄 Licença
Este projeto está distribuído sob a licença MIT. Sinta-se à vontade para usá-lo, modificá-lo e distribuí-lo.

Desenvolvido para promover consciência financeira e respeito ao próprio tempo.
