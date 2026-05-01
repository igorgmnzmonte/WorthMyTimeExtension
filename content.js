function injectTimeTagsInGrid() {
    chrome.storage.local.get(['salary', 'salaryType', 'timeInput', 'workScale', 'timeFormat'], (data) => {
        if (!data.salary || !data.timeInput || !data.workScale) return;

        const salary = parseFloat(data.salary);
        const type = data.salaryType || 'monthly';
        const timeValue = parseFloat(data.timeInput);
        const scale = data.workScale;
        const format = data.timeFormat || 'auto';
        
        let hourlyRate = 0;
        const dailyDivisor = (scale === 'custom') ? 8 : timeValue;

        if (type === 'hourly') {
            hourlyRate = salary;
        } else if (type === 'daily') {
            hourlyRate = salary / dailyDivisor;
        } else {
            let monthlyHours = 0;
            if (scale === '12x36') monthlyHours = 180;
            else if (scale === '5x2') monthlyHours = (timeValue * 5) * 4.33; 
            else if (scale === '6x1') monthlyHours = (timeValue * 6) * 4.33;
            else if (scale === 'custom') monthlyHours = timeValue * 4.33; 
            
            hourlyRate = salary / monthlyHours;
        }

        const currentUrl = window.location.href;

        const formatTime = (cleanPrice) => {
            const hours = cleanPrice / hourlyRate;
            if (format === 'minutes') return `${(hours * 60).toFixed(0)} Min`;
            if (format === 'hours') return `${hours.toFixed(1)}h`;
            if (format === 'days') return `${(hours / dailyDivisor).toFixed(1)} Dias`;
            if (hours < 1) return `${(hours * 60).toFixed(0)} Min`;
            if (hours < 24) return `${hours.toFixed(1)}h`;
            return `${hours.toFixed(0)}h (${(hours / dailyDivisor).toFixed(1)}d)`;
        };

        const createBadge = (timeText) => {
            const badge = document.createElement('div');
            // Mantemos a classe para identificação
            badge.className = 'wmt-grid-badge'; 
            badge.style.cssText = `
                background-color: #ecfdf5 !important;
                color: #047857 !important;
                border: 1px solid #a7f3d0 !important;
                padding: 4px 8px !important;
                margin-top: 4px !important;
                margin-bottom: 4px !important;
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

        // --- INJEÇÃO NA AMAZON (Lógica Corrigida) ---
        if (currentUrl.includes("amazon.com.br")) {
            // Seleciona o container visual do preço (funciona em homes e buscas)
            const priceContainers = document.querySelectorAll('.a-price');
            
            priceContainers.forEach(container => {
                // CORREÇÃO AQUI: Verificamos se o VIZINHO IMEDIATO já é nossa etiqueta
                const nextElement = container.nextElementSibling;
                if (nextElement && nextElement.classList.contains('wmt-grid-badge')) {
                    return; // Já existe, pula
                }

                // Tenta pegar o preço inteiro de dentro do container
                const wholeNumberEl = container.querySelector('.a-price-whole');
                if (wholeNumberEl) {
                    // Limpa o texto (remove pontos de milhar e trata vírgula)
                    const priceText = wholeNumberEl.innerText.replace(/\./g, '').replace(',', '.');
                    const cleanPrice = parseFloat(priceText);
                    
                    if (cleanPrice > 0) {
                        const badge = createBadge(formatTime(cleanPrice));
                        // Inserimos COMO VIZINHO (afterend)
                        container.insertAdjacentElement('afterend', badge);
                    }
                }
            });
        } 
        
        // --- INJEÇÃO NO MERCADO LIVRE (Mantida, pois já estava correta) ---
        else if (currentUrl.includes("mercadolivre.com.br")) {
            const priceContainers = document.querySelectorAll('.ui-search-price__second-line, .poly-price__current');
            priceContainers.forEach(container => {
                // No ML inserimos DENTRO do container, então querySelector interno funciona
                if (container.querySelector('.wmt-grid-badge')) return;
                
                const fractionElement = container.querySelector('.andes-money-amount__fraction');
                if (fractionElement) {
                    const priceText = fractionElement.innerText.replace(/\./g, '');
                    const cleanPrice = parseFloat(priceText);
                    
                    if (cleanPrice > 0) {
                        const badge = createBadge(formatTime(cleanPrice));
                        container.appendChild(badge);
                    }
                }
            });
        }
    });
}

setInterval(injectTimeTagsInGrid, 2000);