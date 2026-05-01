// scripts/content.js

function processPrices() {
    const currentUrl = window.location.href;

    // --- LÓGICA AMAZON ---
    if (currentUrl.includes("amazon.com.br")) {
        document.querySelectorAll('.a-price').forEach(container => {
            if (container.nextElementSibling?.classList.contains('wmt-time-display')) return;
            const whole = container.querySelector('.a-price-whole');
            if (whole) {
                const price = parseFloat(whole.innerText.replace(/\./g, '').replace(',', '.'));
                if (price > 0) container.insertAdjacentElement('afterend', createTimeDisplay(formatTime(price)));
            }
        });
    } 
    
    // --- LÓGICA MERCADO LIVRE ---
    else if (currentUrl.includes("mercadolivre.com.br")) {
        document.querySelectorAll('.ui-search-price__second-line, .poly-price__current').forEach(container => {
            if (container.querySelector('.wmt-time-display')) return;
            const fraction = container.querySelector('.andes-money-amount__fraction');
            if (fraction) {
                const price = parseFloat(fraction.innerText.replace(/\./g, ''));
                if (price > 0) container.appendChild(createTimeDisplay(formatTime(price)));
            }
        });
    }

    // --- LÓGICA SHOPEE ---
    else if (currentUrl.includes("shopee.com.br")) {
        document.querySelectorAll('span').forEach((span) => {
            if (span.textContent.includes('R$')) {
                // Radar de preço antigo (simplificado para economia de processamento)
                if (window.getComputedStyle(span).textDecoration.includes('line-through')) return;

                const parent = span.parentElement;
                if (parent && !parent.querySelector('.wmt-time-display')) {
                    const cleanText = parent.textContent.replace(/\s+/g, '');
                    const match = cleanText.match(/\d{1,3}(?:\.\d{3})*(?:,\d{2})?|\d+(?:,\d{2})?/);
                    if (match) {
                        const price = parseFloat(match[0].replace(/\./g, '').replace(',', '.'));
                        if (price > 0) parent.appendChild(createTimeDisplay(formatTime(price)));
                    }
                }
            }
        });
    }

    // --- LÓGICA ALIEXPRESS ---
    else if (currentUrl.includes("aliexpress.com")) {
        document.querySelectorAll('span').forEach((span) => {
            if (span.textContent.includes('R$')) {
                const style = window.getComputedStyle(span);
                if (style.textDecoration.includes('line-through')) return;

                const parent = span.parentElement;
                if (parent && !parent.querySelector('.wmt-time-display')) {
                    const cleanText = parent.textContent.replace(/\s+/g, '');
                    const match = cleanText.match(/\d{1,3}(?:\.\d{3})*(?:,\d{2})?|\d+(?:,\d{2})?/);
                    if (match) {
                        const price = parseFloat(match[0].replace(/\./g, '').replace(',', '.'));
                        if (price > 0) parent.appendChild(createTimeDisplay(formatTime(price)));
                    }
                }
            }
        });
    }
}

// Inicialização rápida e observação contínua
processPrices();
setInterval(processPrices, 1500);