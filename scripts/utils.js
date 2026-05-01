// scripts/utils.js

/**
 * Converte valor monetário em string de tempo amigável
 */
function formatTime(price) {
    const totalHours = price / HOURLY_WAGE;
    if (totalHours < 1) {
        const minutes = Math.round(totalHours * 60);
        return `${minutes} Min`;
    }
    return `${totalHours.toFixed(1)}h`;
}

/**
 * Cria o elemento visual (Badge) com ícone e texto
 */
function createTimeDisplay(text) {
    const container = document.createElement('div');
    container.className = 'wmt-time-display';

    const icon = document.createElement('span');
    icon.className = 'wmt-icon';
    icon.innerHTML = `
        <svg width="12" height="12" viewBox="0 0 12 12" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M6 11C8.76142 11 11 8.76142 11 6C11 3.23858 8.76142 1 6 1C3.23858 1 1 3.23858 1 6C1 8.76142 3.23858 11 6 11Z" stroke="currentColor" stroke-width="1.2" stroke-linecap="round" stroke-linejoin="round"/>
            <path d="M6 3.5V6L7.5 7.5" stroke="currentColor" stroke-width="1.2" stroke-linecap="round" stroke-linejoin="round"/>
        </svg>`;

    const textElement = document.createElement('span');
    textElement.className = 'wmt-text';
    textElement.textContent = text;

    container.appendChild(icon);
    container.appendChild(textElement);

    return container;
}