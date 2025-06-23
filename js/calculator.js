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
