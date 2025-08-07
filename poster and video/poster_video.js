// Poster & Video Gallery JavaScript

document.addEventListener('DOMContentLoaded', function() {
    // Initialize gallery functionality
    initializeGallery();
    
    // Initialize modal functionality
    initializeModal();
    
    // Check URL parameters for direct tab access
    checkURLParameters();
});

// Initialize gallery functionality
function initializeGallery() {
    // Set default active tab based on URL or default to video
    const urlParams = new URLSearchParams(window.location.search);
    const activeTab = urlParams.get('tab') || 'video';
    switchTab(activeTab);
}

// Switch between poster and video tabs
function switchTab(tabName) {
    // Remove active class from all tabs and content
    const tabBtns = document.querySelectorAll('.tab-btn');
    const galleryContents = document.querySelectorAll('.gallery-content');
    const dropdownItems = document.querySelectorAll('#right_icon .dropList');
    
    tabBtns.forEach(btn => btn.classList.remove('active'));
    galleryContents.forEach(content => content.classList.remove('active'));
    dropdownItems.forEach(item => item.classList.remove('active'));
    
    // Add active class to selected tab and content
    const activeTabBtn = document.querySelector(`[data-tab="${tabName}"]`);
    const activeContent = document.getElementById(`${tabName}-content`);
    
    if (activeTabBtn) activeTabBtn.classList.add('active');
    if (activeContent) activeContent.classList.add('active');
    
    // Update dropdown active state
    dropdownItems.forEach(item => {
        if ((tabName === 'video' && item.textContent.trim() === 'Video') ||
            (tabName === 'poster' && item.textContent.trim() === 'Poster')) {
            item.classList.add('active');
        }
    });
    
    // Update URL parameter
    const url = new URL(window.location);
    url.searchParams.set('tab', tabName);
    window.history.replaceState({}, '', url);
    
    // Update header dropdown active state
    updateHeaderDropdown(tabName);
}

// Update header dropdown active state
function updateHeaderDropdown(tabName) {
    const dropdownItems = document.querySelectorAll('#right_icon .dropList');
    dropdownItems.forEach(item => {
        item.classList.remove('active');
        if ((tabName === 'video' && item.textContent.trim() === 'Video') ||
            (tabName === 'poster' && item.textContent.trim() === 'Poster')) {
            item.classList.add('active');
        }
    });
}

// Check URL parameters for direct access
function checkURLParameters() {
    const urlParams = new URLSearchParams(window.location.search);
    const tab = urlParams.get('tab');
    
    if (tab && (tab === 'poster' || tab === 'video')) {
        switchTab(tab);
    }
}

// Initialize modal functionality
function initializeModal() {
    // Close modal on escape key
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape') {
            closePosterModal();
        }
    });
}

// Open poster modal
function openPosterModal(imageSrc, title) {
    const modal = document.getElementById('poster-modal');
    const modalImage = document.getElementById('modal-image');
    const modalTitle = document.getElementById('modal-title');
    
    modalImage.src = imageSrc;
    modalImage.alt = title;
    modalTitle.textContent = title;
    
    // Store current image for download
    modal.dataset.currentImage = imageSrc;
    modal.dataset.currentTitle = title;
    
    modal.classList.add('active');
    document.body.style.overflow = 'hidden';
    
    // Add loading state
    modalImage.addEventListener('load', function() {
        this.style.opacity = '1';
    });
    
    modalImage.style.opacity = '0';
}

// Close poster modal
function closePosterModal() {
    const modal = document.getElementById('poster-modal');
    modal.classList.remove('active');
    document.body.style.overflow = 'auto';
}

// Download poster function
function downloadPoster(imageSrc, event) {
    if (event) {
        event.stopPropagation(); // Prevent modal from opening
    }
    
    // Create download link
    const link = document.createElement('a');
    link.href = imageSrc;
    link.download = `GIGACHAD-Poster-${Date.now()}.jpg`;
    link.style.display = 'none';
    
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    
    // Show notification
    showNotification('Poster download started!', 'success');
}

// Download current poster from modal
function downloadCurrentPoster() {
    const modal = document.getElementById('poster-modal');
    const imageSrc = modal.dataset.currentImage;
    const title = modal.dataset.currentTitle;
    
    if (imageSrc) {
        downloadPoster(imageSrc);
        closePosterModal();
    }
}

// Share poster function
function sharePoster() {
    const modal = document.getElementById('poster-modal');
    const title = modal.dataset.currentTitle;
    const url = window.location.href;
    
    if (navigator.share) {
        navigator.share({
            title: `GIGACHAD - ${title}`,
            text: `Check out this poster from GIGACHAD: ${title}`,
            url: url
        }).then(() => {
            showNotification('Poster shared successfully!', 'success');
        }).catch((error) => {
            fallbackShare(title, url);
        });
    } else {
        fallbackShare(title, url);
    }
}

// Fallback share function
function fallbackShare(title, url) {
    // Copy URL to clipboard
    navigator.clipboard.writeText(url).then(() => {
        showNotification('Link copied to clipboard!', 'info');
    }).catch(() => {
        // Show share modal with social media options
        showShareModal(title, url);
    });
}

