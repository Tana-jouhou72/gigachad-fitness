// Payment Page JavaScript

document.addEventListener('DOMContentLoaded', function() {
    // Load selected plan information
    loadSelectedPlan();
    
    // Payment method switching
    initializePaymentMethods();
    
    // Form validation and formatting
    initializeFormFormatting();
    
    // Form submission
    initializeFormSubmission();
    
    // Promo code functionality
    initializePromoCode();
});

// Load selected plan information
function loadSelectedPlan() {
    const selectedPlan = localStorage.getItem('selectedPlan');
    if (selectedPlan) {
        updatePlanDetails(selectedPlan);
        // Clear the stored plan
        localStorage.removeItem('selectedPlan');
    }
}

function updatePlanDetails(planName) {
    const planPrices = {
        'Basic': { price: 8900, features: ['Gym access during peak hours', 'Locker room access', 'Basic equipment usage'] },
        'Premium': { price: 12900, features: ['24/7 gym access', 'All equipment access', 'Unlimited group classes', 'Sauna & steam room'] },
        'VIP': { price: 18900, features: ['All Premium features', 'Priority booking', 'Unlimited personal training', 'Nutrition counseling'] }
    };
    
    const plan = planPrices[planName];
    if (plan) {
        // Update the order item
        const itemDetails = document.querySelector('.item-details h3');
        const itemFeatures = document.querySelector('.item-features');
        const itemPrice = document.querySelector('.item-price .price');
        const membershipFee = document.querySelector('.breakdown-line:first-child span:last-child');
        
        if (itemDetails) {
            itemDetails.textContent = `SPORT GYM - ${planName} Membership`;
        }
        
        if (itemFeatures) {
            itemFeatures.innerHTML = plan.features.slice(0, 3).map(feature => 
                `<span class="feature-tag">${feature.split(' ').slice(0, 2).join(' ')}</span>`
            ).join('');
        }
        
        if (itemPrice) {
            itemPrice.textContent = `¥${plan.price.toLocaleString()}`;
        }
        
        if (membershipFee) {
            membershipFee.textContent = `¥${plan.price.toLocaleString()}`;
        }
        
        // Recalculate total
        updateTotal(plan.price);
    }
}

function updateTotal(membershipPrice) {
    const registrationFee = 3000;
    const subtotal = membershipPrice + registrationFee;
    const tax = Math.round(subtotal * 0.1);
    const total = subtotal + tax;
    
    // Update breakdown
    const taxLine = document.querySelector('.breakdown-line:nth-child(3) span:last-child');
    const totalLine = document.querySelector('.breakdown-line.total span:last-child');
    const submitBtn = document.querySelector('.submit-payment');
    
    if (taxLine) {
        taxLine.textContent = `¥${tax.toLocaleString()}`;
    }
    
    if (totalLine) {
        totalLine.textContent = `¥${total.toLocaleString()}`;
    }
    
    if (submitBtn) {
        submitBtn.innerHTML = `<i class="fa-solid fa-lock"></i> Complete Secure Payment - ¥${total.toLocaleString()}`;
    }
}

// Payment method switching
function initializePaymentMethods() {
    const methodOptions = document.querySelectorAll('.method-option');
    const paymentContents = document.querySelectorAll('.payment-content');
    
    methodOptions.forEach(option => {
        option.addEventListener('click', function() {
            const method = this.getAttribute('data-method');
            
            // Remove active class from all options
            methodOptions.forEach(opt => opt.classList.remove('active'));
            paymentContents.forEach(content => content.classList.remove('active'));
            
            // Add active class to selected option
            this.classList.add('active');
            document.getElementById(method + '-payment').classList.add('active');
        });
    });
}

// Form formatting and validation
function initializeFormFormatting() {
    const cardNumberInput = document.getElementById('card-number');
    const expiryDateInput = document.getElementById('expiry-date');
    const cvvInput = document.getElementById('cvv');
    
    // Card number formatting
    if (cardNumberInput) {
        cardNumberInput.addEventListener('input', function(e) {
            let value = e.target.value.replace(/\s/g, '').replace(/[^0-9]/gi, '');
            let formattedValue = value.match(/.{1,4}/g)?.join(' ') || value;
            e.target.value = formattedValue;
        });
    }
    
    // Expiry date formatting
    if (expiryDateInput) {
        expiryDateInput.addEventListener('input', function(e) {
            let value = e.target.value.replace(/\D/g, '');
            if (value.length >= 2) {
                value = value.substring(0, 2) + '/' + value.substring(2, 4);
            }
            e.target.value = value;
        });
    }
    
    // CVV numeric only
    if (cvvInput) {
        cvvInput.addEventListener('input', function(e) {
            e.target.value = e.target.value.replace(/[^0-9]/g, '');
        });
    }
    
    // Real-time validation
    addInputValidation();
}

