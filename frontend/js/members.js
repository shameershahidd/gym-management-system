const API_URL = 'http://localhost:3000/api';

let globalMembers = [];

// Load Members on Load
document.addEventListener('DOMContentLoaded', fetchMembers);

async function fetchMembers() {
    try {
        const res = await checkAuthAndFetch(`${API_URL}/members`);
        if (res.status === 401) return; // handled by authUtils
        const members = await res.json();
        globalMembers = members;
        renderMembersTable(members);
        
        // Hide entire Add Member button if viewing as a 'viewer'
        if (getUserRole() === 'viewer') {
            document.querySelector('.btn-primary').style.display = 'none';
        }
    } catch (err) {
        console.error('Error fetching members:', err);
    }
}

function renderMembersTable(members) {
    const tbody = document.getElementById('member-tbody');
    tbody.innerHTML = '';
    
    // Hide actions column entirely for viewers
    const isViewer = getUserRole() === 'viewer';
    const isAdmin = getUserRole() === 'admin';
    
    members.forEach(member => {
        let date = new Date(member.join_date).toLocaleDateString();
        let name = `${member.first_name} ${member.last_name}`;
        
        let actionsHtml = '';
        if (!isViewer) {
            actionsHtml = `<button class="btn btn-secondary" onclick="editMember(${member.member_id})">Edit</button>`;
            if (isAdmin) {
                actionsHtml += ` <button class="btn btn-danger" onclick="deleteMember(${member.member_id})">Delete</button>`;
            }
        } else {
            actionsHtml = `<em>Read-Only</em>`;
        }
        
        tbody.innerHTML += `
            <tr>
                <td>${member.member_id}</td>
                <td>${name}</td>
                <td>${member.email}</td>
                <td>${member.phone}</td>
                <td>${date}</td>
                <td>${member.membership_type || 'No Membership'}</td>
                <td>${actionsHtml}</td>
            </tr>
        `;
    });
}

// Modal Functions
function openMemberModal() {
    document.getElementById('modal-title').innerText = 'Add New Member';
    document.getElementById('member-form').reset();
    document.getElementById('member_id').value = '';
    document.getElementById('memberModal').style.display = 'block';
}

function closeMemberModal() {
    document.getElementById('memberModal').style.display = 'none';
}

// Save Member (Add or Update)
document.getElementById('member-form').addEventListener('submit', async (e) => {
    e.preventDefault();
    
    // Front-end validation
    const phoneInput = document.getElementById('phone').value;
    if (phoneInput.length < 7) {
        alert("Please enter a valid phone number (at least 7 characters).");
        return;
    }
    
    const emailInput = document.getElementById('email').value;
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailPattern.test(emailInput)) {
        alert("Please enter a valid email format.");
        return;
    }
    
    const id = document.getElementById('member_id').value;
    const method = id ? 'PUT' : 'POST';
    const url = id ? `${API_URL}/members/${id}` : `${API_URL}/members`;

    const data = {
        first_name: document.getElementById('first_name').value,
        last_name: document.getElementById('last_name').value,
        email: emailInput,
        phone: phoneInput,
        membership_type: document.getElementById('membership_type').value,
        join_date: new Date().toISOString().split('T')[0] // For new members
    };

    try {
        const res = await checkAuthAndFetch(url, {
            method,
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(data)
        });

        if (res.ok) {
            closeMemberModal();
            fetchMembers(); // Refresh
        } else {
            const errBody = await res.json();
            alert(`Failed: ${errBody.message || 'Check database constraints.'}`);
        }
    } catch (err) {
        console.error('Error:', err);
    }
});

// Edit Member
function editMember(id) {
    const member = globalMembers.find(m => m.member_id === id);
    if (!member) return;

    document.getElementById('modal-title').innerText = 'Edit Member';
    document.getElementById('member_id').value = member.member_id;
    document.getElementById('first_name').value = member.first_name;
    document.getElementById('last_name').value = member.last_name;
    document.getElementById('email').value = member.email;
    document.getElementById('phone').value = member.phone;
    if (member.membership_type) {
        document.getElementById('membership_type').value = member.membership_type;
    } else {
        document.getElementById('membership_type').value = "Basic";
    }
    
    document.getElementById('memberModal').style.display = 'block';
}

// Delete Member
async function deleteMember(id) {
    if (!confirm('Are you sure you want to delete this member? All their bookings and memberships will be deleted and this cannot be undone.')) return;

    try {
        const res = await checkAuthAndFetch(`${API_URL}/members/${id}`, { method: 'DELETE' });
        if (res.ok) {
            fetchMembers(); // Refresh List
        } else {
            const errInfo = await res.json();
            alert(`Error: ${errInfo.message}`);
        }
    } catch (err) {
        console.error('Delete error:', err);
    }
}

// Search Filter 
document.getElementById('search-input').addEventListener('keyup', (e) => {
    const term = e.target.value.toLowerCase();
    const filtered = globalMembers.filter(m => {
        const fullName = `${m.first_name} ${m.last_name}`.toLowerCase();
        const email = m.email.toLowerCase();
        return fullName.includes(term) || email.includes(term);
    });
    renderMembersTable(filtered);
});