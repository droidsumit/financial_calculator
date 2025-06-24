// Chart instances for both loans
const charts = {
    loan1: {
        paymentBreakdown: null,
        outstandingBalance: null
    },
    loan2: {
        paymentBreakdown: null,
        outstandingBalance: null
    }
};

// Tab switching functionality
document.addEventListener('DOMContentLoaded', () => {
    console.log('Document loaded, setting up tabs...');
    
    // Log initial tab state
    const tabs = document.querySelectorAll('.tab-button');
    console.log('Found tabs:', tabs.length);
    tabs.forEach(tab => console.log('Tab:', tab.dataset.tab));
    
    // Log initial content state
    const contents = document.querySelectorAll('.calculator-section');
    console.log('Found calculator sections:', contents.length);
    contents.forEach(content => {
        console.log('Content:', content.id, 'Classes:', content.className);
    });
    
    tabs.forEach(tab => {
        tab.addEventListener('click', () => {
            try {
                // Get the target content ID
                const targetId = tab.dataset.tab;
                console.log('Switching to tab:', targetId);
                
                // Remove active class from all tabs and contents
                document.querySelectorAll('.tab-button').forEach(t => t.classList.remove('active'));
                document.querySelectorAll('.calculator-section').forEach(c => c.classList.remove('active'));
                
                // Add active class to clicked tab and corresponding content
                tab.classList.add('active');
                const content = document.getElementById(targetId);
                if (!content) {
                    console.error('Could not find content for tab:', targetId);
                    return;
                }
                content.classList.add('active');
                console.log('Tab switch complete');
            } catch (error) {
                console.error('Error switching tabs:', error);
            }
        });
    });

    // Initialize prepayment lists for both loans
    ['prepaymentList', 'prepaymentList2'].forEach(listId => {
        const prepaymentList = document.getElementById(listId);
        if (prepaymentList) {
            prepaymentList.innerHTML = '';
            prepaymentList.appendChild(createNewRow(true, listId));
        }
    });
});

function createNewRow(isLastRow = false, listId = 'prepaymentList') {
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
    const list = document.getElementById(listId);

    button.addEventListener('click', () => {
        if (button.dataset.action === 'add') {
            if (monthInput.value && amountInput.value) {
                button.textContent = '×';
                button.title = 'Remove';
                button.dataset.action = 'remove';
                list.appendChild(createNewRow(true, listId));
            }
        } else {
            const rows = list.querySelectorAll('.prepayment-row');
            if (rows.length > 1 && row !== rows[rows.length - 1]) {
                row.remove();
            } else {
                monthInput.value = '';
                amountInput.value = '';
            }
        }
    });

    return row;
}

// Toggle loan comparison
function toggleComparison() {
    const isEnabled = document.getElementById('enableComparison').checked;
    const loan2Form = document.getElementById('loan2');
    const emiResult = document.getElementById('emiResult');
    
    if (isEnabled) {
        loan2Form.classList.add('visible');
        emiResult.classList.add('comparison-enabled');
    } else {
        loan2Form.classList.remove('visible');
        emiResult.classList.remove('comparison-enabled');
    }
}

