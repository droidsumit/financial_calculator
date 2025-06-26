// Tab switching functionality
document.addEventListener('DOMContentLoaded', function() {
    const tabs = document.querySelectorAll('.tab-button');
    const sections = document.querySelectorAll('.calculator-section');

    function switchTab(e) {
        e.preventDefault();
        const targetId = e.target.dataset.tab;

        // Hide all sections and deactivate tabs
        sections.forEach(section => {
            section.classList.remove('active');
        });
        tabs.forEach(tab => {
            tab.classList.remove('active');
        });

        // Show target section and activate tab
        const targetSection = document.getElementById(targetId);
        if (targetSection) {
            targetSection.classList.add('active');
            e.target.classList.add('active');

            // Initialize ITR calculator when switching to ITR tab
            if (targetId === 'itr' && window.populateFinancialYearDropdown) {
                console.log('Initializing ITR calculator on tab switch...');
                window.populateFinancialYearDropdown();
            }
        }
    }

    // Add click handlers to tabs
    tabs.forEach(tab => {
        tab.addEventListener('click', switchTab);
    });

    // Show default tab (EMI calculator)
    const defaultTab = document.querySelector('[data-tab="emi"]');
    if (defaultTab) {
        defaultTab.click();
    }
});
