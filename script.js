document.addEventListener('DOMContentLoaded', function() {
    const batteryType = document.getElementById('batteryType');
    const batteryInfo = document.getElementById('batteryInfo');
    const rechargeableCapacity = document.getElementById('rechargeableCapacity');
    const calculateBtn = document.getElementById('calculateBtn');
    const results = document.getElementById('results');

    const batteryData = {
        CR1220: { capacity: 35, voltageStart: 3, voltageEnd: 2, type: 'Lithium', size: '12.5mm dia x 2.0mm', maxCurrent: '1mA', discharge: '0.1mA continuous', shelfLife: '10 years', description: 'Coin cell lithium battery.' },
        CR1616: { capacity: 50, voltageStart: 3, voltageEnd: 2, type: 'Lithium', size: '16mm dia x 1.6mm', maxCurrent: '1mA', discharge: '0.1mA continuous', shelfLife: '10 years', description: 'Coin cell lithium battery.' },
        CR1620: { capacity: 75, voltageStart: 3, voltageEnd: 2, type: 'Lithium', size: '16mm dia x 2.0mm', maxCurrent: '1mA', discharge: '0.1mA continuous', shelfLife: '10 years', description: 'Coin cell lithium battery.' },
        CR2016: { capacity: 90, voltageStart: 3, voltageEnd: 2, type: 'Lithium', size: '20mm dia x 1.6mm', maxCurrent: '1mA', discharge: '0.1mA continuous', shelfLife: '10 years', description: 'Coin cell lithium battery.' },
        LR44: { capacity: 150, voltageStart: 1.5, voltageEnd: 1.2, type: 'Alkaline', size: '11.6mm dia x 5.4mm', maxCurrent: '10mA', discharge: '1mA continuous', shelfLife: '5 years', description: 'Button cell alkaline battery.' },
        CR2025: { capacity: 160, voltageStart: 3, voltageEnd: 2, type: 'Lithium', size: '20mm dia x 2.5mm', maxCurrent: '1mA', discharge: '0.1mA continuous', shelfLife: '10 years', description: 'Coin cell lithium battery.' },
        CR2032: { capacity: 220, voltageStart: 3, voltageEnd: 2, type: 'Lithium', size: '20mm dia x 3.2mm', maxCurrent: '1mA', discharge: '0.2mA continuous', shelfLife: '10 years', description: 'Coin cell lithium battery.' },
        CR2450: { capacity: 560, voltageStart: 3, voltageEnd: 2, type: 'Lithium', size: '24mm dia x 5.0mm', maxCurrent: '1mA', discharge: '0.2mA continuous', shelfLife: '10 years', description: 'Coin cell lithium battery.' },
        '9V': { capacity: 550, voltageStart: 9, voltageEnd: 6, type: 'Carbon-Zinc', size: '48mm x 26mm x 17mm', maxCurrent: '500mA', discharge: '10mA continuous', shelfLife: '3 years', description: 'Rectangular carbon-zinc battery.' },
        AAA: { capacity: 1000, voltageStart: 1.5, voltageEnd: 1.2, type: 'Alkaline', size: '10.5mm dia x 44.5mm', maxCurrent: '100mA', discharge: '10mA continuous', shelfLife: '5 years', description: 'Cylindrical alkaline battery.' },
        CR123A: { capacity: 1500, voltageStart: 3, voltageEnd: 2.5, type: 'Lithium', size: '17mm dia x 34.5mm', maxCurrent: '1.5A', discharge: '0.5A continuous', shelfLife: '10 years', description: 'Cylindrical lithium battery.' },
        AA: { capacity: 2500, voltageStart: 1.5, voltageEnd: 1.2, type: 'Alkaline', size: '14.5mm dia x 50.5mm', maxCurrent: '500mA', discharge: '50mA continuous', shelfLife: '5 years', description: 'Cylindrical alkaline battery.' },
        D: { capacity: 10000, voltageStart: 1.5, voltageEnd: 1.2, type: 'Carbon-Zinc', size: '34mm dia x 61.5mm', maxCurrent: '1A', discharge: '100mA continuous', shelfLife: '3 years', description: 'Large cylindrical carbon-zinc battery.' },
        'Ni-Cd': { voltageStart: 1.2, voltageEnd: 1, type: 'Ni-Cd', description: 'Nickel-Cadmium rechargeable chemistry. Enter capacity at 25°C.' },
        'Ni-MH': { voltageStart: 1.2, voltageEnd: 1, type: 'Ni-MH', description: 'Nickel-Metal Hydride rechargeable chemistry. Enter capacity at 25°C.' },
        'Li-Ion': { voltageStart: 3.7, voltageEnd: 2.5, type: 'Li-Ion', description: 'Lithium-Ion rechargeable chemistry. Enter capacity at 25°C.' },
        'Li-Pol': { voltageStart: 3.7, voltageEnd: 2.5, type: 'Li-Pol', description: 'Lithium-Polymer rechargeable chemistry. Enter capacity at 25°C.' },
        'Lead-acid': { voltageStart: 2.0, voltageEnd: 1.8, type: 'Lead-acid', description: 'Lead-acid rechargeable chemistry. Enter capacity at 25°C.' }
    };

    function updateBatteryInfo() {
        const type = batteryType.value;
        const rechargeableChemistries = ['Ni-Cd', 'Ni-MH', 'Li-Ion', 'Li-Pol', 'Lead-acid'];
        if (rechargeableChemistries.includes(type)) {
            batteryInfo.style.display = 'block';
            rechargeableCapacity.style.display = 'block';
            const data = batteryData[type];
            const temperature = document.getElementById('temperature').value;
            const tempFactor = getTemperatureFactor(data.type, temperature);
            const inputCapacity = parseFloat(document.getElementById('rechargeableCapacityInput').value) || 0;
            const adjustedCapacity = inputCapacity * tempFactor;
            document.getElementById('capacity').textContent = adjustedCapacity.toFixed(0);
            document.getElementById('voltageStart').textContent = data.voltageStart;
            document.getElementById('voltageEnd').textContent = data.voltageEnd;
            
            const details = document.getElementById('batteryInfoDetails');
            details.innerHTML = `
                <p><strong>Type:</strong> ${data.type}</p>
                <p><strong>Description:</strong> ${data.description}</p>
                <p><strong>Temperature Factor (${temperature}°C):</strong> ${(tempFactor * 100).toFixed(0)}%</p>
            `;
            details.style.display = 'block';
        } else {
            batteryInfo.style.display = 'block';
            rechargeableCapacity.style.display = 'none';
            const data = batteryData[type];
            const temperature = document.getElementById('temperature').value;
            const tempFactor = getTemperatureFactor(data.type, temperature);
            const adjustedCapacity = data.capacity * tempFactor;
            document.getElementById('capacity').textContent = adjustedCapacity.toFixed(0);
            document.getElementById('voltageStart').textContent = data.voltageStart;
            document.getElementById('voltageEnd').textContent = data.voltageEnd;
            
            const details = document.getElementById('batteryInfoDetails');
            details.innerHTML = `
                <p><strong>Type:</strong> ${data.type}</p>
                <p><strong>Size:</strong> ${data.size}</p>
                <p><strong>Max Current:</strong> ${data.maxCurrent}</p>
                <p><strong>Discharge Rate:</strong> ${data.discharge}</p>
                <p><strong>Shelf Life:</strong> ${data.shelfLife}</p>
                <p><strong>Description:</strong> ${data.description}</p>
                <p><strong>Temperature Factor (${temperature}°C):</strong> ${(tempFactor * 100).toFixed(0)}%</p>
            `;
            details.style.display = 'block';
        }
    }

    batteryType.addEventListener('change', updateBatteryInfo);
    document.getElementById('temperature').addEventListener('change', updateBatteryInfo);
    document.getElementById('rechargeableCapacityInput').addEventListener('input', updateBatteryInfo);
    updateBatteryInfo();

    calculateBtn.addEventListener('click', function() {
        let capacity;
        const rechargeableChemistries = ['Ni-Cd', 'Ni-MH', 'Li-Ion', 'Li-Pol', 'Lead-acid'];
        if (rechargeableChemistries.includes(batteryType.value)) {
            capacity = parseFloat(document.getElementById('rechargeableCapacityInput').value);
        } else {
            capacity = batteryData[batteryType.value].capacity;
        }

        const temperature = document.getElementById('temperature').value;
        const tempFactor = getTemperatureFactor(batteryData[batteryType.value].type, temperature);
        capacity *= tempFactor;

        const activeTime = parseFloat(document.getElementById('activeTime').value);
        const activeTimeUnit = document.getElementById('activeTimeUnit').value;
        const activeCurrent = parseFloat(document.getElementById('activeCurrent').value);
        const activeCurrentUnit = document.getElementById('activeCurrentUnit').value;

        const sleepTime = parseFloat(document.getElementById('sleepTime').value);
        const sleepTimeUnit = document.getElementById('sleepTimeUnit').value;
        const sleepCurrent = parseFloat(document.getElementById('sleepCurrent').value);
        const sleepCurrentUnit = document.getElementById('sleepCurrentUnit').value;

        if (!capacity || !activeTime || !activeCurrent || !sleepTime || !sleepCurrent) {
            alert('Please fill in all fields.');
            return;
        }

        // Convert times to seconds
        const activeTimeSec = convertTimeToSeconds(activeTime, activeTimeUnit);
        const sleepTimeSec = convertTimeToSeconds(sleepTime, sleepTimeUnit);

        // Convert currents to mA
        const activeCurrentMa = convertCurrentToMa(activeCurrent, activeCurrentUnit);
        const sleepCurrentMa = convertCurrentToMa(sleepCurrent, sleepCurrentUnit);

        // Calculate average current
        const totalTime = activeTimeSec + sleepTimeSec;
        const avgCurrent = (activeCurrentMa * activeTimeSec + sleepCurrentMa * sleepTimeSec) / totalTime;

        // Calculate battery life in hours
        const batteryLifeHours = capacity / avgCurrent;

        // Convert to other units
        const batteryLifeDays = batteryLifeHours / 24;
        const batteryLifeMonths = batteryLifeDays / 30;
        const batteryLifeYears = batteryLifeDays / 365;
        const batteryLifeMinutes = batteryLifeHours * 60;
        const batteryLifeSeconds = batteryLifeMinutes * 60;

        // Display results
        let avgCurrentDisplay = avgCurrent;
        let avgCurrentUnit = 'мА';
        if (avgCurrent < 1) {
            avgCurrentDisplay = avgCurrent * 1000;
            avgCurrentUnit = 'мкА';
        }
        document.getElementById('avgCurrent').textContent = parseFloat(avgCurrentDisplay.toFixed(3)).toString();
        document.getElementById('avgCurrentUnit').textContent = avgCurrentUnit;

        // Determine the best unit
        let displayValue, displayUnit, iconClass;
        if (batteryLifeYears >= 1) {
            displayValue = batteryLifeYears;
            displayUnit = 'years';
            iconClass = 'fa-battery-full';
        } else if (batteryLifeMonths >= 1) {
            displayValue = batteryLifeMonths;
            displayUnit = 'months';
            iconClass = 'fa-battery-three-quarters';
        } else if (batteryLifeDays >= 1) {
            displayValue = batteryLifeDays;
            displayUnit = 'days';
            iconClass = 'fa-battery-half';
        } else if (batteryLifeHours >= 1) {
            displayValue = batteryLifeHours;
            displayUnit = 'hours';
            iconClass = 'fa-battery-quarter';
        } else if (batteryLifeMinutes >= 1) {
            displayValue = batteryLifeMinutes;
            displayUnit = 'minutes';
            iconClass = 'fa-battery-quarter';
        } else {
            displayValue = batteryLifeSeconds;
            displayUnit = 'seconds';
            iconClass = 'fa-battery-quarter';
        }

        document.getElementById('batteryLifeValue').textContent = displayValue.toFixed(2);
        document.getElementById('batteryLifeUnit').textContent = displayUnit;
        document.getElementById('batteryIcon').className = 'fas ' + iconClass;

        results.style.display = 'block';

        // Google Analytics event
        gtag('event', 'calculate_battery_life', {
            'battery_type': batteryType.value,
            'temperature': document.getElementById('temperature').value
        });
    });

    function convertTimeToSeconds(time, unit) {
        switch (unit) {
            case 'us': return time / 1000000;
            case 'ms': return time / 1000;
            case 's': return time;
            case 'min': return time * 60;
            case 'h': return time * 3600;
            default: return time;
        }
    }

    function getTemperatureFactor(type, temp) {
        const factors = {
            'Lithium': { 25: 1, 0: 0.9, '-10': 0.7, '-20': 0.5 },
            'Alkaline': { 25: 1, 0: 0.8, '-10': 0.6, '-20': 0.4 },
            'Carbon-Zinc': { 25: 1, 0: 0.5, '-10': 0.3, '-20': 0.1 },
            'Ni-Cd': { 25: 1, 0: 0.9, '-10': 0.7, '-20': 0.5 },
            'Ni-MH': { 25: 1, 0: 0.8, '-10': 0.6, '-20': 0.4 },
            'Li-Ion': { 25: 1, 0: 0.8, '-10': 0.6, '-20': 0.45 },
            'Li-Pol': { 25: 1, 0: 0.8, '-10': 0.6, '-20': 0.45 },
            'Lead-acid': { 25: 1, 0: 0.9, '-10': 0.7, '-20': 0.5 }
        };
        return factors[type][temp] || 1;
    }

    function convertCurrentToMa(current, unit) {
        switch (unit) {
            case 'ua': return current / 1000;
            case 'ma': return current;
            case 'a': return current * 1000;
            default: return current;
        }
    }
});