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

// Expose financial year dropdown population globally
window.populateFinancialYearDropdown = function() {
    console.log('Populating financial year dropdown...');
    const dropdown = document.getElementById('financialYear');
    if (!dropdown) {
        console.error('Financial year dropdown element not found');
        return;
    }

    // Clear existing options
    dropdown.innerHTML = '';

    // Add financial years (most recent first)
    const years = [
        { value: '2024-25', text: 'FY 2024-25 (AY 2025-26)' },
        { value: '2023-24', text: 'FY 2023-24 (AY 2024-25)' },
        { value: '2022-23', text: 'FY 2022-23 (AY 2023-24)' }
    ];

    years.forEach(year => {
        const option = document.createElement('option');
        option.value = year.value;
        option.textContent = year.text;
        dropdown.appendChild(option);
    });

    console.log('Financial year dropdown populated successfully');
    // Trigger tax calculation with the selected year
    if (typeof calculateTax === 'function') {
        calculateTax();
    }
};

// Tab switching functionality
function initializeTabs() {
    const tabs = document.querySelectorAll('.tab-button');
    const sections = document.querySelectorAll('.calculator-section');

    // Initially hide all sections except the first one
    sections.forEach((section, index) => {
        if (index === 0) {
            section.classList.add('active');
        } else {
            section.classList.remove('active');
        }
    });

    // Set up tab click handlers
    tabs.forEach(tab => {
        tab.addEventListener('click', () => {
            const targetId = tab.getAttribute('data-tab');
            
            // Update tabs
            tabs.forEach(t => t.classList.remove('active'));
            tab.classList.add('active');
            
            // Update sections
            sections.forEach(section => section.classList.remove('active'));
            const targetSection = document.getElementById(targetId);
            if (targetSection) {
                targetSection.classList.add('active');
            }
        });
    });
}

// Initialize tab switching functionality
function initTabSwitching() {
    const tabs = document.querySelectorAll('.tab-button');
    const calculatorSections = document.querySelectorAll('.calculator-section');
    
    function hideAllSections() {
        calculatorSections.forEach(section => {
            section.style.display = 'none';
            section.classList.remove('active');
        });
    }

    function deactivateAllTabs() {
        tabs.forEach(tab => {
            tab.classList.remove('active');
        });
    }

    function showSection(sectionId) {
        const section = document.getElementById(sectionId);
        if (section) {
            section.style.display = 'block';
            section.classList.add('active');
        }
    }

    // Initially hide all sections except the first one
    hideAllSections();
    if (calculatorSections.length > 0) {
        calculatorSections[0].style.display = 'block';
        calculatorSections[0].classList.add('active');
    }

    // Set first tab as active
    if (tabs.length > 0) {
        tabs[0].classList.add('active');
    }

    // Add click handlers to tabs
    tabs.forEach(tab => {
        tab.addEventListener('click', function(e) {
            e.preventDefault();
            const targetId = this.dataset.tab;
            console.log('Tab clicked:', targetId);
            
            deactivateAllTabs();
            hideAllSections();
            
            this.classList.add('active');
            showSection(targetId);
        });
    });
}

