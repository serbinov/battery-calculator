document.addEventListener('DOMContentLoaded', function() {
    const batteryType = document.getElementById('batteryType');
    const batteryInfo = document.getElementById('batteryInfo');
    const rechargeableCapacity = document.getElementById('rechargeableCapacity');
    const calculateBtn = document.getElementById('calculateBtn');
    const results = document.getElementById('results');

    const batteryData = {
        CR1220: { capacity: 35, voltageStart: 3, voltageEnd: 2, type: 'Lithium', chemistry: 'Lithium', size: '12.5mm dia x 2.0mm', maxCurrent: '1mA', discharge: '0.1mA continuous', shelfLife: '10 years', shelfLifeYears: 10, selfDischargeRate: 0.166, internalResistanceOhm: 25, calendarFadePercentPerYear: 0.5, description: 'Coin cell lithium battery.' },
        CR1616: { capacity: 50, voltageStart: 3, voltageEnd: 2, type: 'Lithium', chemistry: 'Lithium', size: '16mm dia x 1.6mm', maxCurrent: '1mA', discharge: '0.1mA continuous', shelfLife: '10 years', shelfLifeYears: 10, selfDischargeRate: 0.166, internalResistanceOhm: 25, calendarFadePercentPerYear: 0.5, description: 'Coin cell lithium battery.' },
        CR1620: { capacity: 75, voltageStart: 3, voltageEnd: 2, type: 'Lithium', chemistry: 'Lithium', size: '16mm dia x 2.0mm', maxCurrent: '1mA', discharge: '0.1mA continuous', shelfLife: '10 years', shelfLifeYears: 10, selfDischargeRate: 0.166, internalResistanceOhm: 20, calendarFadePercentPerYear: 0.5, description: 'Coin cell lithium battery.' },
        CR2016: { capacity: 90, voltageStart: 3, voltageEnd: 2, type: 'Lithium', chemistry: 'Lithium', size: '20mm dia x 1.6mm', maxCurrent: '1mA', discharge: '0.1mA continuous', shelfLife: '10 years', shelfLifeYears: 10, selfDischargeRate: 0.166, internalResistanceOhm: 20, calendarFadePercentPerYear: 0.5, description: 'Coin cell lithium battery.' },
        LR44: { capacity: 150, voltageStart: 1.5, voltageEnd: 1.2, type: 'Alkaline', chemistry: 'Alkaline', size: '11.6mm dia x 5.4mm', maxCurrent: '10mA', discharge: '1mA continuous', shelfLife: '5 years', shelfLifeYears: 5, selfDischargeRate: 0.166, internalResistanceOhm: 15, calendarFadePercentPerYear: 0.8, description: 'Button cell alkaline battery.' },
        CR2025: { capacity: 160, voltageStart: 3, voltageEnd: 2, type: 'Lithium', chemistry: 'Lithium', size: '20mm dia x 2.5mm', maxCurrent: '1mA', discharge: '0.1mA continuous', shelfLife: '10 years', shelfLifeYears: 10, selfDischargeRate: 0.166, internalResistanceOhm: 20, calendarFadePercentPerYear: 0.5, description: 'Coin cell lithium battery.' },
        CR2032: { capacity: 220, voltageStart: 3, voltageEnd: 2, type: 'Lithium', chemistry: 'Lithium', size: '20mm dia x 3.2mm', maxCurrent: '1mA', discharge: '0.2mA continuous', shelfLife: '10 years', shelfLifeYears: 10, selfDischargeRate: 0.166, internalResistanceOhm: 20, calendarFadePercentPerYear: 0.5, description: 'Coin cell lithium battery.' },
        CR2450: { capacity: 560, voltageStart: 3, voltageEnd: 2, type: 'Lithium', chemistry: 'Lithium', size: '24mm dia x 5.0mm', maxCurrent: '1mA', discharge: '0.2mA continuous', shelfLife: '10 years', shelfLifeYears: 10, selfDischargeRate: 0.166, internalResistanceOhm: 12, calendarFadePercentPerYear: 0.5, description: 'Coin cell lithium battery.' },
        '9V': { capacity: 550, voltageStart: 9, voltageEnd: 6, type: 'Salt', chemistry: 'Salt', size: '48mm x 26mm x 17mm', maxCurrent: '500mA', discharge: '10mA continuous', shelfLife: '3 years', shelfLifeYears: 3, selfDischargeRate: 1.0, postShelfSelfDischargeRate: 20, internalResistanceOhm: 2, calendarFadePercentPerYear: 1.0, description: 'Rectangular salt battery.' },
        AAA: { capacity: 1000, voltageStart: 1.5, voltageEnd: 1.2, type: 'Alkaline', chemistry: 'Alkaline', size: '10.5mm dia x 44.5mm', maxCurrent: '100mA', discharge: '10mA continuous', shelfLife: '5 years', shelfLifeYears: 5, selfDischargeRate: 0.166, internalResistanceOhm: 0.2, calendarFadePercentPerYear: 1.0, description: 'Cylindrical alkaline battery.' },
        'AAA (Salt)': { capacity: 500, voltageStart: 1.5, voltageEnd: 1.2, type: 'Salt', chemistry: 'Salt', size: '10.5mm dia x 44.5mm', maxCurrent: '50mA', discharge: '5mA continuous', shelfLife: '3 years', shelfLifeYears: 3, selfDischargeRate: 1.0, postShelfSelfDischargeRate: 20, internalResistanceOhm: 0.3, calendarFadePercentPerYear: 1.5, description: 'Cylindrical salt battery.' },
        CR123A: { capacity: 1500, voltageStart: 3, voltageEnd: 2.5, type: 'Lithium', chemistry: 'Lithium', size: '17mm dia x 34.5mm', maxCurrent: '1.5A', discharge: '0.5A continuous', shelfLife: '10 years', shelfLifeYears: 10, selfDischargeRate: 0.166, internalResistanceOhm: 0.5, calendarFadePercentPerYear: 0.5, description: 'Cylindrical lithium battery.' },
        AA: { capacity: 2500, voltageStart: 1.5, voltageEnd: 1.2, type: 'Alkaline', chemistry: 'Alkaline', size: '14.5mm dia x 50.5mm', maxCurrent: '500mA', discharge: '50mA continuous', shelfLife: '5 years', shelfLifeYears: 5, selfDischargeRate: 0.166, internalResistanceOhm: 0.1, calendarFadePercentPerYear: 1.0, description: 'Cylindrical alkaline battery.' },
        'AA (Salt)': { capacity: 900, voltageStart: 1.5, voltageEnd: 1.2, type: 'Salt', chemistry: 'Salt', size: '14.5mm dia x 50.5mm', maxCurrent: '200mA', discharge: '20mA continuous', shelfLife: '3 years', shelfLifeYears: 3, selfDischargeRate: 1.0, postShelfSelfDischargeRate: 20, internalResistanceOhm: 0.3, calendarFadePercentPerYear: 1.5, description: 'Cylindrical salt battery.' },
        D: { capacity: 10000, voltageStart: 1.5, voltageEnd: 1.2, type: 'Salt', chemistry: 'Salt', size: '34mm dia x 61.5mm', maxCurrent: '1A', discharge: '100mA continuous', shelfLife: '3 years', shelfLifeYears: 3, selfDischargeRate: 1.0, postShelfSelfDischargeRate: 20, internalResistanceOhm: 0.05, calendarFadePercentPerYear: 1.0, description: 'Large cylindrical salt battery.' },
        C: { capacity: 2000, voltageStart: 1.5, voltageEnd: 1.2, type: 'Salt', chemistry: 'Salt', size: '26mm dia x 50mm', maxCurrent: '500mA', discharge: '50mA continuous', shelfLife: '3 years', shelfLifeYears: 3, selfDischargeRate: 1.0, postShelfSelfDischargeRate: 20, internalResistanceOhm: 0.12, calendarFadePercentPerYear: 1.5, description: 'Medium cylindrical salt battery.' },
        'Ni-Cd': { voltageStart: 1.2, voltageEnd: 1, type: 'Ni-Cd', chemistry: 'Ni-Cd', selfDischargeRate: 12, calendarFadePercentPerYear: 5.0, internalResistanceOhm: 0.05, shelfLifeYears: 5, description: 'Nickel-Cadmium rechargeable chemistry. Self-discharge: 10-15% per month at room temperature.' },
        'Ni-MH': { voltageStart: 1.2, voltageEnd: 1, type: 'Ni-MH', chemistry: 'Ni-MH', selfDischargeRate: 6, calendarFadePercentPerYear: 3.0, internalResistanceOhm: 0.05, shelfLifeYears: 3, description: 'Nickel-Metal Hydride rechargeable chemistry. LSD type: ~6% per month. Standard type: up to 50% in first month.' },
        'Li-Ion': { voltageStart: 3.7, voltageEnd: 2.5, type: 'Li-Ion', chemistry: 'Li-Ion', selfDischargeRate: 2, calendarFadePercentPerYear: 3.0, internalResistanceOhm: 0.05, shelfLifeYears: 5, description: 'Lithium-Ion rechargeable chemistry.' },
        'Li-Pol': { voltageStart: 3.7, voltageEnd: 2.5, type: 'Li-Pol', chemistry: 'Li-Ion', selfDischargeRate: 2, calendarFadePercentPerYear: 3.0, internalResistanceOhm: 0.05, shelfLifeYears: 5, description: 'Lithium-Polymer rechargeable chemistry.' },
        'Lead-acid': { voltageStart: 2.0, voltageEnd: 1.8, type: 'Lead-acid', chemistry: 'Lead-acid', selfDischargeRate: 5, calendarFadePercentPerYear: 3.0, internalResistanceOhm: 0.02, shelfLifeYears: 4, description: 'Lead-acid rechargeable chemistry.' }
    };

    // No chemistry selector: user chooses explicit option keys (e.g. "AA" or "AA (Salt)")

    function updateBatteryInfo() {
        const type = batteryType.value;
        if (!type || !batteryData[type]) return;
        const rechargeableChemistries = ['Ni-Cd', 'Ni-MH', 'Li-Ion', 'Li-Pol', 'Lead-acid'];
        // chemistry selector removed — user picks explicit option (e.g. 'AA' or 'AA (Salt)')
        if (rechargeableChemistries.includes(type)) {
            batteryInfo.style.display = 'block';
            rechargeableCapacity.style.display = 'block';
            const data = batteryData[type];
            const shownChemistry = data && data.chemistry === 'Salt' ? 'Salt' : (data && data.chemistry ? data.chemistry : 'Unknown');
            const temperature = document.getElementById('temperature').value;
            const tempFactor = getTemperatureFactor(data.chemistry, temperature);
            const inputCapacity = parseFloat(document.getElementById('rechargeableCapacityInput').value) || 0;
            const adjustedCapacity = inputCapacity * tempFactor;
            document.getElementById('capacity').textContent = adjustedCapacity.toFixed(0);
            document.getElementById('voltageStart').textContent = data.voltageStart;
            document.getElementById('voltageEnd').textContent = data.voltageEnd;
            
            const details = document.getElementById('batteryInfoDetails');
            details.innerHTML = `
                <p><strong>Type:</strong> ${data.type}</p>
                <p><strong>Chemistry:</strong> ${shownChemistry}</p>
                <p><strong>Description:</strong> ${data.description}</p>
                <p><strong>Temperature Factor (${temperature}°C):</strong> ${(tempFactor * 100).toFixed(0)}%</p>
                <p><strong>Self-Discharge Rate:</strong> ${data.selfDischargeRate}% per month</p>
                <p><strong>Average Voltage:</strong> ${(data.voltageStart + data.voltageEnd) / 2} V</p>
            `;
            details.style.display = 'block';
        } else {
            batteryInfo.style.display = 'block';
            rechargeableCapacity.style.display = 'none';
            const data = batteryData[type];
            const shownChemistry = data && data.chemistry === 'Salt' ? 'Salt' : (data && data.chemistry ? data.chemistry : 'Unknown');
            const temperature = document.getElementById('temperature').value;
            const tempFactor = getTemperatureFactor(data.chemistry, temperature);
            const adjustedCapacity = data.capacity * tempFactor;
            document.getElementById('capacity').textContent = adjustedCapacity.toFixed(0);
            document.getElementById('voltageStart').textContent = data.voltageStart;
            document.getElementById('voltageEnd').textContent = data.voltageEnd;
            
            const details = document.getElementById('batteryInfoDetails');
            details.innerHTML = `
                <p><strong>Type:</strong> ${data.type}</p>
                <p><strong>Chemistry:</strong> ${shownChemistry}</p>
                <p><strong>Size:</strong> ${data.size}</p>
                <p><strong>Max Current:</strong> ${data.maxCurrent}</p>
                <p><strong>Discharge Rate:</strong> ${data.discharge}</p>
                <p><strong>Shelf Life:</strong> ${data.shelfLife}</p>
                <p><strong>Description:</strong> ${data.description}</p>
                <p><strong>Temperature Factor (${temperature}°C):</strong> ${(tempFactor * 100).toFixed(0)}%</p>
                <p><strong>Self-Discharge Rate:</strong> ${data.selfDischargeRate}% per month</p>
                <p><strong>Average Voltage:</strong> ${(data.voltageStart + data.voltageEnd) / 2} V</p>
            `;
            details.style.display = 'block';
        }
    }

    batteryType.addEventListener('change', updateBatteryInfo);
    document.getElementById('temperature').addEventListener('change', updateBatteryInfo);
    document.getElementById('rechargeableCapacityInput').addEventListener('input', updateBatteryInfo);
    batteryType.value = 'CR2032';
    updateBatteryInfo();

    calculateBtn.addEventListener('click', function() {
        if (!batteryType.value || !batteryData[batteryType.value]) {
            alert('Please select a battery type.');
            return;
        }
        let capacity;
        const rechargeableChemistries = ['Ni-Cd', 'Ni-MH', 'Li-Ion', 'Li-Pol', 'Lead-acid'];
        if (rechargeableChemistries.includes(batteryType.value)) {
            capacity = parseFloat(document.getElementById('rechargeableCapacityInput').value);
        } else {
            capacity = batteryData[batteryType.value].capacity;
        }

        const temperature = document.getElementById('temperature').value;
        const tempFactor = getTemperatureFactor(batteryData[batteryType.value].chemistry, temperature);
        capacity *= tempFactor;

        const voltageStart = batteryData[batteryType.value].voltageStart;
        const voltageEnd = batteryData[batteryType.value].voltageEnd;
        const averageVoltage = (voltageStart + voltageEnd) / 2;

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

        // Calculate energy consumption (Wh)
        const activeEnergy = (activeCurrentMa / 1000) * averageVoltage * (activeTimeSec / 3600);
        const sleepEnergy = (sleepCurrentMa / 1000) * averageVoltage * (sleepTimeSec / 3600);
        const totalEnergyCycle = activeEnergy + sleepEnergy;

        // Fetch battery metadata and derived constants needed by both 'without' and 'with' paths
        // We expect the exact selection key (e.g. 'AA' or 'AA (Salt)') to exist in batteryData.
        // Fallback: try the base type (before any parenthesis) if exact key missing.
        const rawKey = batteryType.value;
        const data = batteryData[rawKey] || batteryData[rawKey.split(' (')[0]];
        const selfDischargeRate = data.selfDischargeRate || 0; // percent per month
        const rFraction = Math.max(0, selfDischargeRate) / 100; // per month fraction
        const hoursPerMonth = 24 * 30; // consistent with previous conversions

        // extra realistic parameters: calendar fade (% per year), internal resistance (ohms), shelf life
        const calendarFadePercentPerYear = data.calendarFadePercentPerYear || 0; // percent per year
        const rInternal = data.internalResistanceOhm || 0; // ohms
        const shelfLifeYears = (function(d){
            if (d && d.shelfLifeYears) return d.shelfLifeYears;
            if (d && d.shelfLife && typeof d.shelfLife === 'string'){
                const m = d.shelfLife.match(/(\d+\.?\d*)/);
                if (m) return parseFloat(m[1]);
            }
            return 100; // fallback large
        })(data);

        const maxHours = shelfLifeYears * 24 * 365;

        // Calculate battery life without self-discharge (but when pure-load life exceeds shelf life
        // simulate a staged model: during shelf life use normal self-discharge + load, then after shelf life
        // use accelerated post-shelf self-discharge (postShelfSelfDischargeRate) together with load until depletion).
        // base pure-load value (no self-discharge): C / Iavg
        let batteryLifeHoursWithout = capacity / avgCurrent; // pure-load
        // keep the original staged 'without' simulation result available
        let batteryLifeHoursWithoutStaged = batteryLifeHoursWithout;
        // If pure-load lifetime exceeds the shelf life cap, run a staged simulation to model degradation
        if (isFinite(batteryLifeHoursWithout) && batteryLifeHoursWithout >= maxHours - 1e-9) {
            // use existing self-discharge rate for the pre-shelf stage
            const rNormal = Math.max(0, selfDischargeRate) / 100; // fraction per month
            const lambdaNormal = rNormal > 0 ? -Math.log(1 - rNormal) / hoursPerMonth : 0;

            // Simulate up to shelf life under combined load + normal self-discharge
            let rem = capacity; // mAh
            const dt_h = 1; // hourly steps
            let elapsed = 0;
            while (elapsed < maxHours) {
                if (lambdaNormal > 0) rem *= Math.exp(-lambdaNormal * dt_h);
                rem -= avgCurrent * dt_h; // load consumption
                elapsed += dt_h;
                if (rem <= 0) { rem = 0; break; }
            }

            if (rem <= 0) {
                // depleted during the shelf-life window -> staged result
                batteryLifeHoursWithoutStaged = Math.min(elapsed, maxHours);
            } else {
                // Not depleted during shelf life — switch to post-shelf accelerated self-discharge
                const postShelfRate = data.postShelfSelfDischargeRate || 20; // percent/month
                const rPost = Math.max(0, postShelfRate) / 100;
                const lamPost = rPost > 0 ? -Math.log(1 - rPost) / hoursPerMonth : 0;

                // Continue simulation (including load) until depletion or safety cap (100 years)
                let th = 0;
                const safetyHours = 24 * 365 * 100;
                const dtPost = 24; // daily step for faster post-shelf progression
                while (rem > 0 && th < safetyHours) {
                    // Apply accelerated self-discharge (exponential) first
                    if (lamPost > 0) rem *= Math.exp(-lamPost * dtPost);
                    // Also subtract the device load during the post-shelf period — keep behavior consistent
                    // with the 'without' simulation which includes load in the post-shelf stage.
                    rem -= avgCurrent * dtPost;
                    th += dtPost;
                    if (rem <= 0) { rem = 0; break; }
                }
                batteryLifeHoursWithoutStaged = maxHours + th; // shelf period + post-shelf
            }
        }

        // Calculate cycles and energy for without self-discharge
        const cyclesWithout = batteryLifeHoursWithout * 3600 / totalTime;
        const activeEnergyTotalWithout = activeEnergy * cyclesWithout;
        const sleepEnergyTotalWithout = sleepEnergy * cyclesWithout;
        const totalEnergyLifeWithout = (capacity / 1000) * averageVoltage;

        // Apply self-discharge: compute battery life considering both load and self-discharge
        // Model (linear approximation): capacity consumed = load_consumption + self_discharge_consumption
        // capacity (mAh) = avgCurrent(mA) * t_hours + C0 * rFraction * t_months
        // t_months = t_hours / hoursPerMonth
        // => t_hours = C0 / (avgCurrent + C0 * rFraction / hoursPerMonth)
        // Note: data, rFraction, hoursPerMonth, calendarFadePercentPerYear, rInternal and maxHours
        // were declared earlier and should be used here — avoid redeclaration.

        // Simulate battery life with combined drain (load + exponential self-discharge) + calendar ageing + internal resistance
        // We'll do a daily step simulation (dt_hours) — good balance between accuracy and performance.
        const lambdaSelfPerHour = rFraction > 0 ? -Math.log(1 - rFraction) / hoursPerMonth : 0;
        const calendarFadeFractionPerYear = Math.max(0, calendarFadePercentPerYear) / 100;
        const calendarLambdaPerYear = calendarFadeFractionPerYear > 0 ? -Math.log(1 - calendarFadeFractionPerYear) : 0;

        const dt_hours = 1; // simulation step: 1 hour for higher accuracy
        let remainingCapacity = capacity; // mAh
        const initialCapacity = capacity;
        // maxHours already declared earlier
        let t_hours = 0;
        if (initialCapacity <= 0) {
            // zero capacity -> immediate death
            batteryLifeHoursWith = 0;
        } else {

        // simple linear OCV model: voltageEnd + SOC*(voltageStart-voltageEnd)
        function ocvFromSoc(soc){
            return voltageEnd + soc * (voltageStart - voltageEnd);
        }

            // simulate until cutoff
            while (true) {
            if (!isFinite(t_hours) || t_hours >= maxHours) { t_hours = maxHours; break; }

            // self-discharge: exponential decay applied for dt_hours
            if (lambdaSelfPerHour > 0) {
                // capacity lost due to self-discharge over dt: remaining *= exp(-lambda*dt)
                remainingCapacity *= Math.exp(-lambdaSelfPerHour * dt_hours);
            }

            // calendar fade reduces remaining capacity proportionally over dt (exponential)
            if (calendarLambdaPerYear > 0) {
                const dtYears = dt_hours / (24 * 365);
                remainingCapacity *= Math.exp(-calendarLambdaPerYear * dtYears);
            }

            // subtract load consumption for dt
            remainingCapacity -= avgCurrent * dt_hours; // mAh

            if (remainingCapacity <= 0) { remainingCapacity = 0; t_hours += dt_hours; break; }

            // check loaded voltage at the end of this step
            const soc = remainingCapacity / initialCapacity;
            const ocv = ocvFromSoc(Math.max(0, Math.min(1, soc)));
            const loadA = (avgCurrent / 1000); // A
            const loadedVoltage = ocv - loadA * rInternal;
            if (loadedVoltage <= voltageEnd) { t_hours += dt_hours; break; }

                t_hours += dt_hours;
            }
        }

        let batteryLifeHoursWith = t_hours;

        // If simulation reached shelf life cap, estimate additional lifetime based on calendar aging
        // (we no longer show an accelerated post-shelf self-discharge note). We simulate calendar
        // fade (calendarLambdaPerYear) after the shelf period until remaining capacity is depleted
        const cappedByShelf = batteryLifeHoursWith >= maxHours - 1e-6;
        // grab UI elements for shelf notes early so they are available when we build messages
        const shelfNoteWith = document.getElementById('shelfNoteWith');
        let postShelfDepleteMonths = null;
        if (cappedByShelf) {
            // After shelf life we use an accelerated self-discharge model (configurable per-battery)
            // to estimate how quickly remaining capacity will be depleted. This is a conservative
            // post-shelf approach (e.g. default 20%/month) and gives concrete depletion times.
            const postShelfRate = data.postShelfSelfDischargeRate || 20; // percent per month
            const rPost = Math.max(0, postShelfRate) / 100;
            const lamPost = rPost > 0 ? -Math.log(1 - rPost) / hoursPerMonth : 0;

            // simulate only self-discharge (no load) with daily steps to depletion
            let rem = remainingCapacity;
            const dt_h = 24; // daily step
            let th = 0;
                if (rem > 0 && lamPost > 0) {
                    while (rem > 0) {
                        // Apply accelerated self-discharge
                        rem *= Math.exp(-lamPost * dt_h);
                        // Subtract device load during post-shelf depletion too (mAh)
                        rem -= avgCurrent * dt_h;
                        th += dt_h;
                        if (th > 24 * 365 * 100) break; // safety cap 100 years
                    }
                    postShelfDepleteMonths = th / 24 / 30;
                    batteryLifeHoursWith = maxHours + th; // include post-shelf depletion time
                    // Show a clear two-part breakdown for the 'with self-discharge' block
                    if (shelfNoteWith) {
                        shelfNoteWith.style.display = 'block';
                        shelfNoteWith.textContent = `Breakdown: first ${shelfLifeYears} years — normal self-discharge (${selfDischargeRate}%/month), then ${postShelfDepleteMonths.toFixed(1)} months of accelerated self-discharge (~${postShelfRate}%/month).`;
                    }
            } else if (rem <= 0) {
                postShelfDepleteMonths = 0;
                // don't show a post-shelf note when remaining capacity is already depleted
                // intentionally do not display shelf note in UI
            } else {
                // intentionally do not show any post-shelf shelf-note in the UI
            }
        } else {
            if (shelfNoteWith) shelfNoteWith.style.display = 'none';
        }

        // Effective capacity consumed by load over the lifetime (mAh) — used capacity
        const usedCapacity = Math.max(0, initialCapacity - remainingCapacity);
        const capacityWith = Math.min(initialCapacity, usedCapacity);

        const totalEnergyLife = (capacityWith / 1000) * averageVoltage; // Wh

        // Calculate number of cycles over battery life
        const cycles = batteryLifeHoursWith * 3600 / totalTime;

        // Calculate total energy consumption over battery life
        const activeEnergyTotal = activeEnergy * cycles;
        const sleepEnergyTotal = sleepEnergy * cycles;
        const totalEnergyTotal = totalEnergyCycle * cycles;

        // Display results
        let avgCurrentDisplay = avgCurrent;
        let avgCurrentUnit = 'мА';
        if (avgCurrent < 1) {
            avgCurrentDisplay = avgCurrent * 1000;
            avgCurrentUnit = 'мкА';
        }
        document.getElementById('avgCurrent').textContent = parseFloat(avgCurrentDisplay.toFixed(3)).toString();
        document.getElementById('avgCurrentUnit').textContent = avgCurrentUnit;

        document.getElementById('activeEnergyWithout').textContent = formatEnergy(activeEnergyTotalWithout);
        document.getElementById('sleepEnergyWithout').textContent = formatEnergy(sleepEnergyTotalWithout);
        // totalEnergyLifeWithout UI element removed — skip setting it

        // Get display info for without
        const withoutInfo = getDisplayInfo(batteryLifeHoursWithout);
        document.getElementById('batteryLifeValueWithout').textContent = withoutInfo.displayValue.toFixed(2);
        document.getElementById('batteryLifeUnitWithout').textContent = withoutInfo.displayUnit;

        // hide shelf note under the "Battery Life (no self-discharge)" block
        // The shelf-note is kept only for the 'with self-discharge' block to avoid confusing the Battery Life without-self-discharge display.
        const shelfNoteWithout = document.getElementById('shelfNoteWithout');
        if (shelfNoteWithout) shelfNoteWithout.style.display = 'none';

        document.getElementById('activeEnergy').textContent = formatEnergy(activeEnergyTotal);
        document.getElementById('sleepEnergy').textContent = formatEnergy(sleepEnergyTotal);
        // totalEnergyLife UI element removed — skip setting it

        // Get display info for with
        const withInfo = getDisplayInfo(batteryLifeHoursWith);
        document.getElementById('batteryLifeValueWith').textContent = withInfo.displayValue.toFixed(2);
        document.getElementById('batteryLifeUnitWith').textContent = withInfo.displayUnit;

        // Show shelf-life note if capped: logic above will set shelfNoteWith.style.display/text when needed
        // ensure shelfNoteWith is hidden unless it's been enabled above
        if (shelfNoteWith) shelfNoteWith.style.display = shelfNoteWith.style.display || 'none';

        results.style.display = 'block';

        // Google Analytics event (guarded — don't throw if analytics didn't load)
        try {
            if (typeof gtag === 'function') {
                gtag('event', 'calculate_battery_life', {
                    'battery_type': batteryType.value,
                    'temperature': document.getElementById('temperature').value
                });
            }
        } catch (e) {
            // swallow analytics errors — not critical
            console.debug('gtag send failed', e);
        }
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

    function getTemperatureFactor(chemistry, temp) {
        const factors = {
            'Lithium': { 25: 1, 0: 0.9, '-10': 0.7, '-20': 0.5 },
            'Alkaline': { 25: 1, 0: 0.8, '-10': 0.6, '-20': 0.4 },
            'Salt': { 25: 1, 0: 0.5, '-10': 0.3, '-20': 0.1 },
            'Ni-Cd': { 25: 1, 0: 0.9, '-10': 0.7, '-20': 0.5 },
            'Ni-MH': { 25: 1, 0: 0.8, '-10': 0.6, '-20': 0.4 },
            'Li-Ion': { 25: 1, 0: 0.8, '-10': 0.6, '-20': 0.45 },
            'Li-Pol': { 25: 1, 0: 0.8, '-10': 0.6, '-20': 0.45 },
            'Lead-acid': { 25: 1, 0: 0.9, '-10': 0.7, '-20': 0.5 }
        };
        return factors[chemistry] && factors[chemistry][temp] ? factors[chemistry][temp] : 1;
    }

    function convertCurrentToMa(current, unit) {
        switch (unit) {
            case 'ua': return current / 1000;
            case 'ma': return current;
            case 'a': return current * 1000;
            default: return current;
        }
    }

    function formatEnergy(value) {
        if (value >= 1) return value.toFixed(3) + ' Wh';
        if (value >= 0.001) return (value * 1000).toFixed(3) + ' mWh';
        return (value * 1000000).toFixed(3) + ' uWh';
    }

    function getDisplayInfo(batteryLifeHours) {
        const batteryLifeDays = batteryLifeHours / 24;
        const batteryLifeMonths = batteryLifeDays / 30;
        const batteryLifeYears = batteryLifeDays / 365;
        const batteryLifeMinutes = batteryLifeHours * 60;
        const batteryLifeSeconds = batteryLifeMinutes * 60;

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
        return { displayValue, displayUnit, iconClass };
    }
});