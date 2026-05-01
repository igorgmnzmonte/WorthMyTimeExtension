document.addEventListener('DOMContentLoaded', () => {
    // 1. Mapear Elementos do DOM
    const els = {
        currency: document.getElementById('currency'),
        timeFormat: document.getElementById('timeFormat'),
        salary: document.getElementById('salary'),
        salaryType: document.getElementById('salaryType'),
        workScale: document.getElementById('workScale'),
        timeInput: document.getElementById('timeInput'),
        productPrice: document.getElementById('productPrice'),
        resultArea: document.getElementById('resultArea'),
        timeText: document.getElementById('timeText'),
        labelSalary: document.getElementById('labelSalary'),
        labelPrice: document.getElementById('labelPrice')
    };

    // 2. Carregar dados salvos
    chrome.storage.sync.get(
        ['currency', 'timeFormat', 'salary', 'salaryType', 'workScale', 'timeInput'], 
        (data) => {
            if (data.currency) els.currency.value = data.currency;
            if (data.timeFormat) els.timeFormat.value = data.timeFormat;
            if (data.salary) els.salary.value = data.salary;
            if (data.salaryType) els.salaryType.value = data.salaryType;
            if (data.workScale) els.workScale.value = data.workScale;
            if (data.timeInput) els.timeInput.value = data.timeInput;
            
            updateLabels();
            calculateTime();
        }
    );

    // 3. Atualizar Labels dinamicamente (R$, $, €)
    function updateLabels() {
        const sym = els.currency.value;
        els.labelSalary.textContent = `Meus Ganhos (${sym})`;
        els.labelPrice.textContent = `Teste um Preço (${sym})`;
    }

    // 4. Lógica da Calculadora "WorthMyTime"
    function calculateTime() {
        const price = parseFloat(els.productPrice.value);
        const salary = parseFloat(els.salary.value);
        const hoursPerDay = parseFloat(els.timeInput.value) || 8;

        if (!price || !salary) {
            els.resultArea.style.display = 'none';
            return;
        }

        let hourlyWage = 0;
        
        // Descobre o valor da hora baseado na escala e período
        if (els.salaryType.value === 'hourly') {
            hourlyWage = salary;
        } else if (els.salaryType.value === 'daily') {
            hourlyWage = salary / hoursPerDay;
        } else {
            // Mensal
            let daysPerMonth = 22; // Padrão 5x2
            if (els.workScale.value === '6x1') daysPerMonth = 26;
            if (els.workScale.value === '12x36') daysPerMonth = 15;
            
            hourlyWage = salary / (daysPerMonth * hoursPerDay);
        }

        const totalHours = price / hourlyWage;
        let resultText = '';

        // Formatação da Exibição (Auto, Minutos, Horas, Dias)
        const format = els.timeFormat.value;
        if (format === 'minutes' || (format === 'auto' && totalHours < 1)) {
            resultText = `${Math.round(totalHours * 60)} min`;
        } else if (format === 'days' || (format === 'auto' && totalHours > 24)) {
            resultText = `${(totalHours / hoursPerDay).toFixed(1)} dias`;
        } else {
            resultText = `${totalHours.toFixed(1)} hrs`;
        }

        els.timeText.textContent = resultText;
        els.resultArea.style.display = 'block';
    }

    // 5. Escutar eventos para salvar e calcular em tempo real
    const inputs = ['currency', 'timeFormat', 'salary', 'salaryType', 'workScale', 'timeInput'];
    
    inputs.forEach(id => {
        els[id].addEventListener('input', () => {
            updateLabels();
            calculateTime();
            
            // Salvar automaticamente ao alterar
            const settings = {};
            inputs.forEach(key => { settings[key] = els[key].value; });
            chrome.storage.sync.set(settings);
        });
    });

    els.productPrice.addEventListener('input', calculateTime);
});