// Input validation
function addInputValidation() {
    const inputs = document.querySelectorAll('input[required], select[required]');
    
    inputs.forEach(input => {
        input.addEventListener('blur', function() {
            validateInput(this);
        });
        
        input.addEventListener('input', function() {
            if (this.classList.contains('error')) {
                validateInput(this);
            }
        });
    });
}

function validateInput(input) {
    const value = input.value.trim();
    let isValid = true;
    let errorMessage = '';
    
    // Remove existing error styling
    input.classList.remove('error');
    removeErrorMessage(input);
    
    // Check if required field is empty
    if (input.hasAttribute('required') && !value) {
        isValid = false;
        errorMessage = 'This field is required';
    }
    
    // Specific validations
    switch (input.type) {
        case 'email':
            if (value && !isValidEmail(value)) {
                isValid = false;
                errorMessage = 'Please enter a valid email address';
            }
            break;
        case 'text':
            if (input.id === 'card-number' && value) {
                if (!isValidCardNumber(value.replace(/\s/g, ''))) {
                    isValid = false;
                    errorMessage = 'Please enter a valid card number';
                }
            } else if (input.id === 'expiry-date' && value) {
                if (!isValidExpiryDate(value)) {
                    isValid = false;
                    errorMessage = 'Please enter a valid expiry date';
                }
            } else if (input.id === 'cvv' && value) {
                if (value.length < 3) {
                    isValid = false;
                    errorMessage = 'CVV must be at least 3 digits';
                }
            }
            break;
    }
    
    if (!isValid) {
        input.classList.add('error');
        showErrorMessage(input, errorMessage);
    }
    
    return isValid;
}

function isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

function isValidCardNumber(cardNumber) {
    // Simple Luhn algorithm check
    if (!/^\d{13,19}$/.test(cardNumber)) return false;
    
    let sum = 0;
    let isEven = false;
    
    for (let i = cardNumber.length - 1; i >= 0; i--) {
        let digit = parseInt(cardNumber.charAt(i), 10);
        
        if (isEven) {
            digit *= 2;
            if (digit > 9) {
                digit -= 9;
            }
        }
        
        sum += digit;
        isEven = !isEven;
    }
    
    return sum % 10 === 0;
}

function isValidExpiryDate(expiry) {
    if (!/^\d{2}\/\d{2}$/.test(expiry)) return false;
    
    const [month, year] = expiry.split('/').map(num => parseInt(num, 10));
    const currentDate = new Date();
    const currentYear = currentDate.getFullYear() % 100;
    const currentMonth = currentDate.getMonth() + 1;
    
    if (month < 1 || month > 12) return false;
    if (year < currentYear || (year === currentYear && month < currentMonth)) return false;
    
    return true;
}

function showErrorMessage(input, message) {
    const errorElement = document.createElement('span');
    errorElement.className = 'error-message';
    errorElement.textContent = message;
    errorElement.style.color = '#dc3545';
    errorElement.style.fontSize = '1.2rem';
    errorElement.style.marginTop = '0.5rem';
    errorElement.style.display = 'block';
    
    input.parentNode.appendChild(errorElement);
}

function removeErrorMessage(input) {
    const errorMessage = input.parentNode.querySelector('.error-message');
    if (errorMessage) {
        errorMessage.remove();
    }
}

// Form submission
function initializeFormSubmission() {
    const form = document.getElementById('payment-form');
    
    form.addEventListener('submit', function(e) {
        e.preventDefault();
        
        // Always process payment regardless of form completion
        processPayment();
    });
}

function processPayment() {
    // Show loading state
    const submitBtn = document.querySelector('.submit-payment');
    const originalText = submitBtn.innerHTML;
    
    submitBtn.innerHTML = '<i class="fa-solid fa-spinner fa-spin"></i> Processing Payment...';
    submitBtn.disabled = true;
    
    // Simulate payment processing
    setTimeout(() => {
        // Show success modal instead of just notification
        showPaymentSuccessModal();
        
        // Reset button
        submitBtn.innerHTML = originalText;
        submitBtn.disabled = false;
    }, 2000);
}