// Calculate EMI
function calculateEMI(loanId = 'loan1') {
    const suffix = loanId === 'loan1' ? '' : '2';
    const loanAmount = parseFloat(document.getElementById('loanAmount' + suffix).value);
    const annualRate = parseFloat(document.getElementById('interestRate' + suffix).value);
    const loanTermMonths = parseInt(document.getElementById('loanTerm' + suffix).value);
    const monthlyExtra = parseFloat(document.getElementById('monthlyExtra' + suffix).value) || 0;

    if (!loanAmount || !annualRate || !loanTermMonths) {
        alert('Please fill in all required fields for ' + (loanId === 'loan1' ? 'Loan 1' : 'Loan 2'));
        return;
    }

    const monthlyRate = annualRate / (12 * 100);
    const monthlyEMI = loanAmount * monthlyRate * Math.pow(1 + monthlyRate, loanTermMonths) / 
                      (Math.pow(1 + monthlyRate, loanTermMonths) - 1);

    // Get prepayment details
    const prepayments = [];
    document.querySelectorAll('#prepaymentList' + suffix + ' .prepayment-row').forEach(row => {
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
    document.getElementById('monthlyEMI' + suffix).textContent = formatCurrency(monthlyEMI);
    document.getElementById('totalInterestWithout' + suffix).textContent = formatCurrency(regularTotalInterest);
    document.getElementById('totalInterest' + suffix).textContent = formatCurrency(totalInterest);
    document.getElementById('totalPayment' + suffix).textContent = formatCurrency(loanAmount + totalInterest);
    document.getElementById('interestSaved' + suffix).textContent = formatCurrency(regularTotalInterest - totalInterest);
    document.getElementById('originalTerm' + suffix).textContent = loanTermMonths + ' months';
    const actualTermMonths = schedule.length;
    document.getElementById('newTerm' + suffix).textContent = actualTermMonths + ' months';
    const monthsSaved = loanTermMonths - actualTermMonths;
    document.getElementById('timeSaved' + suffix).textContent = monthsSaved + ' months';

    // Update amortization table
    const tableBody = document.getElementById('amortizationTable' + suffix).querySelector('tbody');
    tableBody.innerHTML = '';
    schedule.forEach(row => {
        const tr = document.createElement('tr');
        const monthlyExtraValue = row.monthlyExtra || 0;
        const lumpsumValue = row.lumpsum || 0;
        
        tr.innerHTML = `
            <td>${row.month}</td>
            <td>${formatCurrency(row.emi)}</td>
            <td>${formatCurrency(row.principal)}</td>
            <td>${formatCurrency(row.interest)}</td>
            <td class="monthly-extra">${monthlyExtraValue > 0 ? formatCurrency(monthlyExtraValue) : '-'}</td>
            <td class="lumpsum">${lumpsumValue > 0 ? formatCurrency(lumpsumValue) : '-'}</td>
            <td>${formatCurrency(row.balance)}</td>
        `;
        tableBody.appendChild(tr);
    });

    // Update charts
    updatePaymentBreakdownChart(principalData, interestData, monthlyExtraData, lumpsumData, loanId);
    updateOutstandingBalanceChart(balanceData, loanId);

    document.getElementById('emiResult').classList.add('visible');
}

function formatCurrency(amount) {
    return new Intl.NumberFormat('en-IN', {
        style: 'currency',
        currency: 'INR',
        maximumFractionDigits: 0
    }).format(amount);
}

function updatePaymentBreakdownChart(principalData, interestData, monthlyExtraData, lumpsumData, loanId) {
    const chartId = `paymentBreakdown${loanId === 'loan2' ? '2' : ''}`;
    const ctx = document.getElementById(chartId).getContext('2d');
    
    if (charts[loanId].paymentBreakdown) {
        charts[loanId].paymentBreakdown.destroy();
    }

    const totalsByMonth = principalData.map((principal, index) => 
        principal + interestData[index] + monthlyExtraData[index] + lumpsumData[index]
    );

    const principalProportions = principalData.map((value, index) => value / totalsByMonth[index] || 0);
    const interestProportions = interestData.map((value, index) => value / totalsByMonth[index] || 0);
    const monthlyExtraProportions = monthlyExtraData.map((value, index) => value / totalsByMonth[index] || 0);
    const lumpsumProportions = lumpsumData.map((value, index) => value / totalsByMonth[index] || 0);

    charts[loanId].paymentBreakdown = new Chart(ctx, {
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
                    text: `Payment Breakdown - ${loanId === 'loan1' ? 'Loan 1' : 'Loan 2'}`,
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
                            
                            return `${context.dataset.label}: ${formatCurrency(rawValue)} (${(context.parsed.y * 100).toFixed(1)}%)`;
                        }
                    }
                }
            }
        }
    });
}

