// ==========================================
// CONFIGURAÇÕES DO USUÁRIO (Salário e Horas)
// ==========================================
const SALARY_PER_MONTH = 3000; // Altere para seu salário real
const HOURS_PER_MONTH = 220;   // Altere para suas horas mensais
const HOURLY_WAGE = SALARY_PER_MONTH / HOURS_PER_MONTH;

// ==========================================
// FUNÇÕES AUXILIARES
// ==========================================

// Converte o valor em reais para horas/minutos trabalhados
function formatTime(price) {
    const totalHours = price / HOURLY_WAGE;
    if (totalHours < 1) {
        const minutes = Math.round(totalHours * 60);
        return `${minutes} Min`;
    }
    return `${totalHours.toFixed(1)}h`;
}

// Estilo Unificado: Ícone Sutil (Inspirado no AliExpress)
function createTimeDisplay(text) {
    const container = document.createElement('div');
    container.className = 'wmt-time-display';
    container.style.cssText = `
        display: inline-flex !important;
        align-items: center !important;
        vertical-align: middle !important;
        margin-left: 8px !important;
        background: transparent !important;
        padding: 0 !important;
        border: none !important;
        font-family: inherit !important;
    `;

    const icon = document.createElement('span');
    // Ícone de relógio em SVG
    icon.innerHTML = `<svg width="12" height="12" viewBox="0 0 12 12" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M6 11C8.76142 11 11 8.76142 11 6C11 3.23858 8.76142 1 6 1C3.23858 1 1 3.23858 1 6C1 8.76142 3.23858 11 6 11Z" stroke="#888888" stroke-width="1.2" stroke-linecap="round" stroke-linejoin="round"/><path d="M6 3.5V6L7.5 7.5" stroke="#888888" stroke-width="1.2" stroke-linecap="round" stroke-linejoin="round"/></svg>`;
    icon.style.cssText = `
        display: inline-flex !important;
        margin-right: 4px !important;
    `;

    const textElement = document.createElement('span');
    textElement.textContent = text;
    textElement.style.cssText = `
        color: #047857 !important; /* Verde sutil e profissional */
        font-size: 13px !important;
        font-weight: 600 !important;
        line-height: 1 !important;
    `;

    container.appendChild(icon);
    container.appendChild(textElement);

    return container;
}

// ==========================================
// LÓGICA PRINCIPAL DE BUSCA E INJEÇÃO
// ==========================================

function processPrices() {
    const currentUrl = window.location.href;

    // --- AMAZON ---
    if (currentUrl.includes("amazon.com.br")) {
        const priceContainers = document.querySelectorAll('.a-price');
        priceContainers.forEach(container => {
            if (container.nextElementSibling && container.nextElementSibling.classList.contains('wmt-time-display')) return;

            const wholeNumberEl = container.querySelector('.a-price-whole');
            if (wholeNumberEl) {
                const priceText = wholeNumberEl.innerText.replace(/\./g, '').replace(',', '.');
                const cleanPrice = parseFloat(priceText);
                if (cleanPrice > 0) {
                    container.insertAdjacentElement('afterend', createTimeDisplay(formatTime(cleanPrice)));
                }
            }
        });
    } 
    
    // --- MERCADO LIVRE ---
    else if (currentUrl.includes("mercadolivre.com.br")) {
        const priceContainers = document.querySelectorAll('.ui-search-price__second-line, .poly-price__current');
        priceContainers.forEach(container => {
            if (container.querySelector('.wmt-time-display')) return;
            
            const fractionElement = container.querySelector('.andes-money-amount__fraction');
            if (fractionElement) {
                const priceText = fractionElement.innerText.replace(/\./g, '');
                const cleanPrice = parseFloat(priceText);
                if (cleanPrice > 0) {
                    container.appendChild(createTimeDisplay(formatTime(cleanPrice)));
                }
            }
        });
    }

    // --- SHOPEE ---
    else if (currentUrl.includes("shopee.com.br")) {
        const allSpans = document.querySelectorAll('span');
        allSpans.forEach((span) => {
            if (span.textContent.includes('R$')) {
                let isOldPrice = false;
                let currentNode = span;
                for (let i = 0; i < 4; i++) {
                    if (!currentNode) break;
                    let sibling = currentNode.nextElementSibling;
                    while (sibling) {
                        if (sibling.textContent.includes('R$')) { isOldPrice = true; break; }
                        sibling = sibling.nextElementSibling;
                    }
                    if (isOldPrice) break;
                    currentNode = currentNode.parentElement;
                }
                if (isOldPrice) return; 

                const parentContainer = span.parentElement;
                if (parentContainer) {
                    let cleanText = parentContainer.textContent.replace(/\s+/g, '');
                    const priceMatch = cleanText.match(/\d{1,3}(?:\.\d{3})*(?:,\d{2})?|\d+(?:,\d{2})?/);
                    if (priceMatch) {
                        let priceText = priceMatch[0].replace(/\./g, '').replace(',', '.');
                        const cleanPrice = parseFloat(priceText);
                        if (cleanPrice > 0) {
                            let safeContainer = parentContainer;
                            while (safeContainer && safeContainer.classList && safeContainer.classList.contains('truncate')) {
                                safeContainer = safeContainer.parentElement;
                            }
                            if (safeContainer && !safeContainer.querySelector('.wmt-time-display')) {
                                safeContainer.appendChild(createTimeDisplay(formatTime(cleanPrice)));
                            }
                        }
                    }
                }
            }
        });
    }

    // --- ALIEXPRESS ---
    else if (currentUrl.includes("aliexpress.com")) {
        const allSpans = document.querySelectorAll('span');
        allSpans.forEach((span) => {
            if (span.textContent.includes('R$')) {
                let isOldPrice = false;
                let checkNode = span;
                for (let i = 0; i < 4; i++) {
                    if (!checkNode) break;
                    const style = window.getComputedStyle(checkNode);
                    const inlineStyle = checkNode.getAttribute('style') || '';
                    if (style.textDecoration.includes('line-through') || inlineStyle.includes('line-through')) {
                        isOldPrice = true;
                        break;
                    }
                    checkNode = checkNode.parentElement;
                }
                if (isOldPrice) return; 

                const parentContainer = span.parentElement;
                if (parentContainer) {
                    let cleanText = parentContainer.textContent.replace(/\s+/g, '');
                    const priceMatch = cleanText.match(/\d{1,3}(?:\.\d{3})*(?:,\d{2})?|\d+(?:,\d{2})?/);
                    if (priceMatch) {
                        let priceText = priceMatch[0].replace(/\./g, '').replace(',', '.');
                        const cleanPrice = parseFloat(priceText);
                        if (cleanPrice > 0 && !parentContainer.querySelector('.wmt-time-display')) {
                            parentContainer.appendChild(createTimeDisplay(formatTime(cleanPrice)));
                        }
                    }
                }
            }
        });
    }
}

// Inicialização
processPrices();
setInterval(processPrices, 1500);