// Modern notification system to replace alerts
function showNotification(message, type = 'info') {
    // Remove any existing notifications
    const existing = document.querySelector('.notification-toast');
    if (existing) {
        existing.remove();
    }

    // Create notification element
    const notification = document.createElement('div');
    notification.className = `notification-toast notification-${type}`;

    // Icon based on type
    const icons = {
        success: '✓',
        error: '✕',
        warning: '⚠',
        info: 'ℹ'
    };

    notification.innerHTML = `
        <span class="notification-icon">${icons[type] || icons.info}</span>
        <span class="notification-message">${message}</span>
    `;

    document.body.appendChild(notification);

    // Trigger animation
    setTimeout(() => notification.classList.add('show'), 10);

    // Auto-remove after 4 seconds
    setTimeout(() => {
        notification.classList.remove('show');
        setTimeout(() => notification.remove(), 300);
    }, 4000);
}

// Confirmation dialog to replace window.confirm
function showConfirmDialog(message, onConfirm, onCancel) {
    // Create overlay
    const overlay = document.createElement('div');
    overlay.className = 'confirm-overlay';

    // Create dialog
    const dialog = document.createElement('div');
    dialog.className = 'confirm-dialog';
    dialog.innerHTML = `
        <div class="confirm-header">
            <span class="confirm-icon">⚠</span>
            <h3>Confirm Action</h3>
        </div>
        <div class="confirm-body">
            <p>${message}</p>
        </div>
        <div class="confirm-footer">
            <button class="btn-cancel">Cancel</button>
            <button class="btn-confirm">Confirm</button>
        </div>
    `;

    overlay.appendChild(dialog);
    document.body.appendChild(overlay);

    // Trigger animation
    setTimeout(() => {
        overlay.classList.add('show');
        dialog.classList.add('show');
    }, 10);

    // Handle buttons
    const btnCancel = dialog.querySelector('.btn-cancel');
    const btnConfirm = dialog.querySelector('.btn-confirm');

    const closeDialog = () => {
        overlay.classList.remove('show');
        dialog.classList.remove('show');
        setTimeout(() => overlay.remove(), 300);
    };

    btnCancel.addEventListener('click', () => {
        closeDialog();
        if (onCancel) onCancel();
    });

    btnConfirm.addEventListener('click', () => {
        closeDialog();
        if (onConfirm) onConfirm();
    });

    // Close on overlay click
    overlay.addEventListener('click', (e) => {
        if (e.target === overlay) {
            closeDialog();
            if (onCancel) onCancel();
        }
    });
}

// Loading spinner
function showLoading(container, message = 'Loading...') {
    const loader = document.createElement('div');
    loader.className = 'loading-spinner';
    loader.innerHTML = `
        <div class="spinner"></div>
        <p>${message}</p>
    `;
    container.innerHTML = '';
    container.appendChild(loader);
}