// Show share modal
function showShareModal(title, url) {
    const shareModal = document.createElement('div');
    shareModal.className = 'share-modal-overlay';
    shareModal.innerHTML = `
        <div class="share-modal-content">
            <div class="share-header">
                <h3>Share Poster</h3>
                <button class="share-close" onclick="closeShareModal()">
                    <i class="fa-solid fa-xmark"></i>
                </button>
            </div>
            <div class="share-body">
                <p>Share this poster with your friends:</p>
                <div class="share-options">
                    <button class="share-btn facebook" onclick="shareToFacebook('${url}')">
                        <i class="fa-brands fa-facebook-f"></i>
                        Facebook
                    </button>
                    <button class="share-btn twitter" onclick="shareToTwitter('${title}', '${url}')">
                        <i class="fa-brands fa-twitter"></i>
                        Twitter
                    </button>
                    <button class="share-btn linkedin" onclick="shareToLinkedIn('${url}')">
                        <i class="fa-brands fa-linkedin-in"></i>
                        LinkedIn
                    </button>
                    <button class="share-btn copy" onclick="copyToClipboard('${url}')">
                        <i class="fa-solid fa-copy"></i>
                        Copy Link
                    </button>
                </div>
            </div>
        </div>
    `;
    
    // Add styles
    const shareStyles = `
        <style>
        .share-modal-overlay {
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: rgba(0, 0, 0, 0.7);
            display: flex;
            align-items: center;
            justify-content: center;
            z-index: 10001;
        }
        
        .share-modal-content {
            background: white;
            border-radius: 15px;
            width: 90%;
            max-width: 400px;
            overflow: hidden;
        }
        
        .share-header {
            padding: 2rem;
            background: #1a2e40;
            color: white;
            display: flex;
            justify-content: space-between;
            align-items: center;
        }
        
        .share-header h3 {
            margin: 0;
            font-size: 1.8rem;
        }
        
        .share-close {
            background: none;
            border: none;
            color: white;
            font-size: 1.8rem;
            cursor: pointer;
            padding: 0.5rem;
            border-radius: 50%;
        }
        
        .share-close:hover {
            background: rgba(255, 255, 255, 0.1);
        }
        
        .share-body {
            padding: 2rem;
        }
        
        .share-body p {
            margin-bottom: 1.5rem;
            color: #6c757d;
            text-align: center;
        }
        
        .share-options {
            display: grid;
            grid-template-columns: 1fr 1fr;
            gap: 1rem;
        }
        
        .share-btn {
            padding: 1.2rem;
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
        
        .share-btn.facebook {
            background: #1877f2;
            color: white;
        }
        
        .share-btn.twitter {
            background: #1da1f2;
            color: white;
        }
        
        .share-btn.linkedin {
            background: #0077b5;
            color: white;
        }
        
        .share-btn.copy {
            background: #f8f9fa;
            color: #1a2e40;
            border: 2px solid #e9ecef;
        }
        
        .share-btn:hover {
            transform: translateY(-2px);
            box-shadow: 0 5px 15px rgba(0, 0, 0, 0.2);
        }
        </style>
    `;
    
    if (!document.querySelector('.share-modal-styles')) {
        const styleElement = document.createElement('div');
        styleElement.className = 'share-modal-styles';
        styleElement.innerHTML = shareStyles;
        document.head.appendChild(styleElement);
    }
    
    document.body.appendChild(shareModal);
}

// Close share modal
function closeShareModal() {
    const modal = document.querySelector('.share-modal-overlay');
    if (modal) {
        modal.remove();
    }
}

// Social media share functions
function shareToFacebook(url) {
    window.open(`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`, '_blank');
    closeShareModal();
}

function shareToTwitter(title, url) {
    window.open(`https://twitter.com/intent/tweet?text=${encodeURIComponent(`Check out this poster from GIGACHAD: ${title}`)}&url=${encodeURIComponent(url)}`, '_blank');
    closeShareModal();
}

function shareToLinkedIn(url) {
    window.open(`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(url)}`, '_blank');
    closeShareModal();
}

function copyToClipboard(url) {
    navigator.clipboard.writeText(url).then(() => {
        showNotification('Link copied to clipboard!', 'success');
        closeShareModal();
    }).catch(() => {
        showNotification('Failed to copy link', 'error');
    });
}

// Sample video placeholder interactions
document.addEventListener('click', function(e) {
    if (e.target.closest('.sample-video')) {
        const videoItem = e.target.closest('.sample-video');
        const title = videoItem.querySelector('h3').textContent;
        showNotification(`${title} video would play here`, 'info');
    }
});

// Notification system
function showNotification(message, type = 'info') {
    const existingNotification = document.querySelector('.notification');
    if (existingNotification) {
        existingNotification.remove();
    }
    
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
    
    document.body.appendChild(notification);
    
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

// Add notification animations
const notificationStyles = `
    <style>
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

if (!document.querySelector('.notification-styles')) {
    const styleElement = document.createElement('div');
    styleElement.className = 'notification-styles';
    styleElement.innerHTML = notificationStyles;
    document.head.appendChild(styleElement);
}
