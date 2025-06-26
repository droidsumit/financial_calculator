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

// Financial year constants
const TAX_SLABS = {
    'FY2025-2026_AY2026-2027': {
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

// Make financial year dropdown population available globally
window.populateFinancialYearDropdown = function() {
    console.log('Populating financial year dropdown...');
    
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
    });
    
    // Set current financial year as default
    const currentFY = getCurrentFinancialYear();
    console.log('Setting current financial year:', currentFY);
    if (currentFY && Object.keys(TAX_SLABS).includes(currentFY)) {
        select.value = currentFY;
    }
    
    // Update selected FY display
    const selectedFYDisplay = document.getElementById('selectedFY');
    if (selectedFYDisplay) {
        selectedFYDisplay.textContent = select.value.replace('_', ' ');
    }
    
    console.log('Financial year dropdown populated successfully');
};

// Initialize EMI Calculator
function initializeEMICalculator() {
    console.log('Initializing EMI calculator...');
    
    // Set up EMI calculate button
    const calculateEMIButton = document.getElementById('calculateEMI');
    if (calculateEMIButton) {
        calculateEMIButton.addEventListener('click', (e) => {
            e.preventDefault();
            calculateEMI('loan1');
        });
        console.log('EMI calculator button initialized');
    }

    // Set up comparison toggle
    const comparisonToggle = document.getElementById('enableComparison');
    if (comparisonToggle) {
        comparisonToggle.addEventListener('change', toggleComparison);
        console.log('Loan comparison toggle initialized');
    }

    // Initialize prepayment lists
    ['prepaymentList', 'prepaymentList2'].forEach(listId => {
        const prepaymentList = document.getElementById(listId);
        if (prepaymentList) {
            prepaymentList.innerHTML = '';
            prepaymentList.appendChild(createNewRow(true, listId));
            console.log(`Prepayment list ${listId} initialized`);
        }
    });
}

// Initialize SIP Calculator
function initializeSIPCalculator() {
    console.log('Initializing SIP calculator...');
    
    // Set up SIP calculate button
    const calculateSIPButton = document.getElementById('calculateSIP');
    if (calculateSIPButton) {
        calculateSIPButton.addEventListener('click', (e) => {
            e.preventDefault();
            calculateSIP();
        });
        console.log('SIP calculator button initialized');
    }
}

// Initialize SWP Calculator
function initializeSWPCalculator() {
    console.log('Initializing SWP calculator...');
    
    // Set up SWP calculate button
    const calculateSWPButton = document.getElementById('calculateSWP');
    if (calculateSWPButton) {
        calculateSWPButton.addEventListener('click', (e) => {
            e.preventDefault();
            calculateSWP();
        });
        console.log('SWP calculator button initialized');
    }
}

// Initialize ITR Calculator
function initializeITRCalculator() {
    console.log('Initializing ITR calculator...');
    
    // Initialize financial year dropdown
    window.populateFinancialYearDropdown();

    // Set up financial year dropdown change handler
    const fySelect = document.getElementById('financialYear');
    if (fySelect) {
        console.log('Setting up financial year dropdown...');
        fySelect.addEventListener('change', () => {
            if (document.getElementById('itrResult')) {
                calculateITR();
            }
        });
    }

    // Set up calculate ITR button
    const calculateITRButton = document.getElementById('calculateITR');
    if (calculateITRButton) {
        calculateITRButton.addEventListener('click', (e) => {
            e.preventDefault();
            calculateITR();
        });
        console.log('ITR calculator button initialized');
    }

    // Set up reset ITR button
    const resetITRButton = document.getElementById('resetITR');
    if (resetITRButton) {
        resetITRButton.addEventListener('click', resetITRForm);
        console.log('ITR reset button initialized');
    }

    // Set up detailed mode toggle button
    const toggleButton = document.getElementById('enableDetailedMode');
    if (toggleButton) {
        toggleButton.addEventListener('change', toggleDetailedMode);
        console.log('Detailed mode toggle button initialized');
    }
}