function updateOutstandingBalanceChart(balanceData, loanId) {
    const chartId = `outstandingBalance${loanId === 'loan2' ? '2' : ''}`;
    const ctx = document.getElementById(chartId).getContext('2d');
    
    if (charts[loanId].outstandingBalance) {
        charts[loanId].outstandingBalance.destroy();
    }

    charts[loanId].outstandingBalance = new Chart(ctx, {
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
                    text: `Outstanding Balance - ${loanId === 'loan1' ? 'Loan 1' : 'Loan 2'}`,
                    padding: 20,
                    font: {
                        size: 16,
                        weight: 'normal'
                    }
                },
                legend: {
                    display: false
                },
                tooltip: {
                    callbacks: {
                        label: function(context) {
                            return 'Balance: ' + formatCurrency(context.parsed.y);
                        }
                    }
                }
            }
        }
    });
}

// SIP Calculator
function calculateSIP() {
    console.log('Calculating SIP...');
    const monthlyAmount = parseFloat(document.getElementById('sipAmount').value);
    const years = parseFloat(document.getElementById('sipYears').value);
    const returnRate = parseFloat(document.getElementById('sipReturn').value);
    const stepUp = parseFloat(document.getElementById('stepUp').value) || 0;
    const inflation = parseFloat(document.getElementById('sipInflation').value) || 0;
    
    if (!monthlyAmount || !years || !returnRate) {
        alert('Please fill in all required fields');
        return;
    }

    const months = years * 12;
    const monthlyRate = returnRate / 12 / 100;
    const stepUpRate = stepUp / 100;
    let totalInvestment = 0;
    let maturityValue = 0;
    let currentMonthlyAmount = monthlyAmount;

    for (let year = 0; year < years; year++) {
        for (let month = 0; month < 12; month++) {
            totalInvestment += currentMonthlyAmount;
            maturityValue += currentMonthlyAmount;
            maturityValue *= (1 + monthlyRate);
        }
        // Apply step-up at the end of each year
        currentMonthlyAmount *= (1 + stepUpRate);
    }

    // Calculate inflation-adjusted value
    const realReturn = ((1 + returnRate/100)/(1 + inflation/100) - 1) * 100;
    const inflationAdjustedValue = maturityValue / Math.pow(1 + inflation/100, years);

    const resultHTML = `
        <div class="result-section">
            <h3>SIP Results</h3>
            <p class="result-item">Total Investment: <span class="highlight">${formatCurrency(totalInvestment)}</span></p>
            <p class="result-item">Maturity Value: <span class="highlight">${formatCurrency(maturityValue)}</span></p>
            <p class="result-item">Wealth Gained: <span class="highlight">${formatCurrency(maturityValue - totalInvestment)}</span></p>
            <p class="result-item">Real Return Rate: <span class="highlight">${realReturn.toFixed(2)}%</span></p>
            <p class="result-item">Inflation Adjusted Value: <span class="highlight">${formatCurrency(inflationAdjustedValue)}</span></p>
        </div>
    `;

    document.getElementById('sipResult').innerHTML = resultHTML;
    document.getElementById('sipResult').classList.add('visible');
    console.log('SIP calculation complete');
}

// SWP Calculator
function calculateSWP() {
    console.log('Calculating SWP...');
    const corpus = parseFloat(document.getElementById('swpCorpus').value);
    const withdrawal = parseFloat(document.getElementById('swpWithdrawal').value);
    const years = parseFloat(document.getElementById('swpYears').value);
    const returnRate = parseFloat(document.getElementById('swpReturn').value);
    const inflation = parseFloat(document.getElementById('swpInflation').value) || 0;
    
    if (!corpus || !withdrawal || !years || !returnRate) {
        alert('Please fill in all required fields');
        return;
    }

    const months = years * 12;
    const monthlyRate = returnRate / 12 / 100;
    const inflationRate = inflation / 12 / 100;
    
    let remainingCorpus = corpus;
    let totalWithdrawal = 0;
    let currentMonthlyWithdrawal = withdrawal;
    let monthsRemaining = months;

    for (let i = 0; i < months && remainingCorpus > 0; i++) {
        // Increase withdrawal amount for inflation
        if (i > 0 && i % 12 === 0) {
            currentMonthlyWithdrawal *= (1 + inflation/100);
        }

        // Calculate monthly investment return
        remainingCorpus *= (1 + monthlyRate);
        
        // Deduct withdrawal
        if (remainingCorpus >= currentMonthlyWithdrawal) {
            remainingCorpus -= currentMonthlyWithdrawal;
            totalWithdrawal += currentMonthlyWithdrawal;
        } else {
            totalWithdrawal += remainingCorpus;
            remainingCorpus = 0;
            monthsRemaining = i + 1;
            break;
        }
    }

    const resultHTML = `
        <div class="result-section">
            <h3>SWP Results</h3>
            <p class="result-item">Initial Corpus: <span class="highlight">${formatCurrency(corpus)}</span></p>
            <p class="result-item">Total Withdrawals: <span class="highlight">${formatCurrency(totalWithdrawal)}</span></p>
            <p class="result-item">Remaining Corpus: <span class="highlight">${formatCurrency(remainingCorpus)}</span></p>
            <p class="result-item">Monthly Withdrawal (Final): <span class="highlight">${formatCurrency(currentMonthlyWithdrawal)}</span></p>
            <p class="result-item ${remainingCorpus <= 0 ? 'warning' : ''}">
                Sustainability: <span class="highlight">
                    ${remainingCorpus <= 0 
                        ? `Corpus depleted in ${monthsRemaining} months!` 
                        : 'Sustainable for the entire period'}
                </span>
            </p>
        </div>
    `;

    document.getElementById('swpResult').innerHTML = resultHTML;
    document.getElementById('swpResult').classList.add('visible');
    console.log('SWP calculation complete');
}

