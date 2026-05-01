// Exemplo simples para detectar preço na Amazon
function detectPrice() {
    // Seletores comuns de preço na Amazon
    const priceElement = document.querySelector('.a-price-whole');
    if (priceElement) {
        const priceValue = priceElement.innerText.replace(/[^\d]/g, '');
        console.log("WorthMyTime detectou o preço:", priceValue);
        // Aqui no futuro enviaremos esse valor para o popup ou injetaremos na página
    }
}

window.addEventListener('load', detectPrice);