// Function to calculate Income Tax Return (ITR)
function calculateITR() {
    console.log('Calculating ITR...');

    // Get total income from all sources
    const income = {
        // Regular salary components
        salary: getNumericValue('basicSalary') +
                getNumericValue('hra') +
                getNumericValue('specialAllowance') +
                getNumericValue('lta') +
                getNumericValue('foodAllowance'),
        
        // Variable pay / Bonus
        bonus: getNumericValue('performanceBonus') +
               getNumericValue('joiningBonus') +
               getNumericValue('retentionBonus'),
        
        // Stock benefits
        stockBenefits: getNumericValue('rsuIncome') +
                      getNumericValue('esppIncome') +
                      getNumericValue('esopBenefit'),
        
        // Special payments
        specialPayments: getNumericValue('gratuity') +
                        getNumericValue('leaveEncashment') +
                        getNumericValue('severancePackage')
    };

    // Calculate total income
    income.totalIncome = income.salary + income.bonus + income.stockBenefits + income.specialPayments;
    console.log('Total income:', income);

    // Get deductions for old regime
    const deductions = {
        // Section 80C investments (max 1.5L)
        section80C: Math.min(
            getNumericValue('epf') +
            getNumericValue('ppf') +
            getNumericValue('elss'),
            150000
        ),
        
        // Health insurance premium (max 25K)
        section80D: Math.min(getNumericValue('medicalInsurance'), 25000),
        
        // Savings account interest (max 10K)
        section80TTA: Math.min(getNumericValue('savingsInterest'), 10000),
        
        // NPS contribution (additional 50K)
        nps: Math.min(getNumericValue('nps'), 50000),
        
        // Standard deduction for salaried employees
        standardDeduction: 50000,
        
        // Home loan interest (max 2L)
        homeLoanInterest: Math.min(getNumericValue('homeLoanInterest'), 200000),
        
        // HRA exemption based on basic salary and rent
        hraExemption: calculateHRAExemption(),
        
        // Professional tax (standard in most states)
        professionalTax: 2400
    };

    // Calculate total deductions
    deductions.total = Object.values(deductions).reduce((sum, val) => sum + val, 0);
    console.log('Total deductions:', deductions);

    // Calculate tax under both regimes
    const oldRegimeTax = calculateOldRegimeTax(income, deductions);
    const newRegimeTax = calculateNewRegimeTax(income);

    // Check if tax calculations were successful
    if (!oldRegimeTax || !newRegimeTax) {
        console.error('Tax calculation failed');
        const errorMessage = 'Unable to calculate tax. Please ensure financial year is selected correctly.';
        document.getElementById('itrResult').innerHTML = `<div class="error-message">${errorMessage}</div>`;
        document.getElementById('itrResult').classList.add('visible');
        return {
            income,
            deductions,
            error: errorMessage
        };
    }

    // Display tax breakdown and results
    displayTaxResults(income, deductions, oldRegimeTax, newRegimeTax);
    
    // Show tax breakdown charts
    updateTaxVisualization(oldRegimeTax, newRegimeTax);

    // Show the results section
    document.getElementById('itrResult').classList.add('visible');
    console.log('ITR calculation complete');

    return {
        income,
        deductions,
        oldRegimeTax,
        newRegimeTax
    };
}

