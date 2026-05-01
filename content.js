function injectTimeTag() {
    chrome.storage.local.get(['salary', 'hoursWeek'], (data) => {
        if (!data.salary || !data.hoursWeek) return;

        const hourlyRate = parseFloat(data.salary) / (parseFloat(data.hoursWeek) * 4.33);
        let priceText = null;
        let targetElement = null; // O elemento ONDE vamos pendurar a tag
        const currentUrl = window.location.href;

        // --- SELEÇÃO ESPECÍFICA POR LOJA ---

        if (currentUrl.includes("amazon.com.br")) {
            // Seleciona o símbolo do Real no preço principal
            const priceSymbol = document.querySelector('.a-price-symbol');
            // O container do preço que queremos ficar de fora
            const priceContainer = document.querySelector('#corePriceDisplay_desktop_feature_div, #corePrice_feature_div');
            
            if (priceSymbol && priceContainer) {
                // Pega o texto do container pai do símbolo, que costuma ter o preço completo
                priceText = priceSymbol.parentElement.innerText;
                targetElement = priceContainer; // Vamos injetar DEPOIS desse container
            }
        } 
        else if (currentUrl.includes("mercadolivre.com.br")) {
            // Seleciona a fração do preço
            const priceFraction = document.querySelector('.ui-pdp-price__second-line .andes-money-amount__fraction');
            // O container da linha do preço
            const priceContainer = document.querySelector('.ui-pdp-price__second-line');
            
            if (priceFraction && priceContainer) {
                priceText = priceFraction.innerText;
                targetElement = priceContainer; // Vamos injetar DEPOIS desse container
            }
        }

        // --- LÓGICA DE CÁLCULO E INJEÇÃO (Visual Novo) ---

        if (priceText && targetElement && !document.getElementById('wmt-badge')) {
            // Limpeza do preço (remove R$, espaços, pontos e trata vírgula)
            const cleanPrice = parseFloat(priceText.replace('R$', '').replace(/\s/g, '').replace(/\./g, '').replace(',', '.'));
            
            if (cleanPrice > 0) {
                const hoursNeeded = cleanPrice / hourlyRate;
                
                let timeString = '';
                if (hoursNeeded < 1) {
                    timeString = `${(hoursNeeded * 60).toFixed(0)} Minutos`;
                } else if (hoursNeeded < 24) {
                    timeString = `${hoursNeeded.toFixed(1)} Horas`;
                } else {
                    const days = (hoursNeeded / 8).toFixed(1);
                    timeString = `${hoursNeeded.toFixed(0)} Horas (${days} dias úteis)`;
                }

                // Criação do Elemento com a NOVA PALETA (Branco e Verde)
                const badge = document.createElement('div');
                badge.id = 'wmt-badge';
                // CSS Inline para garantir que não sofra interferência do site
                badge.style.cssText = `
                    background-color: #ecfdf5 !important;
                    color: #047857 !important;
                    border: 1px solid #a7f3d0 !important;
                    padding: 10px 15px !important;
                    margin-top: 15px !important;
                    margin-bottom: 15px !important;
                    border-radius: 8px !important;
                    font-weight: bold !important;
                    font-size: 14px !important;
                    font-family: sans-serif !important;
                    display: block !important;
                    clear: both !important;
                    width: fit-content !important;
                    box-shadow: 0 2px 4px rgba(0,0,0,0.05) !important;
                `;
                badge.innerHTML = `⏱️ Custa: ${timeString}`;

                // --- O PULO DO GATO PARA NÃO SOBREPOR ---
                // insertAdjacentElement('afterend') coloca o elemento LOGO APÓS o bloco de preço,
                // no fluxo normal da página, empurrando o resto do conteúdo para baixo.
                targetElement.insertAdjacentElement('afterend', badge);
            }
        }
    });
}

// Aumentei um pouco o tempo para garantir layouts dinâmicos
setTimeout(injectTimeTag, 3000);