// Payment success modal
function showPaymentSuccessModal() {
    // Remove existing modals
    const existingModal = document.querySelector('.success-modal-overlay');
    if (existingModal) {
        existingModal.remove();
    }
    
    // Get payment details
    const selectedPlan = document.querySelector('.item-details h3').textContent;
    const totalAmount = document.querySelector('.breakdown-line.total span:last-child').textContent;
    const currentDate = new Date().toLocaleDateString('en-US', { 
        year: 'numeric', 
        month: 'long', 
        day: 'numeric' 
    });
    
    // Create success modal
    const modal = document.createElement('div');
    modal.className = 'success-modal-overlay';
    modal.innerHTML = `
        <div class="success-modal-content">
            <div class="success-header">
                <div class="success-icon">
                    <i class="fa-solid fa-check-circle"></i>
                </div>
                <h2>Payment Successful!</h2>
                <p>Thank you for your membership purchase</p>
            </div>
            
            <div class="success-details">
                <div class="confirmation-number">
                    <h3>Confirmation Number</h3>
                    <p class="conf-number">#GYM${Date.now().toString().slice(-6)}</p>
                </div>
                
                <div class="purchase-summary">
                    <h3>Purchase Summary</h3>
                    <div class="summary-item">
                        <span>Membership:</span>
                        <span>${selectedPlan}</span>
                    </div>
                    <div class="summary-item">
                        <span>Date:</span>
                        <span>${currentDate}</span>
                    </div>
                    <div class="summary-item total">
                        <span>Total Paid:</span>
                        <span>${totalAmount}</span>
                    </div>
                </div>
                
                <div class="next-steps">
                    <h3>What's Next?</h3>
                    <ul>
                        <li><i class="fa-solid fa-envelope"></i> Confirmation email sent to your inbox</li>
                        <li><i class="fa-solid fa-id-card"></i> Membership card will be ready for pickup</li>
                        <li><i class="fa-solid fa-calendar"></i> Access starts immediately</li>
                        <li><i class="fa-solid fa-phone"></i> Contact us for any questions</li>
                    </ul>
                </div>
            </div>
            
            <div class="success-actions">
                <button class="btn-primary" onclick="goToGymDetails()">
                    <i class="fa-solid fa-dumbbell"></i>
                    View Gym Details
                </button>
                <button class="btn-secondary" onclick="goToHomepage()">
                    <i class="fa-solid fa-home"></i>
                    Go to Homepage
                </button>
            </div>
            
            <button class="success-close" onclick="closeSuccessModal()">
                <i class="fa-solid fa-xmark"></i>
            </button>
        </div>
    `;
    
    // Add styles for success modal
    const successStyles = `
        <style>
        .success-modal-overlay {
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: rgba(0, 0, 0, 0.8);
            display: flex;
            align-items: center;
            justify-content: center;
            z-index: 10000;
            animation: fadeIn 0.4s ease;
        }
        
        .success-modal-content {
            background: white;
            border-radius: 20px;
            width: 90%;
            max-width: 600px;
            max-height: 90vh;
            overflow-y: auto;
            position: relative;
            animation: successSlideIn 0.5s ease;
            box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
        }
        
        .success-header {
            text-align: center;
            padding: 3rem 2rem 2rem;
            background: linear-gradient(135deg, #28a745, #20c997);
            color: white;
            border-radius: 20px 20px 0 0;
        }
        
        .success-icon {
            font-size: 4rem;
            margin-bottom: 1rem;
            animation: bounceIn 0.8s ease;
        }
        
        .success-header h2 {
            margin: 0 0 0.5rem;
            font-size: 2.5rem;
            font-weight: 700;
        }
        
        .success-header p {
            margin: 0;
            font-size: 1.4rem;
            opacity: 0.9;
        }
        
        .success-details {
            padding: 2rem;
        }
        
        .confirmation-number {
            text-align: center;
            margin-bottom: 2rem;
            padding: 1.5rem;
            background: #f8f9fa;
            border-radius: 12px;
        }
        
        .confirmation-number h3 {
            margin: 0 0 0.5rem;
            color: #1a2e40;
            font-size: 1.6rem;
        }
        
        .conf-number {
            font-size: 2rem;
            font-weight: 700;
            color: #28a745;
            margin: 0;
            letter-spacing: 2px;
        }
        
        .purchase-summary {
            margin-bottom: 2rem;
        }
        
        .purchase-summary h3 {
            margin: 0 0 1rem;
            color: #1a2e40;
            font-size: 1.8rem;
            border-bottom: 2px solid #e9ecef;
            padding-bottom: 0.5rem;
        }
        
        .summary-item {
            display: flex;
            justify-content: space-between;
            padding: 1rem 0;
            border-bottom: 1px solid #f0f0f0;
            font-size: 1.4rem;
        }
        
        .summary-item:last-child {
            border-bottom: none;
        }
        
        .summary-item.total {
            font-weight: 700;
            font-size: 1.6rem;
            color: #1a2e40;
            border-top: 2px solid #e9ecef;
            margin-top: 1rem;
            padding-top: 1rem;
        }
        
        .next-steps h3 {
            margin: 0 0 1rem;
            color: #1a2e40;
            font-size: 1.8rem;
            border-bottom: 2px solid #e9ecef;
            padding-bottom: 0.5rem;
        }
        
        .next-steps ul {
            list-style: none;
            padding: 0;
            margin: 0;
        }
        
        .next-steps li {
            display: flex;
            align-items: center;
            gap: 1rem;
            padding: 1rem 0;
            font-size: 1.4rem;
            color: #495057;
        }
        
        .next-steps i {
            color: #28a745;
            font-size: 1.6rem;
            width: 20px;
        }
        
        .success-actions {
            display: flex;
            gap: 1rem;
            padding: 2rem;
            border-top: 1px solid #e9ecef;
        }
        
        .success-actions button {
            flex: 1;
            padding: 1.5rem;
            border: none;
            border-radius: 10px;
            font-size: 1.4rem;
            font-weight: 600;
            cursor: pointer;
            transition: all 0.3s ease;
            display: flex;
            align-items: center;
            justify-content: center;
            gap: 0.8rem;
        }
        
        .success-actions .btn-primary {
            background: #1a2e40;
            color: white;
        }
        
        .success-actions .btn-primary:hover {
            background: #2c4a5e;
            transform: translateY(-2px);
        }
        
        .success-actions .btn-secondary {
            background: #f8f9fa;
            color: #1a2e40;
            border: 2px solid #e9ecef;
        }
        
        .success-actions .btn-secondary:hover {
            background: #e9ecef;
            transform: translateY(-2px);
        }
        
        .success-close {
            position: absolute;
            top: 1rem;
            right: 1rem;
            background: rgba(255, 255, 255, 0.2);
            border: none;
            border-radius: 50%;
            width: 40px;
            height: 40px;
            color: white;
            font-size: 1.6rem;
            cursor: pointer;
            transition: all 0.3s ease;
        }
        
        .success-close:hover {
            background: rgba(255, 255, 255, 0.3);
            transform: rotate(90deg);
        }
        
        @keyframes successSlideIn {
            from { 
                opacity: 0;
                transform: scale(0.8) translateY(-50px);
            }
            to { 
                opacity: 1;
                transform: scale(1) translateY(0);
            }
        }
        
        @keyframes bounceIn {
            0% { transform: scale(0); }
            50% { transform: scale(1.2); }
            100% { transform: scale(1); }
        }
        
        @media (max-width: 768px) {
            .success-modal-content {
                width: 95%;
                margin: 1rem;
            }
            
            .success-actions {
                flex-direction: column;
            }
            
            .success-header {
                padding: 2rem 1rem 1.5rem;
            }
            
            .success-details {
                padding: 1.5rem;
            }
        }
        </style>
    `;
    
    if (!document.querySelector('.success-modal-styles')) {
        const styleElement = document.createElement('div');
        styleElement.className = 'success-modal-styles';
        styleElement.innerHTML = successStyles;
        document.head.appendChild(styleElement);
    }
    
    // Add to page
    document.body.appendChild(modal);
    document.body.style.overflow = 'hidden';
    
    // Close on backdrop click
    modal.addEventListener('click', function(e) {
        if (e.target === modal) {
            closeSuccessModal();
        }
    });
}