// Tax Regime Constants
const OLD_REGIME_SLABS = [
    { limit: 250000, rate: 0 },
    { limit: 500000, rate: 5 },
    { limit: 750000, rate: 10 },
    { limit: 1000000, rate: 15 },
    { limit: 1250000, rate: 20 },
    { limit: 1500000, rate: 25 },
    { limit: Infinity, rate: 30 }
];

const NEW_REGIME_SLABS = [
    { limit: 300000, rate: 0 },
    { limit: 600000, rate: 5 },
    { limit: 900000, rate: 10 },
    { limit: 1200000, rate: 15 },
    { limit: 1500000, rate: 20 },
    { limit: Infinity, rate: 30 }
];

// ITR Calculator Functions
function toggleDetailedMode() {
    const detailedMode = document.getElementById('enableDetailedMode').checked;
    document.querySelectorAll('.section-card').forEach(section => {
        if (section.classList.contains('detailed-only')) {
            section.style.display = detailedMode ? 'block' : 'none';
        }
    });
}

function calculateITR() {
    // Gather Income Data
    const income = {
        regular: {
            basic: getInputValue('basicSalary'),
            hra: getInputValue('hra'),
            special: getInputValue('specialAllowance'),
            lta: getInputValue('lta'),
            food: getInputValue('foodAllowance')
        },
        stocks: {
            rsu: getInputValue('rsuIncome'),
            espp: getInputValue('esppIncome'),
            esop: getInputValue('esopBenefit')
        },
        variable: {
            performance: getInputValue('performanceBonus'),
            joining: getInputValue('joiningBonus'),
            retention: getInputValue('retentionBonus')
        },
        special: {
            gratuity: getInputValue('gratuity'),
            leave: getInputValue('leaveEncashment'),
            severance: getInputValue('severancePackage')
        }
    };

    // Calculate Deductions (Old Regime)
    const deductions = calculateDeductions();
    
    // Calculate Tax for Both Regimes
    const oldRegimeTax = calculateOldRegimeTax(income, deductions);
    const newRegimeTax = calculateNewRegimeTax(income);
    
    // Display Results
    displayTaxResults(income, deductions, oldRegimeTax, newRegimeTax);
    
    // Update Charts
    updateTaxCharts(income, deductions, oldRegimeTax, newRegimeTax);
    
    // Show Tax Saving Recommendations
    showTaxRecommendations(oldRegimeTax, newRegimeTax, deductions);
}

