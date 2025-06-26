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
window.populateFinancialYearDropdown = function () {
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

    // Add change handler to keep display in sync
    select.addEventListener('change', () => {
        if (selectedFYDisplay) {
            selectedFYDisplay.textContent = select.value.replace('_', ' ');
        }
    });

    console.log('Financial year dropdown populated successfully');
};

// Utility function to safely initialize a button with an event listener
function initializeButton(selector, eventHandler, eventType = 'click') {
    const button = typeof selector === 'string' ?
        (document.querySelector(selector) || document.getElementById(selector)) :
        selector;

    if (!button) {
        console.error(`Button not found: ${selector}`);
        return null;
    }

    // Clone the button to remove existing listeners
    const newButton = button.cloneNode(true);
    button.parentNode.replaceChild(newButton, button);

    // Add new event listener
    newButton.addEventListener(eventType, (e) => {
        e.preventDefault();
        eventHandler(e);
    });

    return newButton;
}

// Store references to calculator buttons
const calculatorButtons = {
    emi: null,
    sip: null,
    swp: null,
    itr: null
};

// Helper function to safely add event listener to a button
function initializeButton(selector, clickHandler, buttonName) {
    console.log(`Initializing ${buttonName} button...`);
    const button = document.querySelector(selector);
    if (!button) {
        console.error(`Button '${selector}' not found`);
        return null;
    }

    // Remove existing event listeners by cloning
    const newButton = button.cloneNode(true);
    button.parentNode.replaceChild(newButton, button);

    // Add new event listener
    newButton.addEventListener('click', (e) => {
        e.preventDefault();
        console.log(`${buttonName} button clicked`);
        clickHandler();
    });

    console.log(`${buttonName} button initialized successfully`);
    return newButton;
}

