// Tab switching functionality
function switchTab(targetId) {
    const tabs = document.querySelectorAll('.tab-button');
    const sections = document.querySelectorAll('.calculator-section');

    // Hide all sections
    sections.forEach(section => {
        section.style.display = 'none';
        section.classList.remove('active');
    });

    // Deactivate all tabs
    tabs.forEach(tab => {
        tab.classList.remove('active');
    });

    // Show target section and activate tab
    const targetSection = document.getElementById(targetId);
    const targetTab = document.querySelector(`[data-tab="${targetId}"]`);

    if (targetSection && targetTab) {
        targetSection.style.display = 'block';
        targetSection.classList.add('active');
        targetTab.classList.add('active');

        // Initialize ITR calculator when switching to ITR tab
        if (targetId === 'itr' && window.populateFinancialYearDropdown) {
            console.log('Initializing ITR calculator on tab switch...');
            window.populateFinancialYearDropdown();
        }
    }
}

// Expose switchTab globally
window.switchTab = switchTab;

// Initialize tabs on page load
document.addEventListener('DOMContentLoaded', function() {
    const tabs = document.querySelectorAll('.tab-button');

    // Add click handlers to tabs
    tabs.forEach(tab => {
        tab.addEventListener('click', function(e) {
            e.preventDefault();
            const targetId = this.getAttribute('data-tab');
            switchTab(targetId);
        });
    });

    // Show default tab (EMI calculator)
    switchTab('emi');
});
