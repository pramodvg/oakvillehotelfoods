// Display Page Logic — listens to Firebase and renders order numbers

(function () {
    const ordersRef = database.ref('orders');
    const grid = document.getElementById('orderGrid');

    ordersRef.orderByChild('timestamp').on('value', (snapshot) => {
        grid.innerHTML = '';

        if (!snapshot.exists()) {
            grid.innerHTML = `
        <div class="empty-state" style="grid-column: 1 / -1;">
          <div class="empty-state-icon">🍽️</div>
          <p>No orders ready yet</p>
        </div>
      `;
            return;
        }

        const orders = [];
        snapshot.forEach((child) => {
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
    });

    // Simple HTML escape to prevent XSS
    function escapeHtml(text) {
        const div = document.createElement('div');
        div.textContent = text;
        return div.innerHTML;
    }
})();