// Document ready handler
document.addEventListener('DOMContentLoaded', function() {
    console.log('Document loaded, initializing tabs...');
    initTabSwitching();
    
    // Tab switching functionality
    // Set up tab click handlers
    document.querySelectorAll('.tab-button').forEach(tab => {
        tab.addEventListener('click', function() {
            const targetId = this.getAttribute('data-tab');
            
            // Hide all calculator sections
            document.querySelectorAll('.calculator-section').forEach(section => {
                section.classList.remove('active');
            });
            
            // Show selected calculator section
            const targetSection = document.getElementById(targetId);
            if (targetSection) {
                targetSection.classList.add('active');
            }
            
            // Update tab states
            document.querySelectorAll('.tab-button').forEach(t => {
                t.classList.remove('active');
            });
            this.classList.add('active');
        });
    });

    // Initialize default tab (EMI Calculator)
    const defaultTab = document.querySelector('.tab-button[data-tab="emi"]');
    if (defaultTab) {
        defaultTab.click();
    }

    // Initialize prepayment lists
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

// Financial Year Constants
const TAX_SLABS = {
    'FY2024-2025_AY2025-2026': {
        old: [
            { limit: 250000, rate: 0 },
            { limit: 500000, rate: 5 },
            { limit: 1000000, rate: 20 },
            { limit: 5000000, rate: 30 },
            { limit: 10000000, rate: 30 },
            { limit: 20000000, rate: 30 },
            { limit: 50000000, rate: 30 },
            { limit: Infinity, rate: 30 }
        ],
        new: [
            { limit: 300000, rate: 0 },
            { limit: 700000, rate: 5 },
            { limit: 1000000, rate: 10 },
            { limit: 1200000, rate: 15 },
            { limit: 1500000, rate: 20 },
            { limit: 5000000, rate: 30 },
            { limit: 10000000, rate: 30 },
            { limit: 20000000, rate: 30 },
            { limit: 50000000, rate: 30 },
            { limit: Infinity, rate: 30 }
        ]
    },
    'FY2023-2024_AY2024-2025': {
        old: [
            { limit: 250000, rate: 0 },
            { limit: 500000, rate: 5 },
            { limit: 1000000, rate: 20 },
            { limit: Infinity, rate: 30 }
        ],
        new: [
            { limit: 300000, rate: 0 },
            { limit: 600000, rate: 5 },
            { limit: 900000, rate: 10 },
            { limit: 1200000, rate: 15 },
            { limit: 1500000, rate: 20 },
            { limit: Infinity, rate: 30 }
        ]
    },
    'FY2022-2023_AY2023-2024': {
        old: [
            { limit: 250000, rate: 0 },
            { limit: 500000, rate: 5 },
            { limit: 1000000, rate: 20 },
            { limit: Infinity, rate: 30 }
        ],
        new: [
            { limit: 300000, rate: 0 },
            { limit: 600000, rate: 5 },
            { limit: 900000, rate: 10 },
            { limit: 1200000, rate: 15 },
            { limit: 1500000, rate: 20 },
            { limit: Infinity, rate: 30 }
        ]
    }
};

// Function to get current financial year
function getCurrentFinancialYear() {
    const today = new Date();
    const month = today.getMonth(); // 0-11
    const year = today.getFullYear();
    
    // If month is January to March (0-2), we're in the previous financial year
    const fyStartYear = month <= 2 ? year - 1 : year;
    const fyEndYear = fyStartYear + 1;
    const ayYear = fyEndYear + 1;
    
    return `FY${fyStartYear}-${fyEndYear}_AY${fyEndYear}-${ayYear}`;
}

// Function to populate financial year dropdown
function populateFinancialYearDropdown() {
    console.log('Attempting to populate financial year dropdown...');
    
    const select = document.getElementById('financialYear');
    if (!select) {
        console.error('Financial year dropdown not found in DOM');
        return;
    }

    // Clear existing options
    console.log('Clearing existing options...');
    select.innerHTML = '';
    
    // Add options from TAX_SLABS
    console.log('Available financial years:', Object.keys(TAX_SLABS));
    Object.keys(TAX_SLABS).forEach(fy => {
        const option = document.createElement('option');
        option.value = fy;
        option.textContent = fy.replace('_', ' ');
        select.appendChild(option);
        console.log('Added option:', fy);
    });
    
    // Set current financial year as default
    const currentFY = getCurrentFinancialYear();
    console.log('Setting current financial year:', currentFY);
    select.value = currentFY;
    
    // Trigger change event
    select.dispatchEvent(new Event('change'));
}

// Function to get current tax slabs based on selected financial year
function getCurrentTaxSlabs() {
    const selectedFY = document.getElementById('financialYear').value;
    return TAX_SLABS[selectedFY] || TAX_SLABS[getCurrentFinancialYear()];
}

// Function to calculate surcharge based on income level
function calculateSurcharge(income, tax, regime) {
    let surcharge = 0;
    
    if (regime === 'old') {
        if (income > 50000000) {
            surcharge = tax * 0.37; // 37% surcharge
        } else if (income > 20000000) {
            surcharge = tax * 0.25; // 25% surcharge
        } else if (income > 10000000) {
            surcharge = tax * 0.15; // 15% surcharge
        } else if (income > 5000000) {
            surcharge = tax * 0.10; // 10% surcharge
        }
    } else { // new regime
        if (income > 20000000) {
            surcharge = tax * 0.25; // 25% surcharge
        } else if (income > 10000000) {
            surcharge = tax * 0.15; // 15% surcharge
        } else if (income > 5000000) {
            surcharge = tax * 0.10; // 10% surcharge
        }
    }

    // Marginal Relief calculation
    const incomeThreshold = regime === 'old' ? 
        (income > 50000000 ? 50000000 : 
         income > 20000000 ? 20000000 :
         income > 10000000 ? 10000000 : 5000000) :
        (income > 20000000 ? 20000000 :
         income > 10000000 ? 10000000 : 5000000);

    const excessIncome = income - incomeThreshold;
    if (excessIncome < surcharge) {
        surcharge = Math.min(surcharge, excessIncome);
    }

    return surcharge;
}

// Initialize on DOM load
document.addEventListener('DOMContentLoaded', function() {
    // Initialize financial year dropdown if we're on the ITR tab
    const itrSection = document.getElementById('itr');
    if (itrSection && itrSection.classList.contains('active')) {
        console.log('Page loaded with ITR tab active, initializing dropdown...');
        populateFinancialYearDropdown();
    }
});

// Modified tax calculation function
function calculateTaxOnIncome(income, regime) {
    const slabs = getCurrentTaxSlabs()[regime];
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

    return totalTax;
}

// Function to calculate tax under old regime
function calculateOldRegimeTax(income, deductions) {
    const selectedYear = document.getElementById('financialYear').value;
    const totalIncome = calculateTotalIncome(income);
    const taxableIncome = Math.max(0, totalIncome - deductions.total);
    
    let tax = calculateTaxOnIncome(taxableIncome, 'old');
    
    // Apply section 87A rebate for old regime (₹5L limit)
    if (taxableIncome <= 500000) {
        tax = Math.max(0, tax - 12500);
    }
    
    // Calculate surcharge and cess
    const surcharge = calculateSurcharge(taxableIncome, tax, 'old');
    const totalTaxWithSurcharge = tax + surcharge;
    const cess = totalTaxWithSurcharge * 0.04;
    
    displayDetailedTaxBreakdown('old', income, taxableIncome, deductions);
    
    return {
        taxableIncome,
        baseTax: tax,
        surcharge,
        cess,
        totalTax: totalTaxWithSurcharge + cess
    };
}

// Function to calculate tax under new regime
function calculateNewRegimeTax(income) {
    const selectedYear = document.getElementById('financialYear').value;
    const totalIncome = calculateTotalIncome(income);
    // New regime doesn't allow most deductions
    const taxableIncome = totalIncome;
    
    let tax = calculateTaxOnIncome(taxableIncome, 'new');
    
    // Apply section 87A rebate for new regime (₹7L limit)
    if (taxableIncome <= 700000) {
        tax = Math.max(0, tax - 25000);
    }
    
    // Calculate surcharge and cess
    const surcharge = calculateSurcharge(taxableIncome, tax, 'new');
    const totalTaxWithSurcharge = tax + surcharge;
    const cess = totalTaxWithSurcharge * 0.04;
    
    displayDetailedTaxBreakdown('new', income, taxableIncome);
    
    return {
        taxableIncome,
        baseTax: tax,
        surcharge,
        cess,
        totalTax: totalTaxWithSurcharge + cess
    };
}

// Function to display tax results
function displayTaxResults(income, deductions, oldTax, newTax) {
    const totalIncome = calculateTotalIncome(income);
    
    // Update summary section
    document.getElementById('totalIncome').textContent = formatCurrency(totalIncome);
    document.getElementById('totalDeductions').textContent = formatCurrency(deductions.total);
    document.getElementById('oldRegimeTax').textContent = formatCurrency(oldTax.totalTax);
    document.getElementById('newRegimeTax').textContent = formatCurrency(newTax.totalTax);
    
    // Show recommendation
    const recommendationEl = document.getElementById('taxRecommendation');
    if (oldTax.totalTax < newTax.totalTax) {
        recommendationEl.textContent = `Old regime is better for you. You save ${formatCurrency(newTax.totalTax - oldTax.totalTax)}`;
        recommendationEl.className = 'recommendation old';
    } else {
        recommendationEl.textContent = `New regime is better for you. You save ${formatCurrency(oldTax.totalTax - newTax.totalTax)}`;
        recommendationEl.className = 'recommendation new';
    }
    
    // Show tax saving suggestions
    showTaxSavingSuggestions(income, deductions, oldTax, newTax);
    
    // Update the tax breakdown visualization
    updateTaxVisualization(oldTax, newTax);
}

// Function to update the tax visualization chart
function updateTaxVisualization(oldTax, newTax) {
    const ctx = document.getElementById('taxComparisonChart').getContext('2d');
    
    // Destroy existing chart if it exists
    if (window.taxComparisonChart) {
        window.taxComparisonChart.destroy();
    }
    
    // Create new chart
    window.taxComparisonChart = new Chart(ctx, {
        type: 'bar',
        data: {
            labels: ['Old Regime', 'New Regime'],
            datasets: [
                {
                    label: 'Base Tax',
                    data: [oldTax.baseTax, newTax.baseTax],
                    backgroundColor: 'rgba(54, 162, 235, 0.5)'
                },
                {
                    label: 'Surcharge',
                    data: [oldTax.surcharge, newTax.surcharge],
                    backgroundColor: 'rgba(255, 99, 132, 0.5)'
                },
                {
                    label: 'Cess',
                    data: [oldTax.cess, newTax.cess],
                    backgroundColor: 'rgba(75, 192, 192, 0.5)'
                }
            ]
        },
        options: {
            responsive: true,
            scales: {
                x: { stacked: true },
                y: {
                    stacked: true,
                    beginAtZero: true,
                    title: {
                        display: true,
                        text: 'Amount (₹)'
                    }
                }
            },
            plugins: {
                title: {
                    display: true,
                    text: 'Tax Breakdown Comparison'
                },
                tooltip: {
                    callbacks: {
                        label: function(context) {
                            return `${context.dataset.label}: ₹${formatCurrency(context.raw)}`;
                        }
                    }
                }
            }
        }
    });
}

// Initialize ITR calculator functionality on load
document.addEventListener('DOMContentLoaded', function() {
    // Initialize financial year dropdown
    populateFinancialYearDropdown();
    
    // Add change listener for financial year
    const fySelect = document.getElementById('financialYear');
    if (fySelect) {
        fySelect.addEventListener('change', function() {
            if (document.getElementById('itrResult').style.display !== 'none') {
                calculateITR(); // Recalculate if results are already showing
            }
        });
    }
});