// Success modal actions
function goToGymDetails() {
    window.location.href = '../gym detail/gym_detail.html';
}

function goToHomepage() {
    window.location.href = '../homepage/homepage.html';
}

function closeSuccessModal() {
    const modal = document.querySelector('.success-modal-overlay');
    if (modal) {
        modal.remove();
        document.body.style.overflow = 'auto';
    }
}

// Promo code functionality
function initializePromoCode() {
    const promoInput = document.getElementById('promo-input');
    const applyBtn = document.getElementById('apply-promo');
    
    applyBtn.addEventListener('click', function() {
        const promoCode = promoInput.value.trim().toUpperCase();
        
        if (!promoCode) {
            showNotification('Please enter a promo code', 'warning');
            return;
        }
        
        // Simulate promo code validation
        applyPromoCode(promoCode);
    });
    
    promoInput.addEventListener('keypress', function(e) {
        if (e.key === 'Enter') {
            applyBtn.click();
        }
    });
}

function applyPromoCode(code) {
    const validCodes = {
        'WELCOME10': { discount: 10, type: 'percentage' },
        'NEWMEMBER': { discount: 2000, type: 'fixed' },
        'STUDENT15': { discount: 15, type: 'percentage' }
    };
    
    if (validCodes[code]) {
        const discount = validCodes[code];
        applyDiscount(discount);
        showNotification(`Promo code applied! You saved ${discount.type === 'percentage' ? discount.discount + '%' : '¥' + discount.discount}`, 'success');
    } else {
        showNotification('Invalid promo code', 'error');
    }
}