function calculateDeductions() {
    const deductions = {
        section80C: {
            epf: getInputValue('epf'),
            ppf: getInputValue('ppf'),
            elss: getInputValue('elss')
        },
        housing: {
            interest: getInputValue('homeLoanInterest'),
            rentPaid: getInputValue('rentPaid'),
            isMetro: document.getElementById('metroCity').value === 'yes'
        },
        other: {
            medical: getInputValue('medicalInsurance'),
            nps: getInputValue('nps'),
            savings: getInputValue('savingsInterest')
        }
    };

    // Calculate total 80C (max 1.5L)
    deductions.total80C = Math.min(150000, 
        deductions.section80C.epf + 
        deductions.section80C.ppf + 
        deductions.section80C.elss
    );

    // Calculate HRA exemption
    deductions.hraExemption = calculateHRAExemption(
        getInputValue('basicSalary'),
        getInputValue('hra'),
        deductions.housing.rentPaid,
        deductions.housing.isMetro
    );

    // Calculate other deductions
    deductions.totalOther = 
        Math.min(25000, deductions.other.medical) +  // 80D limit
        Math.min(50000, deductions.other.nps) +      // 80CCD(1B) limit
        Math.min(10000, deductions.other.savings);   // 80TTA limit

    // Total deductions
    deductions.total = deductions.total80C + 
                      deductions.hraExemption +
                      Math.min(200000, deductions.housing.interest) + // Home loan interest limit
                      deductions.totalOther;

    return deductions;
}

function calculateHRAExemption(basicSalary, hraReceived, rentPaid, isMetro) {
    const exemption = Math.min(
        hraReceived,
        rentPaid - (0.1 * basicSalary),
        isMetro ? (0.5 * basicSalary) : (0.4 * basicSalary)
    );
    return Math.max(0, exemption);
}

function calculateOldRegimeTax(income, deductions) {
    // Calculate total income
    const totalIncome = calculateTotalIncome(income);
    
    // Calculate taxable income after deductions
    const taxableIncome = Math.max(0, totalIncome - deductions.total);
    
    // Calculate tax based on slabs
    return calculateTaxOnIncome(taxableIncome, OLD_REGIME_SLABS);
}

function calculateNewRegimeTax(income) {
    // Calculate total income
    const totalIncome = calculateTotalIncome(income);
    
    // Standard deduction of 50,000 in new regime
    const taxableIncome = Math.max(0, totalIncome - 50000);
    
    // Calculate tax based on new regime slabs
    return calculateTaxOnIncome(taxableIncome, NEW_REGIME_SLABS);
}

function calculateTotalIncome(income) {
    return Object.values(income).reduce((total, category) => 
        total + Object.values(category).reduce((sum, value) => sum + value, 0), 0);
}

function calculateTaxOnIncome(income, slabs) {
    let remainingIncome = income;
    let totalTax = 0;
    let previousLimit = 0;

    for (const slab of slabs) {
        const slabIncome = Math.min(remainingIncome, slab.limit - previousLimit);
        if (slabIncome <= 0) break;

        totalTax += (slabIncome * slab.rate) / 100;
        remainingIncome -= slabIncome;
        previousLimit = slab.limit;
    }

    // Add surcharge if applicable
    if (income > 5000000) {
        const surchargeRate = income > 10000000 ? 0.15 : 0.10;
        totalTax += totalTax * surchargeRate;
    }

    // Add 4% cess
    totalTax += totalTax * 0.04;

    return totalTax;
}

function displayTaxResults(income, deductions, oldTax, newTax) {
    const totalIncome = calculateTotalIncome(income);

    // Update Old Regime Results
    document.getElementById('oldRegimeGross').textContent = formatCurrency(totalIncome);
    document.getElementById('oldRegimeDeductions').textContent = formatCurrency(deductions.total);
    document.getElementById('oldRegimeTaxable').textContent = formatCurrency(totalIncome - deductions.total);
    document.getElementById('oldRegimeTax').textContent = formatCurrency(oldTax);

    // Update New Regime Results
    document.getElementById('newRegimeGross').textContent = formatCurrency(totalIncome);
    document.getElementById('newRegimeDeduction').textContent = formatCurrency(50000);
    document.getElementById('newRegimeTaxable').textContent = formatCurrency(totalIncome - 50000);
    document.getElementById('newRegimeTax').textContent = formatCurrency(newTax);

    // Show Recommendation
    const recommendation = document.getElementById('regimeRecommendation');
    if (oldTax < newTax) {
        recommendation.innerHTML = `<strong>Recommendation:</strong> Choose Old Tax Regime and save ${formatCurrency(newTax - oldTax)} annually`;
    } else {
        recommendation.innerHTML = `<strong>Recommendation:</strong> Choose New Tax Regime and save ${formatCurrency(oldTax - newTax)} annually`;
    }

    // Show Tax Saving Suggestions
    showTaxSavingSuggestions(income, deductions, oldTax, newTax);
}

