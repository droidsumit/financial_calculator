// Tab switching functionality
document.addEventListener('DOMContentLoaded', () => {
    const tabs = document.querySelectorAll('.tab-button');
    tabs.forEach(tab => {
        tab.addEventListener('click', () => {
            // Remove active class from all tabs and contents
            document.querySelectorAll('.tab-button').forEach(t => t.classList.remove('active'));
            document.querySelectorAll('.tab-content').forEach(c => c.classList.remove('active'));
            
            // Add active class to clicked tab and corresponding content
            tab.classList.add('active');
            document.getElementById(tab.dataset.tab).classList.add('active');
        });
    });

    // Prepayment functionality
    const prepaymentList = document.getElementById('prepaymentList');
    
    function createNewRow(isLastRow = false) {
        const row = document.createElement('div');
        row.className = 'prepayment-row';
        row.innerHTML = `
            <div class="input-group">
                <input type="number" class="prepay-month" min="1" step="1" placeholder="Month">
            </div>
            <div class="input-group">
                <input type="number" class="prepay-amount" min="0" step="1000" placeholder="Amount">
            </div>
            <div class="action-col">
                <button class="remove-prepayment" title="${isLastRow ? 'Add' : 'Remove'}" data-action="${isLastRow ? 'add' : 'remove'}">
                    ${isLastRow ? '+' : '×'}
                </button>
            </div>
        `;
        
        const button = row.querySelector('.remove-prepayment');
        const monthInput = row.querySelector('.prepay-month');
        const amountInput = row.querySelector('.prepay-amount');

        button.addEventListener('click', () => {
            if (button.dataset.action === 'add') {
                // Only add new row if current row has values
                if (monthInput.value && amountInput.value) {
                    // Convert current row to normal row
                    button.textContent = '×';
                    button.title = 'Remove';
                    button.dataset.action = 'remove';
                    
                    // Add new row
                    prepaymentList.appendChild(createNewRow(true));
                }
            } else {
                // If this is not the last row, remove it
                const rows = prepaymentList.querySelectorAll('.prepayment-row');
                if (rows.length > 1 && row !== rows[rows.length - 1]) {
                    row.remove();
                } else {
                    // Clear inputs if it's the last row
                    monthInput.value = '';
                    amountInput.value = '';
                }
            }
        });

        return row;
    }

    // Initialize with one row
    prepaymentList.innerHTML = ''; // Clear any existing rows
    prepaymentList.appendChild(createNewRow(true));
});

let paymentBreakdownChart = null;
let outstandingBalanceChart = null;

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

