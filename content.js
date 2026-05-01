// Função para criar e injetar as etiquetas em múltiplos produtos
function injectTimeTagsInGrid() {
    chrome.storage.local.get(['salary', 'hoursWeek'], (data) => {
        if (!data.salary || !data.hoursWeek) return;

        const hourlyRate = parseFloat(data.salary) / (parseFloat(data.hoursWeek) * 4.33);
        const currentUrl = window.location.href;

        // Função auxiliar para formatar o texto de forma mais curta para vitrines
        const formatTime = (cleanPrice) => {
            const hoursNeeded = cleanPrice / hourlyRate;
            if (hoursNeeded < 1) {
                return `${(hoursNeeded * 60).toFixed(0)} Min`;
            } else if (hoursNeeded < 24) {
                return `${hoursNeeded.toFixed(1)}h`;
            } else {
                const days = (hoursNeeded / 8).toFixed(1);
                return `${hoursNeeded.toFixed(0)}h (${days}d)`;
            }
        };

        // Função auxiliar para montar a etiqueta visual (Menor para caber nos cards)
        const createBadge = (timeText) => {
            const badge = document.createElement('div');
            badge.className = 'wmt-grid-badge'; // Classe para evitar duplicatas
            badge.style.cssText = `
                background-color: #ecfdf5 !important;
                color: #047857 !important;
                border: 1px solid #a7f3d0 !important;
                padding: 4px 8px !important;
                margin-top: 4px !important;
                border-radius: 6px !important;
                font-weight: bold !important;
                font-size: 11px !important;
                font-family: sans-serif !important;
                display: inline-block !important;
                z-index: 10 !important;
                box-shadow: 0 1px 2px rgba(0,0,0,0.05) !important;
            `;
            badge.innerHTML = `⏱️ ${timeText}`;
            return badge;
        };

        // --- LÓGICA PARA A AMAZON (HOME E BUSCAS) ---
        if (currentUrl.includes("amazon.com.br")) {
            // Pega todos os preços visíveis na tela
            const priceElements = document.querySelectorAll('.a-price-whole');
            
            priceElements.forEach(priceEl => {
                // Se o elemento pai já tem a nossa etiqueta, pula para o próximo
                if (priceEl.parentElement.parentElement.querySelector('.wmt-grid-badge')) return;
                
                const priceText = priceEl.innerText.replace(/\./g, '').replace(',', '.');
                const cleanPrice = parseFloat(priceText);
                
                if (cleanPrice > 0) {
                    const badge = createBadge(formatTime(cleanPrice));
                    // Injeta a etiqueta logo abaixo do bloco de preço da Amazon
                    priceEl.parentElement.parentElement.insertAdjacentElement('afterend', badge);
                }
            });
        } 
        
        // --- LÓGICA PARA O MERCADO LIVRE (HOME E BUSCAS) ---
        else if (currentUrl.includes("mercadolivre.com.br")) {
            // Pega os containers de preço dos cards de produto
            const priceContainers = document.querySelectorAll('.ui-search-price__second-line, .poly-price__current');
            
            priceContainers.forEach(container => {
                // Se já colocamos a etiqueta neste card, ignora
                if (container.parentElement.querySelector('.wmt-grid-badge')) return;
                
                const fractionElement = container.querySelector('.andes-money-amount__fraction');
                
                if (fractionElement) {
                    const priceText = fractionElement.innerText.replace(/\./g, '');
                    const cleanPrice = parseFloat(priceText);
                    
                    if (cleanPrice > 0) {
                        const badge = createBadge(formatTime(cleanPrice));
                        // Injeta a etiqueta logo após o preço no card
                        container.insertAdjacentElement('afterend', badge);
                    }
                }
            });
        }
    });
}

// Como os produtos na Home e nas buscas carregam enquanto o usuário rola a tela (Lazy Load),
// executamos a verificação a cada 2 segundos para pegar os produtos novos.
setInterval(injectTimeTagsInGrid, 1000);