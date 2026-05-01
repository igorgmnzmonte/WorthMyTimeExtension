function injectTimeTagsInGrid() {
    // Puxa as novas variáveis salvas no storage
    chrome.storage.local.get(['salary', 'timeInput', 'workScale', 'timeFormat'], (data) => {
        if (!data.salary || !data.timeInput || !data.workScale) return;

        const salary = parseFloat(data.salary);
        const timeValue = parseFloat(data.timeInput);
        const scale = data.workScale;
        const format = data.timeFormat || 'auto';
        
        let monthlyHours = 0;

        // Define as horas mensais com base na escala
        if (scale === '12x36') {
            monthlyHours = 180;
        } else if (scale === '5x2') {
            monthlyHours = (timeValue * 5) * 4.33; 
        } else if (scale === '6x1') {
            monthlyHours = (timeValue * 6) * 4.33;
        } else if (scale === 'custom') {
            monthlyHours = timeValue * 4.33; 
        }

        const hourlyRate = salary / monthlyHours;
        const dailyDivisor = (scale === 'custom') ? 8 : timeValue;
        const currentUrl = window.location.href;

        // Função para formatar o texto da etiqueta com base na preferência do usuário
        const formatTime = (cleanPrice) => {
            const hours = cleanPrice / hourlyRate;
            
            if (format === 'minutes') {
                return `${(hours * 60).toFixed(0)} Min`;
            } else if (format === 'hours') {
                return `${hours.toFixed(1)}h`;
            } else if (format === 'days') {
                return `${(hours / dailyDivisor).toFixed(1)} Dias`;
            } else {
                // Modo Automático para Vitrines (Abreviado)
                if (hours < 1) return `${(hours * 60).toFixed(0)} Min`;
                if (hours < 24) return `${hours.toFixed(1)}h`;
                return `${hours.toFixed(0)}h (${(hours / dailyDivisor).toFixed(1)}d)`;
            }
        };

        const createBadge = (timeText) => {
            const badge = document.createElement('div');
            badge.className = 'wmt-grid-badge'; 
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

        // --- INJEÇÃO NA AMAZON ---
        if (currentUrl.includes("amazon.com.br")) {
            const priceElements = document.querySelectorAll('.a-price-whole');
            priceElements.forEach(priceEl => {
                if (priceEl.parentElement.parentElement.querySelector('.wmt-grid-badge')) return;
                
                const priceText = priceEl.innerText.replace(/\./g, '').replace(',', '.');
                const cleanPrice = parseFloat(priceText);
                
                if (cleanPrice > 0) {
                    const badge = createBadge(formatTime(cleanPrice));
                    priceEl.parentElement.parentElement.insertAdjacentElement('afterend', badge);
                }
            });
        } 
        // --- INJEÇÃO NO MERCADO LIVRE ---
        else if (currentUrl.includes("mercadolivre.com.br")) {
            const priceContainers = document.querySelectorAll('.ui-search-price__second-line, .poly-price__current');
            priceContainers.forEach(container => {
                if (container.parentElement.querySelector('.wmt-grid-badge')) return;
                
                const fractionElement = container.querySelector('.andes-money-amount__fraction');
                if (fractionElement) {
                    const priceText = fractionElement.innerText.replace(/\./g, '');
                    const cleanPrice = parseFloat(priceText);
                    
                    if (cleanPrice > 0) {
                        const badge = createBadge(formatTime(cleanPrice));
                        container.insertAdjacentElement('afterend', badge);
                    }
                }
            });
        }
    });
}

// Continua verificando a cada 2 segundos (suporta scroll na vitrine)
setInterval(injectTimeTagsInGrid, 2000);