// Function to display tax calculation results
function displayTaxResults(income, deductions, oldRegimeTax, newRegimeTax) {
    console.log('Displaying tax calculation results...');

    const itrResult = document.getElementById('itrResult');
    const oldRegimeBreakdown = document.getElementById('oldRegimeBreakdown');
    const newRegimeBreakdown = document.getElementById('newRegimeBreakdown');
    const regimeRecommendation = document.getElementById('regimeRecommendation');
    const savingsSuggestions = document.getElementById('savingsSuggestions');

    if (!itrResult || !oldRegimeBreakdown || !newRegimeBreakdown || !regimeRecommendation || !savingsSuggestions) {
        console.error('Required result elements not found');
        return;
    }

    // Format currency for display
    const formatCurrency = (amount) => {
        return new Intl.NumberFormat('en-IN', {
            style: 'currency',
            currency: 'INR',
            maximumFractionDigits: 0
        }).format(amount);
    };

    // Update Old Regime fields
    document.getElementById('oldRegimeGross').textContent = formatCurrency(income.totalIncome);
    document.getElementById('oldRegimeDeductions').textContent = formatCurrency(deductions.total);
    document.getElementById('oldRegimeTaxable').textContent = formatCurrency(oldRegimeTax.taxableIncome);
    document.getElementById('oldRegimeTax').textContent = formatCurrency(oldRegimeTax.totalTax);

    // Update New Regime fields
    document.getElementById('newRegimeGross').textContent = formatCurrency(income.totalIncome);
    document.getElementById('newRegimeDeduction').textContent = formatCurrency(50000); // Standard deduction
    document.getElementById('newRegimeTaxable').textContent = formatCurrency(newRegimeTax.taxableIncome);
    document.getElementById('newRegimeTax').textContent = formatCurrency(newRegimeTax.totalTax);

    // Display old regime breakdown
    oldRegimeBreakdown.innerHTML = `
        <thead>
            <tr>
                <th>Income Slab</th>
                <th>Tax Rate</th>
                <th>Tax Amount</th>
            </tr>
        </thead>
        <tbody>
        </tbody>
    `;

    // Display new regime breakdown
    newRegimeBreakdown.innerHTML = `
        <thead>
            <tr>
                <th>Income Slab</th>
                <th>Tax Rate</th>
                <th>Tax Amount</th>
            </tr>
        </thead>
        <tbody>
        </tbody>
    `;

    // Show regime recommendation
    const taxDiff = oldRegimeTax.totalTax - newRegimeTax.totalTax;
    const betterRegime = taxDiff > 0 ? 'new' : 'old';
    regimeRecommendation.innerHTML = `Based on your income and deductions, the <strong>${betterRegime} regime</strong> is better for you. You will save ${formatCurrency(Math.abs(taxDiff))} annually by choosing the ${betterRegime} regime.`;

    // Show tax saving suggestions
    let suggestions = '<ul>';
    
    if (betterRegime === 'old') {
        const unused80C = 150000 - deductions.section80C;
        if (unused80C > 0) {
            suggestions += `<li>You can save up to ${formatCurrency(unused80C * 0.3)} in tax by investing ${formatCurrency(unused80C)} more in 80C options (EPF, PPF, ELSS, etc.)</li>`;
        }
        
        const unused80D = 25000 - deductions.section80D;
        if (unused80D > 0) {
            suggestions += `<li>You can claim up to ${formatCurrency(unused80D)} more for health insurance premium under section 80D</li>`;
        }
        
        const unusedNPS = 50000 - deductions.nps;
        if (unusedNPS > 0) {
            suggestions += `<li>Additional investment of ${formatCurrency(unusedNPS)} in NPS can save you up to ${formatCurrency(unusedNPS * 0.3)} in tax</li>`;
        }
    } else {
        suggestions += `
            <li>In the new regime, deductions don't apply but you get lower tax rates</li>
            <li>Consider investing based on your financial goals rather than tax savings</li>
            <li>Build an emergency fund and diversify your investments</li>
        `;
    }
    suggestions += '</ul>';
    savingsSuggestions.innerHTML = suggestions;

    // Show the results section
    const resultSection = document.querySelector('.tax-comparison');
    if (resultSection) {
        resultSection.style.display = 'flex';
    }

    // Make results visible
    itrResult.classList.add('visible');

    // Update tax visualization
    updateTaxVisualization(oldRegimeTax, newRegimeTax);
}

// Function to update tax visualization charts
function updateTaxVisualization(oldRegimeTax, newRegimeTax) {
    console.log('Updating tax visualization...');
    
    const ctx = document.getElementById('taxComparisonChart');
    if (!ctx) {
        console.error('Tax comparison chart canvas not found');
        return;
    }

    // Destroy existing chart if it exists
    const existingChart = Chart.getChart(ctx);
    if (existingChart) {
        existingChart.destroy();
    }

    // Create new chart
    new Chart(ctx, {
        type: 'bar',
        data: {
            labels: ['Old Regime', 'New Regime'],
            datasets: [
                {
                    label: 'Taxable Income',
                    data: [oldRegimeTax.taxableIncome, newRegimeTax.taxableIncome],
                    backgroundColor: 'rgba(75, 192, 192, 0.5)',
                    borderColor: 'rgba(75, 192, 192, 1)',
                    borderWidth: 1
                },
                {
                    label: 'Total Tax',
                    data: [oldRegimeTax.totalTax, newRegimeTax.totalTax],
                    backgroundColor: 'rgba(54, 162, 235, 0.5)',
                    borderColor: 'rgba(54, 162, 235, 1)',
                    borderWidth: 1
                }
            ]
        },
        options: {
            responsive: true,
            scales: {
                y: {
                    beginAtZero: true,
                    ticks: {
                        callback: (value) => {
                            return new Intl.NumberFormat('en-IN', {
                                style: 'currency',
                                currency: 'INR',
                                maximumFractionDigits: 0,
                                notation: 'compact'
                            }).format(value);
                        }
                    }
                }
            },
            plugins: {
                legend: {
                    position: 'top'
                },
                tooltip: {
                    callbacks: {
                        label: (context) => {
                            return context.dataset.label + ': ' + new Intl.NumberFormat('en-IN', {
                                style: 'currency',
                                currency: 'INR',
                                maximumFractionDigits: 0
                            }).format(context.raw);
                        }
                    }
                }
            }
        }
    });
}