// Calculate EMI
function calculateEMI() {
    const loanAmount = parseFloat(document.getElementById('loanAmount').value);
    const annualRate = parseFloat(document.getElementById('interestRate').value);
    const loanTermMonths = parseInt(document.getElementById('loanTerm').value);
    const monthlyExtra = parseFloat(document.getElementById('monthlyExtra').value) || 0;

    if (!loanAmount || !annualRate || !loanTermMonths) {
        alert('Please fill in all required fields');
        return;
    }

    const monthlyRate = annualRate / (12 * 100);
    const monthlyEMI = loanAmount * monthlyRate * Math.pow(1 + monthlyRate, loanTermMonths) / 
                      (Math.pow(1 + monthlyRate, loanTermMonths) - 1);

    // Get prepayment details
    const prepayments = [];
    document.querySelectorAll('.prepayment-row').forEach(row => {
        const month = parseInt(row.querySelector('.prepay-month').value);
        const amount = parseFloat(row.querySelector('.prepay-amount').value);
        if (month && amount) {
            prepayments.push({ month, amount });
        }
    });
    prepayments.sort((a, b) => a.month - b.month);

    // Calculate amortization schedule
    let balance = loanAmount;
    let totalInterest = 0;
    let regularTotalInterest = 0;
    const schedule = [];
    const balanceData = [balance];
    const principalData = [];
    const interestData = [];
    const monthlyExtraData = [];
    const lumpsumData = [];

    // Calculate regular EMI total interest first
    let tempBalance = loanAmount;
    for (let month = 1; month <= loanTermMonths; month++) {
        const interestPayment = tempBalance * monthlyRate;
        const principalPayment = monthlyEMI - interestPayment;
        regularTotalInterest += interestPayment;
        tempBalance -= principalPayment;
    }

    // Now calculate with prepayments
    for (let month = 1; month <= loanTermMonths && balance > 0; month++) {
        const interestPayment = balance * monthlyRate;
        let principalPayment = Math.min(monthlyEMI - interestPayment, balance);
        let monthlyExtraPayment = Math.min(monthlyExtra, balance - principalPayment);
        let lumpsumPayment = 0;

        const prepayment = prepayments.find(p => p.month === month);
        if (prepayment) {
            lumpsumPayment = Math.min(prepayment.amount, balance - principalPayment - monthlyExtraPayment);
        }

        balance -= (monthlyExtraPayment + lumpsumPayment);

        totalInterest += interestPayment;
        balance -= principalPayment;

        if (balance < 0) balance = 0;

        schedule.push({
            month,
            emi: monthlyEMI,
            principal: principalPayment,
            interest: interestPayment,
            monthlyExtra: monthlyExtraPayment,
            lumpsum: lumpsumPayment,
            balance
        });

        balanceData.push(balance);
        principalData.push(principalPayment);
        interestData.push(interestPayment);
        monthlyExtraData.push(monthlyExtraPayment);
        lumpsumData.push(lumpsumPayment);
    }

    // Update summary
    document.getElementById('monthlyEMI').textContent = formatCurrency(monthlyEMI);
    document.getElementById('totalInterestWithout').textContent = formatCurrency(regularTotalInterest);
    document.getElementById('totalInterest').textContent = formatCurrency(totalInterest);
    document.getElementById('totalPayment').textContent = formatCurrency(loanAmount + totalInterest);
    document.getElementById('interestSaved').textContent = formatCurrency(regularTotalInterest - totalInterest);
    
    // Calculate and display loan periods
    document.getElementById('originalTerm').textContent = loanTermMonths + ' months';
    const actualTermMonths = schedule.length;
    document.getElementById('newTerm').textContent = actualTermMonths + ' months';
    
    const monthsSaved = loanTermMonths - actualTermMonths;
    const yearsSaved = Math.floor(monthsSaved / 12);
    const remainingMonths = monthsSaved % 12;
    
    let timeSavedText = '';
    if (yearsSaved > 0) {
        timeSavedText += yearsSaved + ' year' + (yearsSaved > 1 ? 's' : '');
        if (remainingMonths > 0) {
            timeSavedText += ' and ';
        }
    }
    if (remainingMonths > 0 || yearsSaved === 0) {
        timeSavedText += remainingMonths + ' month' + (remainingMonths > 1 ? 's' : '');
    }
    document.getElementById('timeSaved').textContent = timeSavedText;

    // Update amortization table
    const tableBody = document.getElementById('amortizationTable').querySelector('tbody');
    tableBody.innerHTML = '';
    schedule.forEach(row => {
        const tr = document.createElement('tr');
        tr.innerHTML = `
            <td>${row.month}</td>
            <td>${formatCurrency(row.emi)}</td>
            <td>${formatCurrency(row.principal)}</td>
            <td>${formatCurrency(row.interest)}</td>
            <td>${formatCurrency(row.monthlyExtra + row.lumpsum)}</td>
            <td>${formatCurrency(row.balance)}</td>
        `;
        tableBody.appendChild(tr);
    });

    // Update charts
    updatePaymentBreakdownChart(principalData, interestData, monthlyExtraData, lumpsumData);
    updateOutstandingBalanceChart(balanceData);

    document.getElementById('emiResult').classList.add('visible');
}

