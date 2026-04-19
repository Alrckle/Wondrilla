document.addEventListener('DOMContentLoaded', () => {
    // Donation Widget Logic
    const typeBtns = document.querySelectorAll('.type-btn');
    const amountBtns = document.querySelectorAll('.amount-btn');
    const customAmountWrapper = document.querySelector('.custom-amount-wrapper');
    const customAmountInput = document.getElementById('custom-amount');
    const summaryAmount = document.querySelector('.summary-amount');
    
    // State
    let currentDonationType = 'one-time';
    let currentAmount = 25;
    let isCustom = false;

    // Format currency
    const formatCurrency = (val) => {
        return `$${parseFloat(val).toLocaleString('en-US', { minimumFractionDigits: 0, maximumFractionDigits: 2 })}`;
    };
    
    const updateSummary = () => {
        let displayAmount = isCustom ? customAmountInput.value || '0' : currentAmount;
        let suffix = currentDonationType === 'monthly' ? ' /mo' : '';
        summaryAmount.textContent = `${formatCurrency(displayAmount)}${suffix}`;
        
        // Update Submit button text in payment form
        const submitBtn = document.getElementById('submit-donation');
        submitBtn.innerHTML = `Complete ${formatCurrency(displayAmount)}${suffix} Donation`;
    };

    // Type Selection
    typeBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            typeBtns.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            currentDonationType = btn.dataset.type;
            updateSummary();
        });
    });

    // Amount Selection
    amountBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            amountBtns.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            
            if (btn.dataset.amount === 'custom') {
                isCustom = true;
                customAmountWrapper.classList.remove('hidden');
                customAmountInput.focus();
            } else {
                isCustom = false;
                customAmountWrapper.classList.add('hidden');
                currentAmount = parseInt(btn.dataset.amount);
            }
            updateSummary();
        });
    });

    // Custom Amount Input
    customAmountInput.addEventListener('input', (e) => {
        updateSummary();
    });

    // View Transitions for Modal
    const proceedBtn = document.getElementById('proceed-btn');
    const backBtn = document.getElementById('back-to-amount');
    
    // Initial view elements
    const donationElements = [
        document.querySelector('.donation-type'),
        document.querySelector('.amount-grid'),
        document.querySelector('.custom-amount-wrapper'),
        document.querySelector('.donation-summary'),
        proceedBtn
    ];
    
    const paymentForm = document.getElementById('payment-form');
    const cardHeaderTitle = document.querySelector('.card-header h2');
    const cardHeaderDesc = document.querySelector('.card-header p');

    proceedBtn.addEventListener('click', () => {
        // Validate amount before proceeding
        let amt = isCustom ? parseFloat(customAmountInput.value) : currentAmount;
        if (!amt || amt <= 0) {
            customAmountInput.style.borderColor = 'red';
            // simple shake animation
            customAmountInput.animate([
                { transform: 'translateX(0)' },
                { transform: 'translateX(-5px)' },
                { transform: 'translateX(5px)' },
                { transform: 'translateX(0)' }
            ], { duration: 300 });
            return;
        }

        // Revert border color in case it was red
        if (isCustom) {
            customAmountInput.style.borderColor = 'var(--primary)';
        }

        // Hide amount selection elements
        donationElements.forEach(el => {
            if (el && (!el.classList.contains('hidden') || (el === customAmountWrapper && isCustom))) {
                 el.style.display = 'none';
            }
        });
        
        // Show payment form
        paymentForm.classList.remove('hidden');
        cardHeaderTitle.textContent = 'Payment Details';
        cardHeaderDesc.textContent = 'Enter your information below safely';
    });

    backBtn.addEventListener('click', () => {
        // Hide payment form
        paymentForm.classList.add('hidden');
        
        // Show amount selection elements
        donationElements.forEach(el => {
            if (el) el.style.display = '';
        });
        // re-hide custom if not selected
        if (!isCustom) {
            customAmountWrapper.classList.add('hidden');
        }
        
        cardHeaderTitle.textContent = 'Make a Donation';
        cardHeaderDesc.textContent = 'Select an amount to give';
    });

    // Handle mock submission
    const submitBtn = document.getElementById('submit-donation');
    submitBtn.addEventListener('click', () => {
        submitBtn.innerHTML = '<i data-lucide="loader-2" class="spin"></i> Processing...';
        lucide.createIcons();
        submitBtn.classList.add('processing');
        submitBtn.style.opacity = '0.8';
        
        setTimeout(() => {
            paymentForm.innerHTML = `
                <div style="text-align: center; padding: 2rem 0;">
                    <div style="width: 64px; height: 64px; background: rgba(16, 185, 129, 0.1); color: var(--secondary); border-radius: 50%; display: flex; align-items: center; justify-content: center; margin: 0 auto 1rem;">
                        <i data-lucide="check" style="width: 32px; height: 32px;"></i>
                    </div>
                    <h3 style="font-family: var(--font-heading); font-size: 1.5rem; margin-bottom: 0.5rem;">Thank You!</h3>
                    <p style="color: var(--text-muted);">Your generous donation has been processed successfully.</p>
                </div>
            `;
            lucide.createIcons();
            
            // clear form steps
            document.querySelector('.card-header').style.display = 'none';
        }, 2000);
    });

    // Add spin animation class dynamically
    const style = document.createElement('style');
    style.innerHTML = `
        @keyframes spin {
            from { transform: rotate(0deg); }
            to { transform: rotate(360deg); }
        }
        .spin { animation: spin 1s linear infinite; }
    `;
    document.head.appendChild(style);
});