// Helper function to get numeric value from input
function getNumericValue(elementId) {
    const element = document.getElementById(elementId);
    if (!element) {
        console.warn(`Element with id ${elementId} not found`);
        return 0;
    }
    const value = parseFloat(element.value);
    return isNaN(value) ? 0 : value;
}

// Function to calculate tax under old regime
function calculateOldRegimeTax(income, deductions) {
    console.log('Calculating tax under old regime...');
    
    // Calculate taxable income after deductions
    const taxableIncome = Math.max(0, income.totalIncome - deductions.total);
    
    // Get tax slabs for the selected year
    const taxSlabs = getCurrentTaxSlabs()?.old;
    if (!taxSlabs) {
        console.error('Tax slabs not found for old regime');
        return null;
    }
    
    let tax = 0;
    let remainingIncome = taxableIncome;
    let previousLimit = 0;

    // Calculate tax based on slabs
    for (const slab of taxSlabs) {
        const slabIncome = Math.min(remainingIncome, slab.limit - previousLimit);
        if (slabIncome <= 0) break;
        
        tax += (slabIncome * slab.rate) / 100;
        remainingIncome -= slabIncome;
        previousLimit = slab.limit;
    }

    // Apply rebate under section 87A (₹5L limit for old regime)
    if (taxableIncome <= 500000) {
        tax = Math.max(0, tax - 12500);
    }

    // Calculate surcharge and cess
    const surcharge = calculateSurcharge(taxableIncome, tax, 'old');
    const totalTaxWithSurcharge = tax + surcharge;
    const cess = totalTaxWithSurcharge * 0.04; // 4% health & education cess

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
    console.log('Calculating tax under new regime...');
    
    // Only standard deduction of 50,000 is allowed in new regime
    const taxableIncome = Math.max(0, income.totalIncome - 50000);
    
    // Get tax slabs for the selected year
    const taxSlabs = getCurrentTaxSlabs()?.new;
    if (!taxSlabs) {
        console.error('Tax slabs not found for new regime');
        return null;
    }
    
    let tax = 0;
    let remainingIncome = taxableIncome;
    let previousLimit = 0;

    // Calculate tax based on slabs
    for (const slab of taxSlabs) {
        const slabIncome = Math.min(remainingIncome, slab.limit - previousLimit);
        if (slabIncome <= 0) break;
        
        tax += (slabIncome * slab.rate) / 100;
        remainingIncome -= slabIncome;
        previousLimit = slab.limit;
    }

    // Apply rebate under section 87A (₹7L limit for new regime)
    if (taxableIncome <= 700000) {
        tax = Math.max(0, tax - 25000);
    }

    // Calculate surcharge and cess
    const surcharge = calculateSurcharge(taxableIncome, tax, 'new');
    const totalTaxWithSurcharge = tax + surcharge;
    const cess = totalTaxWithSurcharge * 0.04; // 4% health & education cess

    return {
        taxableIncome,
        baseTax: tax,
        surcharge,
        cess,
        totalTax: totalTaxWithSurcharge + cess
    };
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

    // Apply marginal relief
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

// Reset function for ITR form
function resetITRForm() {
    console.log('Resetting ITR form...');

    // Reset all input fields in the ITR calculator section
    const itrSection = document.querySelector('#itr');
    if (!itrSection) {
        console.error('ITR section not found');
        return;
    }

    // Reset all number inputs
    const inputs = itrSection.querySelectorAll('input[type="number"]');
    inputs.forEach(input => {
        input.value = '';
    });

    // Reset select elements
    const selects = itrSection.querySelectorAll('select');
    selects.forEach(select => {
        select.selectedIndex = 0;
    });

    // Reset any displayed results
    const resultElements = [
        'itrResult',
        'oldRegimeBreakdown',
        'newRegimeBreakdown',
        'regimeRecommendation',
        'savingsSuggestions'
    ];

    resultElements.forEach(id => {
        const element = document.getElementById(id);
        if (element) {
            element.innerHTML = '';
            element.classList.remove('visible');
        }
    });

    // Reset and destroy any existing charts
    const chartCanvas = document.getElementById('taxComparisonChart');
    if (chartCanvas) {
        const existingChart = Chart.getChart(chartCanvas);
        if (existingChart) {
            existingChart.destroy();
        }
    }

    // Reset to current financial year in dropdown
    const fyDropdown = document.getElementById('financialYear');
    if (fyDropdown) {
        window.populateFinancialYearDropdown();
    }

    // Reset to simple mode if in detailed mode
    const detailedSection = document.getElementById('detailedIncomeDeductions');
    const simpleSection = document.getElementById('simpleIncomeDeductions');
    const toggleButton = document.getElementById('toggleDetailedMode');
    
    if (detailedSection && simpleSection && toggleButton) {
        detailedSection.style.display = 'none';
        simpleSection.style.display = 'block';
        toggleButton.textContent = 'Switch to Detailed Mode';
    }

    console.log('ITR form reset complete');
}

// Function to create a new prepayment row
function createNewRow(isLastRow = false, listId = 'prepaymentList') {
    const row = document.createElement('div');
    row.className = 'prepayment-row';
    
    // Create date input
    const dateInput = document.createElement('input');
    dateInput.type = 'month';
    dateInput.required = true;
    
    // Create amount input
    const amountInput = document.createElement('input');
    amountInput.type = 'number';
    amountInput.placeholder = 'Amount';
    amountInput.min = '0';
    amountInput.required = true;
    
    // Create type selector
    const typeSelect = document.createElement('select');
    const options = [
        { value: 'monthly', text: 'Monthly Extra' },
        { value: 'lumpsum', text: 'Lumpsum' }
    ];
    options.forEach(opt => {
        const option = document.createElement('option');
        option.value = opt.value;
        option.textContent = opt.text;
        typeSelect.appendChild(option);
    });
    
    // Create add/remove button
    const button = document.createElement('button');
    button.type = 'button';
    button.textContent = isLastRow ? '+' : '×';
    button.className = isLastRow ? 'add-row' : 'remove-row';
    
    // Add click handler
    button.addEventListener('click', () => {
        const list = document.getElementById(listId);
        if (isLastRow) {
            // Add new row after current one
            if (dateInput.value && amountInput.value) {
                list.appendChild(createNewRow(true, listId));
                button.textContent = '×';
                button.className = 'remove-row';
                isLastRow = false;
            } else {
                alert('Please fill in both date and amount');
            }
        } else {
            // Remove current row
            row.remove();
        }
    });
    
    // Assemble row
    row.appendChild(dateInput);
    row.appendChild(amountInput);
    row.appendChild(typeSelect);
    row.appendChild(button);
    
    return row;
}

// Function to toggle between simple and detailed modes in ITR calculator
function toggleDetailedMode() {
    console.log('Toggling detailed mode...');
    
    const detailedSection = document.getElementById('detailedIncomeDeductions');
    const simpleSection = document.getElementById('simpleIncomeDeductions');
    const toggleButton = document.getElementById('toggleDetailedMode');
    
    if (!detailedSection || !simpleSection || !toggleButton) {
        console.error('Required elements for mode toggle not found');
        return;
    }

    const isDetailedMode = detailedSection.style.display === 'block';
    
    // Toggle sections
    detailedSection.style.display = isDetailedMode ? 'none' : 'block';
    simpleSection.style.display = isDetailedMode ? 'block' : 'none';
    
    // Update button text
    toggleButton.textContent = isDetailedMode ? 
        'Switch to Detailed Mode' : 
        'Switch to Simple Mode';
        
    // Recalculate if there are existing results
    if (document.getElementById('itrResult')?.classList.contains('visible')) {
        calculateITR();
    }
    
    console.log('Mode toggled to:', isDetailedMode ? 'simple' : 'detailed');
}

// Function to toggle loan comparison UI
function toggleComparison() {
    console.log('Toggling loan comparison...');
    const comparisonEnabled = document.getElementById('enableComparison').checked;
    const loan2Elements = document.querySelectorAll('.loan2');
    const comparisonCharts = document.querySelectorAll('.comparison-chart');
    
    // Toggle visibility of loan 2 form and comparison charts
    loan2Elements.forEach(element => {
        element.style.display = comparisonEnabled ? 'block' : 'none';
    });
    
    comparisonCharts.forEach(chart => {
        chart.style.display = comparisonEnabled ? 'block' : 'none';
    });
    
    // Clear loan 2 inputs and charts when comparison is disabled
    if (!comparisonEnabled) {
        const loan2Inputs = document.querySelectorAll('.loan2 input');
        loan2Inputs.forEach(input => input.value = '');
        
        // Clear loan 2 charts
        if (charts.loan2.paymentBreakdown) {
            charts.loan2.paymentBreakdown.destroy();
            charts.loan2.paymentBreakdown = null;
        }
        if (charts.loan2.outstandingBalance) {
            charts.loan2.outstandingBalance.destroy();
            charts.loan2.outstandingBalance = null;
        }
        
        // Clear loan 2 prepayment list
        const prepaymentList2 = document.getElementById('prepaymentList2');
        if (prepaymentList2) {
            prepaymentList2.innerHTML = '';
            prepaymentList2.appendChild(createNewRow(true, 'prepaymentList2'));
        }
    }
    
    console.log('Loan comparison toggled:', comparisonEnabled);
}

// Function to calculate HRA exemption
function calculateHRAExemption() {
    const basicSalary = getNumericValue('basicSalary');
    const hraReceived = getNumericValue('hra');
    const rentPaid = getNumericValue('rentPaid');
    const isMetroCity = document.getElementById('metroCity')?.value === 'yes';
    
    if (rentPaid === 0) {
        console.log('No rent paid, HRA exemption is 0');
        return 0;
    }

    // Calculate HRA exemption based on:
    // 1. Actual HRA received
    // 2. 50% of basic salary for metro cities, 40% for non-metro
    // 3. Rent paid minus 10% of basic salary
    const salaryPercent = isMetroCity ? 0.5 : 0.4;
    const exemptionBasedOnSalary = basicSalary * salaryPercent;
    const exemptionBasedOnRent = Math.max(0, rentPaid - (basicSalary * 0.1));
    
    // HRA exemption is minimum of the three
    const hraExemption = Math.min(hraReceived, exemptionBasedOnSalary, exemptionBasedOnRent);
    
    console.log('HRA Exemption calculation:', {
        basicSalary,
        hraReceived,
        rentPaid,
        isMetroCity,
        exemptionBasedOnSalary,
        exemptionBasedOnRent,
        finalExemption: hraExemption
    });
    
    return hraExemption;
}

// Function to get current tax slabs based on selected financial year
function getCurrentTaxSlabs() {
    console.log('Getting tax slabs for selected financial year...');
    
    const fySelect = document.getElementById('financialYear');
    if (!fySelect) {
        console.error('Financial year dropdown not found');
        return null;
    }
    
    const selectedYear = fySelect.value;
    console.log('Selected financial year:', selectedYear);
    console.log('Available financial years:', Object.keys(TAX_SLABS));
    
    if (!TAX_SLABS[selectedYear]) {
        console.error('Tax slabs not found for year:', selectedYear);
        return null;
    }
    
    return TAX_SLABS[selectedYear];
}

// Initialize all calculator components
function initializeAllCalculators() {
    console.log('Initializing calculator functionality...');

    // Initialize all calculators
    initializeEMICalculator();
    initializeSIPCalculator();
    initializeSWPCalculator();
    initializeITRCalculator();
    
    console.log('Calculator initialization complete');
}

// Wait for DOM to be loaded before initializing
document.addEventListener('DOMContentLoaded', initializeAllCalculators);
