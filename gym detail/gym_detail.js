// Gym Detail Page JavaScript

document.addEventListener('DOMContentLoaded', function() {
    // Initialize image gallery - ensure main image matches active thumbnail
    initializeImageGallery();
    
    // Tab switching functionality
    const tabButtons = document.querySelectorAll('.tab-btn');
    const tabPanes = document.querySelectorAll('.tab-pane');
    
    tabButtons.forEach(button => {
        button.addEventListener('click', function() {
            const targetTab = this.getAttribute('data-tab');
            
            // Remove active class from all tabs and panes
            tabButtons.forEach(btn => btn.classList.remove('active'));
            tabPanes.forEach(pane => pane.classList.remove('active'));
            
            // Add active class to clicked tab and corresponding pane
            this.classList.add('active');
            document.getElementById(targetTab).classList.add('active');
        });
    });
    
    // Favorite button functionality
    const favoriteBtn = document.getElementById('favorite-btn');
    favoriteBtn.addEventListener('click', function() {
        this.classList.toggle('active');
        const icon = this.querySelector('i');
        
        if (this.classList.contains('active')) {
            icon.className = 'fa-solid fa-heart';
            showNotification('Added to favorites!', 'success');
        } else {
            icon.className = 'fa-regular fa-heart';
            showNotification('Removed from favorites!', 'info');
        }
    });
    
    // Action buttons functionality
    const bookTrialBtn = document.getElementById('book-trial');
    const getDirectionsBtn = document.getElementById('get-directions');
    const contactGymBtn = document.getElementById('contact-gym');
    
    bookTrialBtn.addEventListener('click', function() {
        // Redirect to payment page
        window.location.href = '../payment/payment.html';
    });
    
    getDirectionsBtn.addEventListener('click', function() {
        // Open Google Maps with directions
        const gymAddress = "123 Fitness Street, Downtown, Tokyo, Japan";
        const mapsUrl = `https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(gymAddress)}`;
        window.open(mapsUrl, '_blank');
    });
    
    contactGymBtn.addEventListener('click', function() {
        showContactModal();
    });
    
    // Join class buttons
    const joinClassBtns = document.querySelectorAll('.join-class-btn');
    joinClassBtns.forEach(btn => {
        btn.addEventListener('click', function() {
            const className = this.closest('.class-item').querySelector('.class-name').textContent;
            showNotification(`Joined ${className} class!`, 'success');
        });
    });
    
    // Membership plan selection
    const selectPlanBtns = document.querySelectorAll('.select-plan-btn');
    selectPlanBtns.forEach(btn => {
        btn.addEventListener('click', function() {
            const planName = this.closest('.plan-card').querySelector('h4').textContent;
            // Store selected plan in localStorage for payment page
            localStorage.setItem('selectedPlan', planName);
            // Redirect to payment page
            window.location.href = '../payment/payment.html';
        });
    });
    
    // Similar gym cards click
    const gymCards = document.querySelectorAll('.gym-card');
    gymCards.forEach(card => {
        card.addEventListener('click', function() {
            const gymName = this.querySelector('h4').textContent;
            // In a real application, this would navigate to the specific gym's detail page
            showNotification(`Loading ${gymName} details...`, 'info');
        });
    });
});

// Initialize image gallery
function initializeImageGallery() {
    const mainImage = document.getElementById('main-gym-image');
    const activeThumbnail = document.querySelector('.thumbnail.active');
    
    if (mainImage && activeThumbnail) {
        mainImage.src = activeThumbnail.src;
        mainImage.alt = activeThumbnail.alt;
    }
}

// Image gallery functionality
function changeMainImage(thumbnail) {
    const mainImage = document.getElementById('main-gym-image');
    const thumbnails = document.querySelectorAll('.thumbnail');
    
    // Remove active class from all thumbnails
    thumbnails.forEach(thumb => thumb.classList.remove('active'));
    
    // Add active class to clicked thumbnail
    thumbnail.classList.add('active');
    
    // Change main image
    mainImage.src = thumbnail.src;
    mainImage.alt = thumbnail.alt;
}

// Notification system
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

