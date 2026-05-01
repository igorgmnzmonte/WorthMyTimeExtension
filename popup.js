document.addEventListener('DOMContentLoaded', () => {
    const salaryInput = document.getElementById('salary');
    const hoursInput = document.getElementById('hoursWeek');
    const priceInput = document.getElementById('productPrice');
    const resultArea = document.getElementById('resultArea');
    const timeText = document.getElementById('timeText');

    // Carregar dados salvos
    chrome.storage.local.get(['salary', 'hoursWeek'], (data) => {
        if (data.salary) salaryInput.value = data.salary;
        if (data.hoursWeek) hoursInput.value = data.hoursWeek;
    });

    const calculate = () => {
        const salary = parseFloat(salaryInput.value);
        const hoursWeek = parseFloat(hoursInput.value);
        const price = parseFloat(priceInput.value);

        // Salvar automaticamente as configs do usuário
        chrome.storage.local.set({ salary, hoursWeek });

        if (salary > 0 && hoursWeek > 0 && price > 0) {
            const hourlyRate = salary / (hoursWeek * 4.33);
            const hoursNeeded = price / hourlyRate;
            
            resultArea.style.display = 'block';
            timeText.innerText = hoursNeeded >= 1 
                ? `${hoursNeeded.toFixed(1)} Horas` 
                : `${(hoursNeeded * 60).toFixed(0)} Minutos`;
        }
    };

    [salaryInput, hoursInput, priceInput].forEach(el => el.addEventListener('input', calculate));
});