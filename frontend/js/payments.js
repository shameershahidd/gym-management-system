const API_URL = 'http://localhost:3000/api';

document.addEventListener('DOMContentLoaded', fetchPayments);

async function fetchPayments() {
    if (getUserRole() === 'viewer') {
        const tbody = document.getElementById('payment-tbody');
        tbody.innerHTML = `<tr><td colspan="4" style="color:red; text-align:center;">RESTRICTED: Viewers cannot access financial data.</td></tr>`;
        return;
    }

    try {
        const res = await checkAuthAndFetch(`${API_URL}/payments`);
        if (res.status === 401) return;
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
