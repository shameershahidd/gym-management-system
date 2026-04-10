const API_URL = 'http://localhost:3000/api';

document.addEventListener('DOMContentLoaded', fetchPayments);

async function fetchPayments() {
    try {
        const res = await fetch(`${API_URL}/payments`);
        const payments = await res.json();
        renderPaymentsTable(payments);
    } catch (err) {
        console.error('Error fetching payments:', err);
    }
}

function renderPaymentsTable(payments) {
    const tbody = document.getElementById('payment-tbody');
    tbody.innerHTML = '';
    
    payments.forEach(p => {
        tbody.innerHTML += `
            <tr>
                <td><strong>${p.month}</strong></td>
                <td>${p.method}</td>
                <td>${p.total_transactions}</td>
                <td style="color: var(--success-color); font-weight: bold;">$${parseFloat(p.total_revenue).toFixed(2)}</td>
            </tr>
        `;
    });
}
