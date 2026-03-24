// Display Page Logic — listens to Firebase and renders order numbers

(function () {
    const ordersRef = database.ref('orders');
    const settingsRef = database.ref('settings/forceOrderPage');
    const grid = document.getElementById('orderGrid');
    const header = document.querySelector('.display-header');

    let forceOrderPage = false;
    let currentOrdersSnapshot = null;

    settingsRef.on('value', (snap) => {
        forceOrderPage = snap.val() || false;
        renderDisplay();
    });

    ordersRef.orderByChild('timestamp').on('value', (snapshot) => {
        currentOrdersSnapshot = snapshot;
        renderDisplay();
    });

    function renderDisplay() {
        grid.innerHTML = '';

        if (!currentOrdersSnapshot || !currentOrdersSnapshot.exists()) {
            if (forceOrderPage) {
                // Show empty state text
                header.style.display = 'block';
                grid.style.display = 'grid';
                document.body.classList.remove('screensaver-active');
                grid.innerHTML = `
          <div class="empty-state" style="grid-column: 1 / -1;">
            <div class="empty-state-icon">🍽️</div>
            <p>No orders ready yet</p>
          </div>
        `;
            } else {
                // Activate screensaver
                header.style.display = 'none';
                grid.style.display = 'none';
                document.body.classList.add('screensaver-active');
            }
            return;
        }

        // Deactivate screensaver
        header.style.display = 'block';
        grid.style.display = 'grid';
        document.body.classList.remove('screensaver-active');

        const orders = [];
        currentOrdersSnapshot.forEach((child) => {
            orders.push({ key: child.key, ...child.val() });
        });

        // Sort by timestamp ascending (oldest first)
        orders.sort((a, b) => a.timestamp - b.timestamp);

        orders.forEach((order) => {
            const card = document.createElement('div');
            card.className = 'order-card';
            card.innerHTML = `<span class="order-number">${escapeHtml(String(order.number))}</span>`;
            grid.appendChild(card);
        });
    }

    // Simple HTML escape to prevent XSS
    function escapeHtml(text) {
        const div = document.createElement('div');
        div.textContent = text;
        return div.innerHTML;
    }
})();
