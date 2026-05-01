document.addEventListener('DOMContentLoaded', () => {
    const inputs = ['salary', 'timeInput', 'productPrice', 'currency', 'timeFormat', 'workScale'];
    const elements = {};
    
    // Mapeia os elementos do DOM
    inputs.forEach(id => {
        elements[id] = document.getElementById(id);
    });

    const resultArea = document.getElementById('resultArea');
    const timeText = document.getElementById('timeText');
    const daysInfo = document.getElementById('days-info');

    // Carregar dados salvos do chrome.storage
    chrome.storage.local.get(inputs, (data) => {
        if (data.salary) elements.salary.value = data.salary;
        if (data.timeInput) elements.timeInput.value = data.timeInput;
        if (data.productPrice) elements.productPrice.value = data.productPrice;
        if (data.currency) elements.currency.value = data.currency;
        if (data.timeFormat) elements.timeFormat.value = data.timeFormat;
        if (data.workScale) elements.workScale.value = data.workScale;
        
        handleScaleChange();
        calculate();
    });

    // Adapta o campo de horas com base na escala
    function handleScaleChange() {
        const scale = elements.workScale.value;
        const timeInputLabel = document.getElementById('labelTimeInput');

        if (scale === '12x36') {
            timeInputLabel.innerText = "Plantão";
            elements.timeInput.value = 12;
            elements.timeInput.disabled = true;
        } else if (scale === 'custom') {
            timeInputLabel.innerText = "Hrs/sem";
            elements.timeInput.disabled = false;
        } else {
            timeInputLabel.innerText = "Hrs/dia";
            elements.timeInput.disabled = false;
        }
    }

    elements.workScale.addEventListener('change', handleScaleChange);

    const calculate = () => {
        // Atualiza as labels de moeda
        const symbol = elements.currency.value;
        document.getElementById('labelSalary').innerText = `Salário Líquido (${symbol})`;
        document.getElementById('labelPrice').innerText = `Teste um Preço (${symbol})`;

        // Coleta valores numéricos
        const salary = parseFloat(elements.salary.value);
        const timeValue = parseFloat(elements.timeInput.value);
        const price = parseFloat(elements.productPrice.value);
        const format = elements.timeFormat.value;
        const scale = elements.workScale.value;

        // Salvar configurações gerais para o content.js usar nas injeções
        chrome.storage.local.set({ 
            salary, timeInput: timeValue, workScale: scale, timeFormat: format, currency: symbol, productPrice: price 
        });

        // Se houver preço preenchido no popup, calcula a demonstração
        if (salary > 0 && timeValue > 0 && price > 0) {
            let monthlyHours = 0;

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
            const hours = price / hourlyRate;
            const dailyDivisor = (scale === 'custom') ? 8 : timeValue;

            resultArea.style.display = 'block';

            if (format === 'minutes') {
                timeText.innerText = `${(hours * 60).toFixed(0)} Minutos`;
                daysInfo.innerText = "de trabalho";
            } else if (format === 'hours') {
                timeText.innerText = `${hours.toFixed(1)} Horas`;
                daysInfo.innerText = "de trabalho";
            } else if (format === 'days') {
                timeText.innerText = `${(hours / dailyDivisor).toFixed(1)} Dias`;
                daysInfo.innerText = `úteis (${dailyDivisor}h/dia)`;
            } else {
                if (hours < 1) {
                    timeText.innerText = `${(hours * 60).toFixed(0)} Minutos`;
                    daysInfo.innerText = "de trabalho";
                } else if (hours < 24) {
                    timeText.innerText = `${hours.toFixed(1)} Horas`;
                    daysInfo.innerText = "de trabalho";
                } else {
                    timeText.innerText = `${hours.toFixed(0)} Horas`;
                    daysInfo.innerText = `Aprox. ${(hours / dailyDivisor).toFixed(1)} dias (${dailyDivisor}h/dia)`;
                }
            }
        } else {
            resultArea.style.display = 'none';
        }
    };

    // Adiciona listener para calcular e salvar a cada digitação ou mudança
    inputs.forEach(id => {
        elements[id].addEventListener('input', calculate);
    });
});