// Update Payment Breakdown Chart
function updatePaymentBreakdownChart(principalData, interestData, monthlyExtraData, lumpsumData) {
    const ctx = document.getElementById('paymentBreakdown').getContext('2d');
    
    if (paymentBreakdownChart) {
        paymentBreakdownChart.destroy();
    }

    // Calculate proportions for each month
    const totalsByMonth = principalData.map((principal, index) => 
        principal + interestData[index] + monthlyExtraData[index] + lumpsumData[index]
    );

    // Convert raw values to proportions
    const principalProportions = principalData.map((value, index) => value / totalsByMonth[index] || 0);
    const interestProportions = interestData.map((value, index) => value / totalsByMonth[index] || 0);
    const monthlyExtraProportions = monthlyExtraData.map((value, index) => value / totalsByMonth[index] || 0);
    const lumpsumProportions = lumpsumData.map((value, index) => value / totalsByMonth[index] || 0);

    paymentBreakdownChart = new Chart(ctx, {
        type: 'bar',
        data: {
            labels: Array.from({length: principalData.length}, (_, i) => i + 1),
            datasets: [
                {
                    label: 'Interest',
                    data: interestProportions,
                    backgroundColor: 'rgb(255, 99, 132)',
                },
                {
                    label: 'Principal',
                    data: principalProportions,
                    backgroundColor: 'rgb(53, 162, 235)',
                },
                {
                    label: 'Monthly Extra',
                    data: monthlyExtraProportions,
                    backgroundColor: 'rgb(75, 192, 192)',
                },
                {
                    label: 'Lumpsum',
                    data: lumpsumProportions,
                    backgroundColor: 'rgb(255, 159, 64)',
                }
            ]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            scales: {
                x: {
                    stacked: true,
                    title: {
                        display: true,
                        text: 'Month',
                        padding: {
                            top: 10
                        }
                    },
                    grid: {
                        display: false
                    }
                },
                y: {
                    stacked: true,
                    beginAtZero: true,
                    min: 0,
                    max: 1,
                    title: {
                        display: true,
                        text: 'Proportion',
                        padding: {
                            bottom: 10
                        }
                    },
                    ticks: {
                        callback: function(value) {
                            return (value * 100).toFixed(0) + '%';
                        }
                    },
                    grid: {
                        color: 'rgba(0, 0, 0, 0.1)'
                    }
                }
            },
            plugins: {
                title: {
                    display: true,
                    text: 'Payment Breakdown',
                    padding: 20,
                    font: {
                        size: 16,
                        weight: 'normal'
                    }
                },
                legend: {
                    position: 'bottom',
                    align: 'center',
                    labels: {
                        boxWidth: 12,
                        usePointStyle: true,
                        padding: 20
                    }
                },
                tooltip: {
                    callbacks: {
                        label: function(context) {
                            const dataIndex = context.dataIndex;
                            const rawValue = context.dataset.label === 'Principal' ? principalData[dataIndex] :
                                           context.dataset.label === 'Interest' ? interestData[dataIndex] :
                                           context.dataset.label === 'Monthly Extra' ? monthlyExtraData[dataIndex] :
                                           lumpsumData[dataIndex];
                            
                            return `${context.dataset.label}: ${new Intl.NumberFormat('en-IN', {
                                style: 'currency',
                                currency: 'INR',
                                maximumFractionDigits: 0
                            }).format(rawValue)} (${(context.parsed.y * 100).toFixed(1)}%)`;
                        }
                    }
                }
            }
        }
    });
}

// Update Outstanding Balance Chart
function updateOutstandingBalanceChart(balanceData) {
    const ctx = document.getElementById('outstandingBalance').getContext('2d');
    
    if (outstandingBalanceChart) {
        outstandingBalanceChart.destroy();
    }

    outstandingBalanceChart = new Chart(ctx, {
        type: 'line',
        data: {
            labels: Array.from({length: balanceData.length}, (_, i) => i),
            datasets: [{
                label: 'Outstanding Balance',
                data: balanceData,
                borderColor: 'rgb(53, 162, 235)',
                backgroundColor: 'rgba(53, 162, 235, 0.1)',
                fill: true,
                pointRadius: 3,
                pointBackgroundColor: 'rgb(53, 162, 235)',
                pointBorderColor: 'rgb(53, 162, 235)',
                tension: 0.2
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            scales: {
                x: {
                    title: {
                        display: true,
                        text: 'Month',
                        padding: {
                            top: 10
                        }
                    },
                    grid: {
                        color: 'rgba(0, 0, 0, 0.1)',
                        drawTicks: false
                    },
                    ticks: {
                        autoSkip: true,
                        maxTicksLimit: 12
                    }
                },
                y: {
                    title: {
                        display: true,
                        text: 'Balance (₹)',
                        padding: {
                            bottom: 10
                        }
                    },
                    grid: {
                        color: 'rgba(0, 0, 0, 0.1)',
                        drawTicks: false
                    },
                    ticks: {
                        callback: function(value) {
                            return '₹' + value.toLocaleString('en-IN');
                        }
                    }
                }
            },
            plugins: {
                title: {
                    display: true,
                    text: 'Outstanding Balance',
                    padding: 20,
                    font: {
                        size: 16,
                        weight: 'normal'
                    }
                },
                legend: {
                    position: 'bottom',
                    align: 'center',
                    labels: {
                        boxWidth: 12,
                        usePointStyle: true,
                        padding: 20
                    }
                },
                tooltip: {
                    callbacks: {
                        label: function(context) {
                            return 'Balance: ' + new Intl.NumberFormat('en-IN', {
                                style: 'currency',
                                currency: 'INR',
                                maximumFractionDigits: 0
                            }).format(context.parsed.y);
                        }
                    }
                }
            }
        }
    });
}
