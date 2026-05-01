# ⏱️ WorthMyTime - O custo real das coisas

O **WorthMyTime** é uma extensão para Google Chrome (e calculadora web) que transforma a maneira como você enxerga os preços na internet. Em vez de ver o valor de um produto em Reais, Dólares ou Euros, você visualiza **quanto tempo da sua vida** (em dias, horas ou minutos de trabalho) será necessário para comprá-lo.

A ferramenta foi projetada para gerar conscientização financeira e evitar compras por impulso, adaptando-se perfeitamente à sua realidade de ganhos e escala de trabalho.

---

## ✨ Funcionalidades Principais

* **Cálculo Altamente Personalizado:** Leva em consideração se você ganha por Mês, por Dia ou por Hora.
* **Escalas de Trabalho Brasileiras:** Suporte nativo para jornadas CLT e plantões (5x2, 6x1, 12x36) ou escalas customizadas.
* **Integração com E-commerce:** Injeta etiquetas visuais não intrusivas diretamente nas vitrines e páginas de busca das principais lojas.
* **Conversão Visual:** Escolha se deseja ver o tempo em Minutos, Horas, Dias úteis de trabalho ou deixe no modo Automático.
* **Múltiplas Moedas:** Suporte a BRL (R$), USD ($) e EUR (€).

---

## 🛒 Lojas Suportadas Automaticamente

A extensão lê os preços nativamente e adiciona as etiquetas verdes de tempo nos seguintes sites:

| Loja | Status de Integração |
| :--- | :--- |
| **Amazon Brasil** | Funcionando na Home, Buscas e Página do Produto |
| **Mercado Livre** | Funcionando na Home, Buscas e Página do Produto |

> **Nota:** Estamos constantemente trabalhando para adicionar mais lojas (como Shopee e AliExpress) nas próximas versões.

---

## 🚀 Como Instalar (Modo Desenvolvedor)

Como a extensão ainda não está publicada na Chrome Web Store, você pode instalá-la manualmente no seu navegador em menos de 1 minuto:

1. Baixe os arquivos deste repositório ou clone usando o Git:
   `git clone https://github.com/SEU-USUARIO/worthmytime.git`
2. Abra o Google Chrome e digite na barra de endereços: `chrome://extensions/`
3. No canto superior direito, ative o botão **"Modo do desenvolvedor"**.
4. Clique no botão **"Carregar sem compactação"** (ou *Load unpacked*).
5. Selecione a pasta onde você salvou os arquivos do projeto.
6. Pronto! O ícone do WorthMyTime aparecerá na barra de extensões do seu navegador.

---

## 📖 Como Usar

1. Clique no ícone do **WorthMyTime** no topo do seu navegador para abrir o painel.
2. Preencha suas configurações financeiras:
   * **Moeda e Exibição:** Escolha R$ e como quer ver o tempo (ex: Dias).
   * **Seus Ganhos:** Insira seu salário líquido e escolha se ele é Mensal, Diário ou por Hora.
   * **Sua Escala:** Escolha sua rotina (ex: 5x2, 12x36).
3. **Teste Rápido:** Você pode usar o campo "Teste um Preço" diretamente no painel para cálculos avulsos.
4. **Mágica em Ação:** Acesse a Amazon ou o Mercado Livre. Os preços dos produtos agora terão uma etiqueta verde indicando o tempo exato de trabalho necessário para comprá-los!

---

## 🛠️ Estrutura do Projeto

O projeto foi construído utilizando Vanilla JavaScript, HTML5 e CSS3, sem dependência de bibliotecas externas, garantindo alta velocidade e baixo consumo de memória.

* `manifest.json`: Arquivo de configuração e permissões da extensão.
* `popup.html` / `popup.js`: Interface e lógica do painel da extensão.
* `content.js`: Motor de injeção que roda em segundo plano nas lojas suportadas para inserir as etiquetas.
* `index.html`: Versão web independente (Calculadora de Tela Cheia).

---

## 🤝 Como Contribuir

Contribuições são muito bem-vindas! Se você deseja adicionar suporte a uma nova loja ou melhorar a matemática do projeto:

1. Faça um Fork do projeto
2. Crie uma branch para sua feature (`git checkout -b feature/NovaLoja`)
3. Faça o commit das suas alterações (`git commit -m 'Adiciona suporte para NovaLoja'`)
4. Faça o push para a branch (`git push origin feature/NovaLoja`)
5. Abra um Pull Request

---

## 📄 Licença

Este projeto está sob a licença MIT. Sinta-se livre para usá-lo, modificá-lo e distribuí-lo.
