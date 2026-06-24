document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById('simForm');
    const simulationDiv = document.getElementById('simulation');
    const timelineDiv = document.getElementById('timeline');
    const intensityEl = document.getElementById('intensity');
    const resultsDiv = document.getElementById('results');
    const resetBtn = document.getElementById('resetBtn');
    const downloadBtn = document.getElementById('downloadBtn');

    let lastSimulationData = null;

    const durSlider = document.getElementById('duration');
    const durValue = document.getElementById('durValue');
    durSlider.addEventListener('input', () => {
        durValue.textContent = durSlider.value;
    });

    resetBtn.addEventListener('click', () => location.reload());

    downloadBtn.addEventListener('click', () => {
        if (!lastSimulationData) return;
        
        let report = `SOLAR STORM IMPACT SIMULATION REPORT\n`;
        report += `=====================================\n\n`;
        report += `Flare Class: ${lastSimulationData.flare_class}\n`;
        report += `Duration: ${lastSimulationData.duration} hours\n`;
        report += `Recovery Time: ${lastSimulationData.recovery_hours} hours\n\n`;
        
        report += `SYSTEM IMPACT SUMMARY:\n`;
        Object.keys(lastSimulationData.systems_info).forEach(key => {
            const sys = lastSimulationData.systems_info[key];
            report += `\n${sys.icon} ${sys.name}\n`;
            report += `${sys.desc}\n`;
        });

        report += `\nPRECAUTIONS:\n`;
        lastSimulationData.precautions.forEach((p, i) => {
            report += `${i+1}. ${p}\n`;
        });

        report += `\nSimulation generated on: ${new Date().toLocaleString()}`;

        const blob = new Blob([report], { type: 'text/plain' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `solar_storm_report_${lastSimulationData.flare_class}.txt`;
        a.click();
    });

    form.addEventListener('submit', async (e) => {
        e.preventDefault();
        
        const flareClass = document.getElementById('flare').value;
        const duration = parseInt(durSlider.value);

        simulationDiv.classList.remove('hidden');
        resultsDiv.classList.add('hidden');
        timelineDiv.innerHTML = '';
        intensityEl.style.width = '0%';

        try {
            const response = await fetch('/simulate', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ flare_class: flareClass, duration: duration })
            });

            const data = await response.json();
            lastSimulationData = data;

            let step = 0;
            const interval = setInterval(() => {
                if (step >= data.timeline.length) {
                    clearInterval(interval);
                    showResults(data);
                    return;
                }

                const t = data.timeline[step];
                intensityEl.style.width = `${t.progress}%`;

                const stepEl = document.createElement('div');
                stepEl.className = 'timeline-step active';
                stepEl.innerHTML = `
                    <strong>${t.time}</strong><br>
                    <small>${t.phase}</small><br>
                    <small>${t.progress}%</small>
                `;
                timelineDiv.appendChild(stepEl);

                Object.keys(t.systems).forEach(sys => {
                    const status = t.systems[sys];
                    const card = document.getElementById(sys);
                    const statusEl = document.getElementById(`${sys}-status`);
                    card.className = `system-card ${status.color}`;
                    statusEl.textContent = `${status.status} (${status.percent})`;
                });

                step++;
            }, 480);

        } catch (error) {
            console.error(error);
            alert('Error running simulation.');
        }
    });

    function showResults(data) {
        document.getElementById('recovery').textContent = data.recovery_hours;
        
        const precDiv = document.getElementById('precautions');
        precDiv.innerHTML = '<strong>Recommended Precautions:</strong><ul>';
        data.precautions.forEach(p => precDiv.innerHTML += `<li>${p}</li>`);
        precDiv.innerHTML += '</ul>';

        const eduDiv = document.getElementById('education');
        eduDiv.innerHTML = `<h4>Why These Systems Are Affected</h4>`;
        Object.keys(data.systems_info).forEach(key => {
            const sys = data.systems_info[key];
            eduDiv.innerHTML += `
                <div style="margin-bottom: 15px;">
                    <strong>${sys.icon} ${sys.name}:</strong>
                    <p style="margin-top: 5px; color: #cbd5e1;">${sys.desc}</p>
                </div>
            `;
        });

        resultsDiv.classList.remove('hidden');
    }
});