export function initROICalculator() {
  const employeesInput = document.getElementById('calc-employees');
  const hoursInput = document.getElementById('calc-hours');
  const rateInput = document.getElementById('calc-rate');

  const employeesVal = document.getElementById('val-employees');
  const hoursVal = document.getElementById('val-hours');
  const rateVal = document.getElementById('val-rate');

  const resultHoursSaved = document.getElementById('res-hours-saved');
  const resultCostSaved = document.getElementById('res-cost-saved');
  const resultROI = document.getElementById('res-roi');
  const resultEfficiency = document.getElementById('res-efficiency');

  if (!employeesInput || !hoursInput || !rateInput) return;

  function updateCalculator() {
    const employees = parseInt(employeesInput.value, 10) || 10;
    const hoursPerWeek = parseInt(hoursInput.value, 10) || 15;
    const hourlyRate = parseInt(rateInput.value, 10) || 25;

    // Update labels
    if (employeesVal) employeesVal.innerText = `${employees} colaboradores`;
    if (hoursVal) hoursVal.innerText = `${hoursPerWeek} hrs / semana`;
    if (rateVal) rateVal.innerText = `$${hourlyRate} USD / hora`;

    // Calculations
    const weeklyTotalHours = employees * hoursPerWeek;
    const annualTotalHours = weeklyTotalHours * 52;
    const annualWastedCost = annualTotalHours * hourlyRate;

    // ASYS Automation saves ~85% of manual operational time
    const annualHoursSaved = Math.round(annualTotalHours * 0.85);
    const annualMoneySaved = Math.round(annualWastedCost * 0.85);
    const projectedROI = ((annualMoneySaved / Math.max(annualMoneySaved * 0.2, 5000)) * 100).toFixed(0);

    // Animate counter values
    if (resultHoursSaved) {
      resultHoursSaved.innerText = `${annualHoursSaved.toLocaleString('es-CO')} hrs/año`;
    }
    if (resultCostSaved) {
      resultCostSaved.innerText = `$${annualMoneySaved.toLocaleString('es-CO')} USD`;
    }
    if (resultROI) {
      resultROI.innerText = `${projectedROI}%`;
    }
    if (resultEfficiency) {
      resultEfficiency.innerText = `+85% Liberado`;
    }
  }

  // Add event listeners
  [employeesInput, hoursInput, rateInput].forEach(input => {
    input.addEventListener('input', updateCalculator);
  });

  // Initial calculation run
  updateCalculator();
}