function updateTaxCharts(income, deductions, oldTax, newTax) {
    // Tax Comparison Chart
    const taxCompCtx = document.getElementById('taxComparisonChart').getContext('2d');
    new Chart(taxCompCtx, {
        type: 'bar',
        data: {
            labels: ['Old Regime', 'New Regime'],
            datasets: [{
                label: 'Tax Liability',
                data: [oldTax, newTax],
                backgroundColor: ['#6052FF', '#4CAF50'],
                borderColor: ['#4A3ECC', '#388E3C'],
                borderWidth: 1
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                title: {
                    display: true,
                    text: 'Tax Liability Comparison'
                },
                tooltip: {
                    callbacks: {
                        label: function(context) {
                            return 'Tax: ' + formatCurrency(context.raw);
                        }
                    }
                }
            }
        }
    });

    // Income Distribution Chart
    const totalIncome = calculateTotalIncome(income);
    const incomeDistCtx = document.getElementById('incomeDistributionChart').getContext('2d');
    new Chart(incomeDistCtx, {
        type: 'doughnut',
        data: {
            labels: ['Regular Salary', 'Stock Benefits', 'Variable Pay', 'Special Payments'],
            datasets: [{
                data: [
                    Object.values(income.regular).reduce((a, b) => a + b, 0),
                    Object.values(income.stocks).reduce((a, b) => a + b, 0),
                    Object.values(income.variable).reduce((a, b) => a + b, 0),
                    Object.values(income.special).reduce((a, b) => a + b, 0)
                ],
                backgroundColor: ['#6052FF', '#FF6B6B', '#4CAF50', '#FFA726']
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                title: {
                    display: true,
                    text: 'Income Distribution'
                },
                tooltip: {
                    callbacks: {
                        label: function(context) {
                            const value = context.raw;
                            const percentage = ((value / totalIncome) * 100).toFixed(1);
                            return `${context.label}: ${formatCurrency(value)} (${percentage}%)`;
                        }
                    }
                }
            }
        }
    });
}

function showTaxSavingSuggestions(income, deductions, oldTax, newTax) {
    const suggestions = document.getElementById('savingsSuggestions');
    let suggestionText = '<h4>Tax Saving Opportunities:</h4><ul>';

    // Check 80C utilization
    const remaining80C = 150000 - deductions.total80C;
    if (remaining80C > 0) {
        suggestionText += `<li>Invest ₹${remaining80C.toLocaleString()} more in 80C options (ELSS, PPF, etc.)</li>`;
    }

    // Check NPS utilization
    const remainingNPS = 50000 - deductions.other.nps;
    if (remainingNPS > 0) {
        suggestionText += `<li>Consider investing in NPS to save additional tax (up to ₹${remainingNPS.toLocaleString()})</li>`;
    }

    // Home loan suggestions
    if (deductions.housing.interest === 0) {
        suggestionText += '<li>Consider home loan benefits under Section 24 and 80EEA</li>';
    }

    // Medical insurance
    if (deductions.other.medical < 25000) {
        suggestionText += '<li>Buy medical insurance to claim deduction under Section 80D</li>';
    }

    suggestionText += '</ul>';
    suggestions.innerHTML = suggestionText;
}

function resetForm() {
    // Reset all input fields
    document.querySelectorAll('input[type="number"]').forEach(input => {
        input.value = '';
    });
    
    // Reset select fields
    document.getElementById('metroCity').value = 'no';
    
    // Reset results
    document.getElementById('itrResult').style.display = 'none';
    
    // Reset detailed mode
    document.getElementById('enableDetailedMode').checked = false;
    toggleDetailedMode();
}

function getInputValue(id) {
    return parseFloat(document.getElementById(id).value) || 0;
}
