// Display Page Logic — listens to Firebase and renders order numbers

(function () {
    const ordersRef = database.ref('orders');
    const grid = document.getElementById('orderGrid');
    const header = document.querySelector('.display-header');

    ordersRef.orderByChild('timestamp').on('value', (snapshot) => {
        grid.innerHTML = '';

        if (!snapshot.exists()) {
            // Activate screensaver
            header.style.display = 'none';
            grid.style.display = 'none';
            document.body.classList.add('screensaver-active');
            return;
        }

        // Deactivate screensaver
        header.style.display = 'block';
        grid.style.display = 'grid';
        document.body.classList.remove('screensaver-active');

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