// Modal functionality
function showBookingModal() {
    const modal = createModal('Book Free Trial', `
        <form class="booking-form">
            <div class="form-group">
                <label for="booking-name">Full Name</label>
                <input type="text" id="booking-name" name="name" required>
            </div>
            <div class="form-group">
                <label for="booking-email">Email</label>
                <input type="email" id="booking-email" name="email" required>
            </div>
            <div class="form-group">
                <label for="booking-phone">Phone Number</label>
                <input type="tel" id="booking-phone" name="phone" required>
            </div>
            <div class="form-group">
                <label for="booking-date">Preferred Date</label>
                <input type="date" id="booking-date" name="date" required>
            </div>
            <div class="form-group">
                <label for="booking-time">Preferred Time</label>
                <select id="booking-time" name="time" required>
                    <option value="">Select time</option>
                    <option value="09:00">9:00 AM</option>
                    <option value="11:00">11:00 AM</option>
                    <option value="14:00">2:00 PM</option>
                    <option value="16:00">4:00 PM</option>
                    <option value="18:00">6:00 PM</option>
                </select>
            </div>
            <div class="form-actions">
                <button type="submit" class="btn-primary">Book Trial</button>
                <button type="button" class="btn-secondary" onclick="closeModal()">Cancel</button>
            </div>
        </form>
    `);
    
    // Handle form submission
    const form = modal.querySelector('.booking-form');
    form.addEventListener('submit', function(e) {
        e.preventDefault();
        showNotification('Trial booking submitted successfully!', 'success');
        closeModal();
    });
}

function showContactModal() {
    const modal = createModal('Contact SPORT GYM', `
        <div class="contact-info">
            <div class="contact-item">
                <i class="fa-solid fa-phone"></i>
                <div>
                    <strong>Phone</strong>
                    <p>+81 3-1234-5678</p>
                    <button class="btn-small" onclick="window.location.href='tel:+81312345678'">Call Now</button>
                </div>
            </div>
            <div class="contact-item">
                <i class="fa-solid fa-envelope"></i>
                <div>
                    <strong>Email</strong>
                    <p>info@sportgym.jp</p>
                    <button class="btn-small" onclick="window.location.href='mailto:info@sportgym.jp'">Send Email</button>
                </div>
            </div>
            <div class="contact-item">
                <i class="fa-solid fa-globe"></i>
                <div>
                    <strong>Website</strong>
                    <p>www.sportgym.jp</p>
                    <button class="btn-small" onclick="window.open('https://www.sportgym.jp', '_blank')">Visit Website</button>
                </div>
            </div>
            <div class="contact-item">
                <i class="fa-solid fa-location-dot"></i>
                <div>
                    <strong>Address</strong>
                    <p>123 Fitness Street, Downtown, Tokyo, Japan 100-0001</p>
                    <button class="btn-small" onclick="window.open('https://www.google.com/maps/dir/?api=1&destination=123+Fitness+Street,+Downtown,+Tokyo,+Japan', '_blank')">Get Directions</button>
                </div>
            </div>
        </div>
        <div class="modal-actions">
            <button class="btn-secondary" onclick="closeModal()">Close</button>
        </div>
    `);
}