function applyDiscount(discount) {
    const totalElement = document.querySelector('.breakdown-line.total span:last-child');
    const currentTotal = 17490; // Base total
    
    let newTotal;
    if (discount.type === 'percentage') {
        newTotal = currentTotal * (1 - discount.discount / 100);
    } else {
        newTotal = currentTotal - discount.discount;
    }
    
    totalElement.textContent = '¥' + newTotal.toLocaleString();
    
    // Update submit button
    const submitBtn = document.querySelector('.submit-payment');
    submitBtn.innerHTML = `<i class="fa-solid fa-lock"></i> Complete Secure Payment - ¥${newTotal.toLocaleString()}`;
    
    // Add discount line to breakdown
    const discountLine = document.createElement('div');
    discountLine.className = 'breakdown-line discount';
    discountLine.innerHTML = `
        <span>Discount (${discount.type === 'percentage' ? discount.discount + '%' : 'Fixed'})</span>
        <span style="color: #28a745;">-¥${(currentTotal - newTotal).toLocaleString()}</span>
    `;
    
    const totalLine = document.querySelector('.breakdown-line.total');
    totalLine.parentNode.insertBefore(discountLine, totalLine);
}

// Notification system (reused from gym_detail.js)
function showNotification(message, type = 'info') {
    // Remove existing notifications
    const existingNotification = document.querySelector('.notification');
    if (existingNotification) {
        existingNotification.remove();
    }
    
    // Create notification element
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.innerHTML = `
        <div class="notification-content">
            <i class="fa-solid fa-${getIconForType(type)}"></i>
            <span>${message}</span>
            <button class="notification-close" onclick="this.parentElement.parentElement.remove()">
                <i class="fa-solid fa-xmark"></i>
            </button>
        </div>
    `;
    
    // Add styles
    notification.style.cssText = `
        position: fixed;
        top: 130px;
        right: 20px;
        background: ${getColorForType(type)};
        color: white;
        padding: 1rem 2rem;
        border-radius: 8px;
        box-shadow: 0 5px 20px rgba(0, 0, 0, 0.2);
        z-index: 9999;
        animation: slideInRight 0.3s ease;
        max-width: 350px;
    `;
    
    // Add to page
    document.body.appendChild(notification);
    
    // Auto-remove after 5 seconds
    setTimeout(() => {
        if (notification.parentElement) {
            notification.style.animation = 'slideOutRight 0.3s ease';
            setTimeout(() => notification.remove(), 300);
        }
    }, 5000);
}

function getIconForType(type) {
    switch (type) {
        case 'success': return 'check-circle';
        case 'error': return 'exclamation-circle';
        case 'warning': return 'exclamation-triangle';
        default: return 'info-circle';
    }
}

function getColorForType(type) {
    switch (type) {
        case 'success': return '#28a745';
        case 'error': return '#dc3545';
        case 'warning': return '#ffc107';
        default: return '#17a2b8';
    }
}

// Add error styling to CSS
const style = document.createElement('style');
style.textContent = `
    .form-group input.error,
    .form-group select.error {
        border-color: #dc3545;
        box-shadow: 0 0 0 0.2rem rgba(220, 53, 69, 0.25);
    }
    
    @keyframes slideInRight {
        from { transform: translateX(100%); }
        to { transform: translateX(0); }
    }
    
    @keyframes slideOutRight {
        from { transform: translateX(0); }
        to { transform: translateX(100%); }
    }
`;
document.head.appendChild(style);
