// Function to format currency
function formatCurrency(amount) {
    return new Intl.NumberFormat('en-IN', {
        style: 'currency',
        currency: 'INR',
        maximumFractionDigits: 0
    }).format(amount);
}

// Calculate SIP returns with step-up
function calculateSIP() {
    const monthlyInvestment = parseFloat(document.getElementById('sipAmount').value);
    const years = parseInt(document.getElementById('sipYears').value);
    const returnRate = parseFloat(document.getElementById('sipReturn').value);
    const stepUpRate = parseFloat(document.getElementById('stepUp').value) || 0;
    const inflationRate = parseFloat(document.getElementById('sipInflation').value) || 0;
    
    if (!monthlyInvestment || !years || !returnRate) {
        alert('Please fill in all required fields');
        return;
    }

    // Calculate real return rate adjusted for inflation
    const realReturnRate = ((1 + returnRate/100) / (1 + inflationRate/100) - 1) * 100;
    const monthlyRate = realReturnRate / (12 * 100);
    const totalMonths = years * 12;
    let totalInvestment = 0;
    let futureValue = 0;
    let currentMonthlyInvestment = monthlyInvestment;

    for (let year = 0; year < years; year++) {
        for (let month = 0; month < 12; month++) {
            totalInvestment += currentMonthlyInvestment;
            futureValue = (futureValue + currentMonthlyInvestment) * (1 + monthlyRate);
        }
        // Apply step-up at the end of each year
        currentMonthlyInvestment *= (1 + stepUpRate / 100);
    }

    const wealthGained = futureValue - totalInvestment;
    
    const resultDiv = document.getElementById('sipResult');
    resultDiv.innerHTML = `
        <h3>Results:</h3>
        <p>Total Investment: ${formatCurrency(totalInvestment)}</p>
        <p>Expected Future Value: ${formatCurrency(futureValue)}</p>
        <p>Wealth Gained: ${formatCurrency(wealthGained)}</p>
        <p>Real Return Rate (Inflation Adjusted): ${realReturnRate.toFixed(2)}%</p>
        <p>Real Future Value (Today's Money): ${formatCurrency(futureValue / Math.pow(1 + inflationRate/100, years))}</p>
    `;
    resultDiv.classList.add('visible');
}

// Calculate SWP (Systematic Withdrawal Plan)
function calculateSWP() {
    const initialAmount = parseFloat(document.getElementById('initialAmount').value);
    const monthlyWithdrawal = parseFloat(document.getElementById('swpAmount').value);
    const years = parseInt(document.getElementById('swpYears').value);
    const returnRate = parseFloat(document.getElementById('swpReturn').value);
    const inflationRate = parseFloat(document.getElementById('swpInflation').value) || 0;

    if (!initialAmount || !monthlyWithdrawal || !years || !returnRate) {
        alert('Please fill in all required fields');
        return;
    }

    // Calculate real return rate adjusted for inflation
    const realReturnRate = ((1 + returnRate/100) / (1 + inflationRate/100) - 1) * 100;
    const monthlyRate = realReturnRate / (12 * 100);
    const totalMonths = years * 12;
    let currentBalance = initialAmount;
    let totalWithdrawn = 0;
    let monthsLasted = 0;

    for (let month = 1; month <= totalMonths; month++) {
        // Calculate monthly returns
        currentBalance *= (1 + monthlyRate);
        
        // Withdraw the monthly amount
        if (currentBalance >= monthlyWithdrawal) {
            currentBalance -= monthlyWithdrawal;
            totalWithdrawn += monthlyWithdrawal;
            monthsLasted = month;
        } else {
            break;
        }
    }

    const resultDiv = document.getElementById('swpResult');
    resultDiv.innerHTML = `
        <h3>Results:</h3>
        <p>Total Amount Withdrawn: ${formatCurrency(totalWithdrawn)}</p>
        <p>Remaining Balance: ${formatCurrency(currentBalance)}</p>
        <p>Real Return Rate (Inflation Adjusted): ${realReturnRate.toFixed(2)}%</p>
        <p>Real Remaining Balance (Today's Money): ${formatCurrency(currentBalance / Math.pow(1 + inflationRate/100, years))}</p>
    `;

    if (monthsLasted < totalMonths) {
        resultDiv.innerHTML += `
            <p class="warning">⚠️ Warning: Funds will be exhausted after ${Math.floor(monthsLasted/12)} years and ${monthsLasted%12} months at this withdrawal rate.</p>
        `;
    }
    
    resultDiv.classList.add('visible');
}