function createModal(title, content) {
    // Remove existing modal
    const existingModal = document.querySelector('.modal-overlay');
    if (existingModal) {
        existingModal.remove();
    }
    
    // Create modal
    const modal = document.createElement('div');
    modal.className = 'modal-overlay';
    modal.innerHTML = `
        <div class="modal-content">
            <div class="modal-header">
                <h3>${title}</h3>
                <button class="modal-close" onclick="closeModal()">
                    <i class="fa-solid fa-xmark"></i>
                </button>
            </div>
            <div class="modal-body">
                ${content}
            </div>
        </div>
    `;
    
    // Add styles
    const styles = `
        <style>
        .modal-overlay {
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: rgba(0, 0, 0, 0.7);
            display: flex;
            align-items: center;
            justify-content: center;
            z-index: 10000;
            animation: fadeIn 0.3s ease;
        }
        
        .modal-content {
            background: white;
            border-radius: 15px;
            width: 90%;
            max-width: 500px;
            max-height: 90vh;
            overflow-y: auto;
            animation: slideIn 0.3s ease;
        }
        
        .modal-header {
            display: flex;
            justify-content: space-between;
            align-items: center;
            padding: 2rem;
            border-bottom: 1px solid #e9ecef;
        }
        
        .modal-header h3 {
            margin: 0;
            color: #1a2e40;
            font-size: 2rem;
        }
        
        .modal-close {
            background: none;
            border: none;
            font-size: 1.8rem;
            cursor: pointer;
            color: #6c757d;
            padding: 0.5rem;
            border-radius: 50%;
            transition: all 0.3s ease;
        }
        
        .modal-close:hover {
            background: #f8f9fa;
            color: #1a2e40;
        }
        
        .modal-body {
            padding: 2rem;
        }
        
        .form-group {
            margin-bottom: 1.5rem;
        }
        
        .form-group label {
            display: block;
            margin-bottom: 0.5rem;
            font-weight: 600;
            color: #1a2e40;
        }
        
        .form-group input,
        .form-group select {
            width: 100%;
            padding: 1rem;
            border: 2px solid #e9ecef;
            border-radius: 8px;
            font-size: 1.4rem;
            transition: border-color 0.3s ease;
        }
        
        .form-group input:focus,
        .form-group select:focus {
            outline: none;
            border-color: #f2c210;
        }
        
        .form-actions {
            display: flex;
            gap: 1rem;
            margin-top: 2rem;
        }
        
        .form-actions button {
            flex: 1;
            padding: 1.2rem;
            border: none;
            border-radius: 8px;
            font-size: 1.4rem;
            font-weight: 600;
            cursor: pointer;
            transition: all 0.3s ease;
        }
        
        .contact-info {
            display: flex;
            flex-direction: column;
            gap: 2rem;
        }
        
        .contact-item {
            display: flex;
            align-items: flex-start;
            gap: 1.5rem;
            padding: 1.5rem;
            background: #f8f9fa;
            border-radius: 12px;
        }
        
        .contact-item i {
            color: #f2c210;
            font-size: 2rem;
            margin-top: 0.5rem;
        }
        
        .contact-item strong {
            display: block;
            color: #1a2e40;
            font-size: 1.4rem;
            margin-bottom: 0.5rem;
        }
        
        .contact-item p {
            margin: 0 0 1rem;
            color: #495057;
            font-size: 1.3rem;
        }
        
        .btn-small {
            padding: 0.5rem 1rem;
            background: #1a2e40;
            color: white;
            border: none;
            border-radius: 6px;
            font-size: 1.2rem;
            cursor: pointer;
            transition: all 0.3s ease;
        }
        
        .btn-small:hover {
            background: #2c4a5e;
        }
        
        .modal-actions {
            text-align: center;
            margin-top: 2rem;
        }
        
        @keyframes fadeIn {
            from { opacity: 0; }
            to { opacity: 1; }
        }
        
        @keyframes slideIn {
            from { transform: scale(0.9) translateY(-20px); opacity: 0; }
            to { transform: scale(1) translateY(0); opacity: 1; }
        }
        
        @keyframes slideInRight {
            from { transform: translateX(100%); }
            to { transform: translateX(0); }
        }
        
        @keyframes slideOutRight {
            from { transform: translateX(0); }
            to { transform: translateX(100%); }
        }
        </style>
    `;
    
    if (!document.querySelector('.modal-styles')) {
        const styleElement = document.createElement('div');
        styleElement.className = 'modal-styles';
        styleElement.innerHTML = styles;
        document.head.appendChild(styleElement);
    }
    
    // Add to page
    document.body.appendChild(modal);
    document.body.style.overflow = 'hidden';
    
    // Close on backdrop click
    modal.addEventListener('click', function(e) {
        if (e.target === modal) {
            closeModal();
        }
    });
    
    return modal;
}

function closeModal() {
    const modal = document.querySelector('.modal-overlay');
    if (modal) {
        modal.remove();
        document.body.style.overflow = 'auto';
    }
}
