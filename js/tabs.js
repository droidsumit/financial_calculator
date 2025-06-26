// Function to handle tab switching
function handleTabSwitch(event) {
    // Remove 'active' class from all tabs and hide all tab content
    document.querySelectorAll('.tab-button').forEach(button => button.classList.remove('active'));
    document.querySelectorAll('.tab-content').forEach(content => content.style.display = 'none');
    
    // Get the target tab ID
    const tabId = event.target.getAttribute('data-tab');
    if (!tabId) {
        console.error('No data-tab attribute found on clicked element');
        return;
    }
    
    // Add 'active' class to clicked tab and show its content
    event.target.classList.add('active');
    const tabContent = document.getElementById(tabId + '-tab');
    if (tabContent) {
        tabContent.style.display = 'block';
        
        // Reinitialize the calculator for this tab
        if (typeof reinitializeCalculator === 'function') {
            reinitializeCalculator(tabId);
        }
        
        // If switching to ITR tab, update tax slabs
        if (tabId === 'itr' && typeof updateTaxSlabs === 'function') {
            updateTaxSlabs();
        }
    } else {
        console.error(`Tab content element with ID ${tabId}-tab not found`);
    }
}

// Initialize tabs when DOM is loaded
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', function() {
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
} else {
    // If DOMContentLoaded has already fired, run initialization immediately
    document.querySelectorAll('.tab-button').forEach(tab => {
        tab.addEventListener('click', handleTabSwitch);
    });
    
    // Show default tab (EMI calculator)
    const defaultTab = document.querySelector('[data-tab="emi"]');
    if (defaultTab) {
        defaultTab.click();
    }
}