function initializeEMICalculator() {
    console.log('Initializing EMI calculator...');

    // Initialize loan 1 button with class selector
    calculatorButtons.emi = initializeButton('#loan1 .calculate-button', () => calculateEMI('loan1'), 'EMI Loan 1');

    // Initialize loan 2 button if comparison is enabled
    const loan2Button = initializeButton('#loan2 .calculate-button', () => calculateEMI('loan2'), 'EMI Loan 2');

    // Initialize comparison toggle
    const comparisonToggle = document.getElementById('enableComparison');
    if (comparisonToggle) {
        const newToggle = comparisonToggle.cloneNode(true);
        comparisonToggle.parentNode.replaceChild(newToggle, comparisonToggle);
        newToggle.addEventListener('change', toggleComparison);
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

    console.log('EMI calculator initialization complete');
}

function initializeSIPCalculator() {
    console.log('Initializing SIP calculator...');
    calculatorButtons.sip = initializeButton('#sip button.calculate-button', calculateSIP, 'SIP');
}

function initializeSWPCalculator() {
    console.log('Initializing SWP calculator...');
    calculatorButtons.swp = initializeButton('#swp button.calculate-button', calculateSWP, 'SWP');
}

function initializeITRCalculator() {
    console.log('Initializing ITR calculator...');
    calculatorButtons.itr = initializeButton('#itr button.calculate-button', calculateITR, 'ITR');

    // Initialize financial year dropdown
    const fyDropdown = document.getElementById('financialYear');
    if (fyDropdown) {
        // First populate the dropdown
        window.populateFinancialYearDropdown();

        // Then set up the change handler
        const newFySelect = fyDropdown.cloneNode(true);
        fyDropdown.parentNode.replaceChild(newFySelect, fyDropdown);
        newFySelect.addEventListener('change', () => {
            console.log('Financial year changed:', newFySelect.value);
            updateTaxSlabs();
        });

        // Set initial value to current financial year
        const currentFY = getCurrentFinancialYear();
        if (currentFY) {
            newFySelect.value = currentFY;
            console.log('Set initial financial year:', currentFY);
        }
    }

    // Initialize tax slabs for the current year
    updateTaxSlabs();

    // Initialize reset button
    const resetBtn = document.getElementById('resetITR');
    if (resetBtn) {
        const newResetBtn = resetBtn.cloneNode(true);
        resetBtn.parentNode.replaceChild(newResetBtn, resetBtn);
        newResetBtn.addEventListener('click', resetITRForm);
        console.log('ITR reset button initialized');
    }
}

function initializeAllCalculators() {
    console.log('Initializing all calculators...');

    // Initialize each calculator
    initializeEMICalculator();
    initializeSIPCalculator();
    initializeSWPCalculator();
    initializeITRCalculator();

    console.log('All calculators initialized successfully');
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
            getNumericValue('severancePackage'),
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

    // Function to create slab-wise breakdown
    function createSlabBreakdown(taxableIncome, slabs) {
        let table = `
            <thead>
                <tr>
                    <th>Income Slab</th>
                    <th>Tax Rate</th>
                    <th>Tax Amount</th>
                </tr>
            </thead>
            <tbody>`;

        let previousLimit = 0;
        let totalTax = 0;

        for (const slab of slabs) {
            const slabIncome = Math.min(Math.max(0, taxableIncome - previousLimit), slab.limit - previousLimit);
            if (slabIncome <= 0) break;

            const slabTax = (slabIncome * slab.rate) / 100;
            totalTax += slabTax;

            table += `
                <tr>
                    <td>${formatCurrency(previousLimit)} to ${slab.limit === Infinity ? '∞' : formatCurrency(slab.limit)}</td>
                    <td>${slab.rate}%</td>
                    <td>${formatCurrency(slabTax)}</td>
                </tr>`;

            previousLimit = slab.limit;
        }

        table += `</tbody>`;
        return table;
    }

    // Display old regime breakdown
    const oldSlabs = getCurrentTaxSlabs()?.old;
    if (oldSlabs) {
        oldRegimeBreakdown.innerHTML = createSlabBreakdown(oldRegimeTax.taxableIncome, oldSlabs);
    }

    // Display new regime breakdown
    const newSlabs = getCurrentTaxSlabs()?.new;
    if (newSlabs) {
        newRegimeBreakdown.innerHTML = createSlabBreakdown(newRegimeTax.taxableIncome, newSlabs);
    }

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

    // Create month input
    const monthInput = document.createElement('input');
    monthInput.type = 'number';
    monthInput.className = 'prepay-month';
    monthInput.min = '1';
    monthInput.step = '1';
    monthInput.placeholder = 'Month';
    monthInput.required = true;

    // Create amount input
    const amountInput = document.createElement('input');
    amountInput.type = 'number';
    amountInput.className = 'prepay-amount';
    amountInput.min = '0';
    amountInput.step = '1000';
    amountInput.placeholder = 'Amount';
    amountInput.required = true;

    // Create add/remove button
    const button = document.createElement('button');
    button.type = 'button';
    button.textContent = isLastRow ? '+' : '×';
    button.className = isLastRow ? 'add-prepayment' : 'remove-prepayment';

    // Add click handler
    button.addEventListener('click', () => {
        const list = document.getElementById(listId);
        if (isLastRow) {
            // Add new row after current one
            if (monthInput.value && amountInput.value) {
                list.appendChild(createNewRow(true, listId));
                button.textContent = '×';
                button.className = 'remove-prepayment';
                isLastRow = false;
            } else {
                alert('Please fill in both month and amount');
            }
        } else {
            // Remove current row
            row.remove();
        }
    });

    // Assemble row
    row.appendChild(monthInput);
    row.appendChild(amountInput);
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
// Function to toggle loan comparison UI
function toggleComparison() {
    console.log('Toggling loan comparison...');
    const comparisonEnabled = document.getElementById('enableComparison').checked;

    // Get all elements that need to be toggled
    const loan2Form = document.getElementById('loan2');
    const resultsContainer = document.querySelector('.results-container');
    const loan2Chart1 = document.getElementById('paymentBreakdown2')?.closest('.chart-container');
    const loan2Chart2 = document.getElementById('outstandingBalance2')?.closest('.chart-container');

    // Toggle visibility of loan 2 form
    if (loan2Form) {
        loan2Form.style.display = comparisonEnabled ? 'block' : 'none';
    }

    // Update results container layout
    if (resultsContainer) {
        resultsContainer.classList.toggle('comparison-mode', comparisonEnabled);
    }

    // Toggle chart visibility
    [loan2Chart1, loan2Chart2].forEach(chart => {
        if (chart) {
            chart.style.display = comparisonEnabled ? 'block' : 'none';
        }
    });

    // Clear loan 2 data when comparison is disabled
    if (!comparisonEnabled) {
        // Clear input fields
        ['loanAmount2', 'interestRate2', 'loanTerm2', 'monthlyExtra2'].forEach(id => {
            const input = document.getElementById(id);
            if (input) input.value = '';
        });

        // Clear charts
        if (charts.loan2.paymentBreakdown) {
            charts.loan2.paymentBreakdown.destroy();
            charts.loan2.paymentBreakdown = null;
        }
        if (charts.loan2.outstandingBalance) {
            charts.loan2.outstandingBalance.destroy();
            charts.loan2.outstandingBalance = null;
        }

        // Clear results
        const loan2Results = document.getElementById('loan2Results');
        if (loan2Results) {
            loan2Results.innerHTML = '';
            loan2Results.style.display = 'none';
        }

        // Reset prepayment list
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

// Helper function to reinitialize calculator buttons and inputs
function reinitializeCalculator(calculatorId) {
    switch (calculatorId) {
        case 'emi':
            initializeEMICalculator();
            break;
        case 'sip':
            initializeSIPCalculator();
            break;
        case 'swp':
            initializeSWPCalculator();
            break;
        case 'itr':
            initializeITRCalculator();
            break;
    }
}

// Function to handle tab switching
function handleTabSwitch(event) {
    event.preventDefault();
    const targetId = event.target.dataset.tab;

    // Hide all sections and deactivate tabs
    document.querySelectorAll('.calculator-section').forEach(section => {
        section.classList.remove('active');
        section.style.display = 'none';
    });
    document.querySelectorAll('.tab-button').forEach(tab => {
        tab.classList.remove('active');
    });

    // Show target section and activate tab
    const targetSection = document.getElementById(targetId);
    if (targetSection) {
        targetSection.classList.add('active');
        targetSection.style.display = 'block';
        event.target.classList.add('active');

        // Reinitialize the calculator for the newly active tab
        reinitializeCalculator(targetId);
    }
}

// Wait for DOM to be loaded before initializing
document.addEventListener('DOMContentLoaded', () => {
    // Initialize all calculators
    initializeAllCalculators();

    // Set up tab switching
    document.querySelectorAll('.tab-button').forEach(tab => {
        tab.addEventListener('click', handleTabSwitch);
    });

    // Show default tab (EMI calculator)
    const defaultTab = document.querySelector('[data-tab="emi"]');
    if (defaultTab) {
        defaultTab.click();
    }
});

// Function to calculate EMI and amortization schedule
function calculateEMI(loanId) {
    console.log(`Calculating EMI for ${loanId}...`);

    // Get input values
    const suffix = loanId === 'loan2' ? '2' : '';
    const loanAmount = getNumericValue(`loanAmount${suffix}`);
    const annualRate = getNumericValue(`interestRate${suffix}`);
    const loanTermMonths = getNumericValue(`loanTerm${suffix}`);
    const monthlyExtra = getNumericValue(`monthlyExtra${suffix}`);

    if (!loanAmount || !annualRate || !loanTermMonths) {
        alert('Please fill in all required fields (Loan Amount, Interest Rate, and Loan Term)');
        return;
    }

    // Calculate monthly interest rate and base EMI
    const monthlyRate = (annualRate / 12) / 100;
    const baseEMI = (loanAmount * monthlyRate * Math.pow(1 + monthlyRate, loanTermMonths)) /
        (Math.pow(1 + monthlyRate, loanTermMonths) - 1);

    // Get prepayment schedule
    const prepaymentList = document.getElementById(`prepaymentList${suffix}`);
    const prepayments = [];
    if (prepaymentList) {
        prepaymentList.querySelectorAll('.prepayment-row').forEach(row => {
            const month = parseInt(row.querySelector('.prepay-month')?.value);
            const amount = parseFloat(row.querySelector('.prepay-amount')?.value);
            if (!isNaN(month) && !isNaN(amount) && amount > 0) {
                prepayments.push({ month, amount });
            }
        });
    }

    // Sort prepayments by month
    prepayments.sort((a, b) => a.month - b.month);

    // Calculate amortization schedule
    let remainingBalance = loanAmount;
    let totalInterest = 0;
    let totalAmount = 0;
    const schedule = [];
    let month = 1;

    while (remainingBalance > 0 && month <= loanTermMonths) {
        // Calculate interest and principal for this month
        const monthlyInterest = remainingBalance * monthlyRate;
        let monthlyPrincipal = baseEMI - monthlyInterest;

        // Add monthly extra payment if any
        if (monthlyExtra > 0) {
            monthlyPrincipal += monthlyExtra;
        }

        // Add any lumpsum prepayments for this month
        const monthlyPrepayment = prepayments.find(p => p.month === month)?.amount || 0;
        monthlyPrincipal += monthlyPrepayment;

        // Ensure we don't overpay
        monthlyPrincipal = Math.min(monthlyPrincipal, remainingBalance);

        // Update running totals
        remainingBalance -= monthlyPrincipal;
        totalInterest += monthlyInterest;
        totalAmount += monthlyPrincipal + monthlyInterest;

        // Record this month's details
        schedule.push({
            month,
            emi: monthlyPrincipal + monthlyInterest,
            principal: monthlyPrincipal,
            interest: monthlyInterest,
            totalInterest: totalInterest,
            balance: remainingBalance,
            prepayment: monthlyPrepayment + (monthlyExtra || 0)
        });

        month++;
    }

    // Display results
    displayEMIResults(schedule, loanId, {
        loanAmount,
        baseEMI,
        totalInterest,
        totalAmount,
        actualTerm: schedule.length
    });
}

// Function to display EMI calculation results and charts
function displayEMIResults(schedule, loanId, summary) {
    console.log(`Displaying EMI results for ${loanId}...`);

    const chartSuffix = loanId === 'loan2' ? '2' : '1';
    const resultsDiv = document.getElementById(`${loanId}Results`);
    if (!resultsDiv) {
        console.error(`Results div not found for ${loanId}`);
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

    // Create summary HTML
    const summaryHTML = `
        <div class="result-summary">
            <div class="result-item">
                <span class="label">Loan Amount:</span>
                <span class="value">${formatCurrency(summary.loanAmount)}</span>
            </div>
            <div class="result-item">
                <span class="label">Base EMI:</span>
                <span class="value">${formatCurrency(summary.baseEMI)}</span>
            </div>
            <div class="result-item">
                <span class="label">Total Interest:</span>
                <span class="value">${formatCurrency(summary.totalInterest)}</span>
            </div>
            <div class="result-item">
                <span class="label">Total Amount:</span>
                <span class="value">${formatCurrency(summary.totalAmount)}</span>
            </div>
            <div class="result-item">
                <span class="label">Actual Loan Term:</span>
                <span class="value">${summary.actualTerm} months</span>
            </div>
        </div>
    `;

    // Update results div
    resultsDiv.innerHTML = summaryHTML;
    resultsDiv.style.display = 'block';

    // Update charts
    updateEMICharts(schedule, chartSuffix);
}

// Function to update EMI visualization charts
function updateEMICharts(schedule, chartSuffix) {
    // Prepare data for charts
    const labels = schedule.map(s => `Month ${s.month}`);
    const principalData = schedule.map(s => s.principal);
    const interestData = schedule.map(s => s.interest);
    const balanceData = schedule.map(s => s.balance);
    const prepaymentData = schedule.map(s => s.prepayment);

    // Payment Breakdown Chart
    const breakdownCtx = document.getElementById(`paymentBreakdown${chartSuffix}`);
    if (breakdownCtx) {
        if (charts[`loan${chartSuffix}`].paymentBreakdown) {
            charts[`loan${chartSuffix}`].paymentBreakdown.destroy();
        }

        charts[`loan${chartSuffix}`].paymentBreakdown = new Chart(breakdownCtx, {
            type: 'bar',
            data: {
                labels: labels,
                datasets: [
                    {
                        label: 'Principal',
                        data: principalData,
                        backgroundColor: 'rgba(75, 192, 192, 0.5)',
                        stack: 'EMI'
                    },
                    {
                        label: 'Interest',
                        data: interestData,
                        backgroundColor: 'rgba(255, 99, 132, 0.5)',
                        stack: 'EMI'
                    },
                    {
                        label: 'Prepayment',
                        data: prepaymentData,
                        backgroundColor: 'rgba(54, 162, 235, 0.5)',
                        stack: 'Prepay'
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
                        ticks: {
                            callback: value => {
                                return new Intl.NumberFormat('en-IN', {
                                    style: 'currency',
                                    currency: 'INR',
                                    notation: 'compact',
                                    maximumFractionDigits: 1
                                }).format(value);
                            }
                        }
                    }
                },
                plugins: {
                    tooltip: {
                        callbacks: {
                            label: (context) => {
                                return `${context.dataset.label}: ${new Intl.NumberFormat('en-IN', {
                                    style: 'currency',
                                    currency: 'INR',
                                    maximumFractionDigits: 0
                                }).format(context.raw)}`;
                            }
                        }
                    }
                }
            }
        });
    }

    // Outstanding Balance Chart
    const balanceCtx = document.getElementById(`outstandingBalance${chartSuffix}`);
    if (balanceCtx) {
        if (charts[`loan${chartSuffix}`].outstandingBalance) {
            charts[`loan${chartSuffix}`].outstandingBalance.destroy();
        }

        charts[`loan${chartSuffix}`].outstandingBalance = new Chart(balanceCtx, {
            type: 'line',
            data: {
                labels: labels,
                datasets: [{
                    label: 'Outstanding Balance',
                    data: balanceData,
                    borderColor: 'rgb(75, 192, 192)',
                    tension: 0.1
                }]
            },
            options: {
                responsive: true,
                scales: {
                    y: {
                        beginAtZero: true,
                        ticks: {
                            callback: value => {
                                return new Intl.NumberFormat('en-IN', {
                                    style: 'currency',
                                    currency: 'INR',
                                    notation: 'compact',
                                    maximumFractionDigits: 1
                                }).format(value);
                            }
                        }
                    }
                },
                plugins: {
                    tooltip: {
                        callbacks: {
                            label: (context) => {
                                return `Outstanding: ${new Intl.NumberFormat('en-IN', {
                                    style: 'currency',
                                    currency: 'INR',
                                    maximumFractionDigits: 0
                                }).format(context.raw)}`;
                            }
                        }
                    }
                }
            }
        });
    }
}

// Function to calculate SIP returns
function calculateSIP() {
    console.log('Calculating SIP...');

    // Get input values
    const monthlyInvestment = getNumericValue('sipAmount');
    const annualReturn = getNumericValue('sipReturn');
    const years = getNumericValue('sipYears');
    const inflationRate = getNumericValue('sipInflation') || 0;

    if (!monthlyInvestment || !annualReturn || !years) {
        alert('Please fill in all required fields (Monthly Investment, Expected Return, and Investment Period)');
        return;
    }

    // Calculate monthly return rate
    const monthlyRate = (annualReturn / 12) / 100;
    const monthlyInflation = (inflationRate / 12) / 100;
    const totalMonths = years * 12;

    // Initialize arrays for chart data
    const labels = [];
    const investedAmount = [];
    const expectedReturns = [];
    const inflationAdjusted = [];
    let totalInvested = 0;
    let futureValue = 0;
    let inflationAdjustedValue = 0;

    // Calculate month-by-month growth
    for (let month = 1; month <= totalMonths; month++) {
        // Update running totals
        totalInvested += monthlyInvestment;
        futureValue = (futureValue + monthlyInvestment) * (1 + monthlyRate);
        inflationAdjustedValue = futureValue / Math.pow(1 + monthlyInflation, month);

        // Record data points for every year
        if (month % 12 === 0) {
            const year = month / 12;
            labels.push(`Year ${year}`);
            investedAmount.push(totalInvested);
            expectedReturns.push(futureValue);
            inflationAdjusted.push(inflationAdjustedValue);
        }
    }

    // Display results
    displaySIPResults({
        totalInvested,
        futureValue,
        inflationAdjustedValue,
        wealthGained: futureValue - totalInvested,
        chartData: {
            labels,
            investedAmount,
            expectedReturns,
            inflationAdjusted
        }
    });
}

// Function to display SIP calculation results
function displaySIPResults(results) {
    console.log('Displaying SIP results...');

    const resultsDiv = document.getElementById('sipResult');
    if (!resultsDiv) {
        console.error('SIP results div not found');
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

    // Create summary HTML
    const summaryHTML = `
        <div class="result-summary">
            <div class="result-item">
                <span class="label">Total Amount Invested:</span>
                <span class="value">${formatCurrency(results.totalInvested)}</span>
            </div>
            <div class="result-item">
                <span class="label">Expected Future Value:</span>
                <span class="value">${formatCurrency(results.futureValue)}</span>
            </div>
            <div class="result-item">
                <span class="label">Inflation Adjusted Value:</span>
                <span class="value">${formatCurrency(results.inflationAdjustedValue)}</span>
            </div>
            <div class="result-item">
                <span class="label">Wealth Gained:</span>
                <span class="value">${formatCurrency(results.wealthGained)}</span>
            </div>
        </div>
    `;

    // Update results div
    resultsDiv.innerHTML = summaryHTML;
    resultsDiv.style.display = 'block';

    // Update chart
    const ctx = document.getElementById('sipChart');
    if (ctx) {
        // Destroy existing chart if it exists
        const existingChart = Chart.getChart(ctx);
        if (existingChart) {
            existingChart.destroy();
        }

        new Chart(ctx, {
            type: 'line',
            data: {
                labels: results.chartData.labels,
                datasets: [
                    {
                        label: 'Invested Amount',
                        data: results.chartData.investedAmount,
                        borderColor: 'rgb(75, 192, 192)',
                        fill: false
                    },
                    {
                        label: 'Expected Returns',
                        data: results.chartData.expectedReturns,
                        borderColor: 'rgb(255, 99, 132)',
                        fill: false
                    },
                    {
                        label: 'Inflation Adjusted',
                        data: results.chartData.inflationAdjusted,
                        borderColor: 'rgb(54, 162, 235)',
                        fill: false
                    }
                ]
            },
            options: {
                responsive: true,
                scales: {
                    y: {
                        beginAtZero: true,
                        ticks: {
                            callback: value => {
                                return new Intl.NumberFormat('en-IN', {
                                    style: 'currency',
                                    currency: 'INR',
                                    notation: 'compact',
                                    maximumFractionDigits: 1
                                }).format(value);
                            }
                        }
                    }
                },
                plugins: {
                    tooltip: {
                        callbacks: {
                            label: (context) => {
                                return `${context.dataset.label}: ${new Intl.NumberFormat('en-IN', {
                                    style: 'currency',
                                    currency: 'INR',
                                    maximumFractionDigits: 0
                                }).format(context.raw)}`;
                            }
                        }
                    }
                }
            }
        });
    }
}

// Function to calculate SWP (Systematic Withdrawal Plan)
function calculateSWP() {
    console.log('Calculating SWP...');

    // Get input values
    const initialCorpus = getNumericValue('initialAmount');
    const monthlyWithdrawal = getNumericValue('swpAmount');
    const annualReturn = getNumericValue('swpReturn');
    const years = getNumericValue('swpYears');
    const inflationRate = getNumericValue('swpInflation') || 0;

    if (!initialCorpus || !monthlyWithdrawal || !annualReturn || !years) {
        alert('Please fill in all required fields (Initial Investment, Monthly Withdrawal, Expected Return, and Period)');
        return;
    }

    // Calculate monthly rates
    const monthlyRate = (annualReturn / 12) / 100;
    const monthlyInflation = (inflationRate / 12) / 100;
    const totalMonths = years * 12;

    // Initialize arrays for chart data
    const labels = [];
    const corpusValues = [];
    const withdrawnAmount = [];
    let remainingCorpus = initialCorpus;
    let totalWithdrawn = 0;
    let inflationAdjustedWithdrawal = monthlyWithdrawal;

    // Calculate month-by-month changes
    for (let month = 1; month <= totalMonths && remainingCorpus > 0; month++) {
        // Calculate returns for this month
        const monthlyReturn = remainingCorpus * monthlyRate;

        // Adjust withdrawal amount for inflation
        if (month > 1) {
            inflationAdjustedWithdrawal *= (1 + monthlyInflation);
        }

        // Update corpus
        remainingCorpus = remainingCorpus + monthlyReturn - inflationAdjustedWithdrawal;
        totalWithdrawn += inflationAdjustedWithdrawal;

        // Record data points for every year
        if (month % 12 === 0) {
            const year = month / 12;
            labels.push(`Year ${year}`);
            corpusValues.push(Math.max(0, remainingCorpus));
            withdrawnAmount.push(totalWithdrawn);
        }
    }

    // Calculate sustainability
    const isSustainable = remainingCorpus > 0;
    const sustainableYears = labels.length;

    // Display results
    displaySWPResults({
        initialCorpus,
        remainingCorpus: Math.max(0, remainingCorpus),
        totalWithdrawn,
        isSustainable,
        sustainableYears,
        chartData: {
            labels,
            corpusValues,
            withdrawnAmount
        }
    });
}

// Function to display SWP calculation results
function displaySWPResults(results) {
    console.log('Displaying SWP results...');

    const resultsDiv = document.getElementById('swpResult');
    if (!resultsDiv) {
        console.error('SWP results div not found');
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

    // Create summary HTML
    const summaryHTML = `
        <div class="result-summary">
            <div class="result-item">
                <span class="label">Initial Corpus:</span>
                <span class="value">${formatCurrency(results.initialCorpus)}</span>
            </div>
            <div class="result-item">
                <span class="label">Remaining Corpus:</span>
                <span class="value">${formatCurrency(results.remainingCorpus)}</span>
            </div>
            <div class="result-item">
                <span class="label">Total Withdrawn:</span>
                <span class="value">${formatCurrency(results.totalWithdrawn)}</span>
            </div>
            <div class="result-item">
                <span class="label">Sustainability:</span>
                <span class="value ${results.isSustainable ? 'sustainable' : 'unsustainable'}">
                    ${results.isSustainable ? 'Plan is sustainable' : `Plan will last ${results.sustainableYears} years`}
                </span>
            </div>
        </div>
    `;

    // Update results div
    resultsDiv.innerHTML = summaryHTML;
    resultsDiv.style.display = 'block';

    // Update chart
    const ctx = document.getElementById('swpChart');
    if (ctx) {
        // Destroy existing chart if it exists
        const existingChart = Chart.getChart(ctx);
        if (existingChart) {
            existingChart.destroy();
        }

        new Chart(ctx, {
            type: 'line',
            data: {
                labels: results.chartData.labels,
                datasets: [
                    {
                        label: 'Remaining Corpus',
                        data: results.chartData.corpusValues,
                        borderColor: 'rgb(75, 192, 192)',
                        fill: false
                    },
                    {
                        label: 'Total Withdrawn',
                        data: results.chartData.withdrawnAmount,
                        borderColor: 'rgb(255, 99, 132)',
                        fill: false
                    }
                ]
            },
            options: {
                responsive: true,
                scales: {
                    y: {
                        beginAtZero: true,
                        ticks: {
                            callback: value => {
                                return new Intl.NumberFormat('en-IN', {
                                    style: 'currency',
                                    currency: 'INR',
                                    notation: 'compact',
                                    maximumFractionDigits: 1
                                }).format(value);
                            }
                        }
                    }
                },
                plugins: {
                    tooltip: {
                        callbacks: {
                            label: (context) => {
                                return `${context.dataset.label}: ${new Intl.NumberFormat('en-IN', {
                                    style: 'currency',
                                    currency: 'INR',
                                    maximumFractionDigits: 0
                                }).format(context.raw)}`;
                            }
                        }
                    }
                }
            }
        });
    }
}

// Function to update tax slabs based on selected financial year
function updateTaxSlabs() {
    console.log('Updating tax slabs...');
    
    // Get current tax slabs
    const taxSlabs = getCurrentTaxSlabs();
    if (!taxSlabs) {
        console.error('Failed to get tax slabs');
        return;
    }

    // Format currency for display
    const formatCurrency = (amount) => {
        if (amount === Infinity) return '∞';
        return new Intl.NumberFormat('en-IN', {
            style: 'currency',
            currency: 'INR',
            maximumFractionDigits: 0,
            notation: amount >= 10000000 ? 'compact' : 'standard'
        }).format(amount);
    };

    // Helper function to format tax slab
    const formatTaxSlab = (slab, index, slabs) => {
        const start = index === 0 ? 0 : slabs[index - 1].limit;
        const end = slab.limit;
        return `${slab.rate}% ${formatCurrency(start)} to ${formatCurrency(end)}`;
    };

    // Update display elements if they exist
    const oldRegimeLimits = document.getElementById('oldRegimeLimits');
    const newRegimeLimits = document.getElementById('newRegimeLimits');

    if (oldRegimeLimits) {
        oldRegimeLimits.innerHTML = '<h4>Old Regime Tax Slabs:</h4><ul>' +
            taxSlabs.old.map((slab, index) => 
                `<li>${formatTaxSlab(slab, index, taxSlabs.old)}</li>`
            ).join('') + '</ul>';
    }

    if (newRegimeLimits) {
        newRegimeLimits.innerHTML = '<h4>New Regime Tax Slabs:</h4><ul>' +
            taxSlabs.new.map((slab, index) => 
                `<li>${formatTaxSlab(slab, index, taxSlabs.new)}</li>`
            ).join('') + '</ul>';
    }

    // Update year display
    const selectedFY = document.getElementById('selectedFY');
    if (selectedFY) {
        const fySelect = document.getElementById('financialYear');
        if (fySelect) {
            selectedFY.textContent = fySelect.value.replace('_', ' ');
        }
    }

    // Show tax slabs section
    const taxSlabsSection = document.getElementById('taxSlabsSection');
    if (taxSlabsSection) {
        taxSlabsSection.style.display = 'block';
    }

    // Recalculate tax if results are already displayed
    if (document.getElementById('itrResult')?.classList.contains('visible')) {
        calculateITR();
    }

    console.log('Tax slabs updated successfully');
}

// Function to get current financial year
