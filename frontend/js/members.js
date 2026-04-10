const API_URL = 'http://localhost:3000/api';

let globalMembers = [];

// Load Members on Load
document.addEventListener('DOMContentLoaded', fetchMembers);

async function fetchMembers() {
    try {
        const res = await fetch(`${API_URL}/members`);
        const members = await res.json();
        globalMembers = members;
        renderMembersTable(members);
    } catch (err) {
        console.error('Error fetching members:', err);
    }
}

function renderMembersTable(members) {
    const tbody = document.getElementById('member-tbody');
    tbody.innerHTML = '';
    
    members.forEach(member => {
        let date = new Date(member.join_date).toLocaleDateString();
        let name = `${member.first_name} ${member.last_name}`;
        
        tbody.innerHTML += `
            <tr>
                <td>${member.member_id}</td>
                <td>${name}</td>
                <td>${member.email}</td>
                <td>${member.phone}</td>
                <td>${date}</td>
                <td>${member.membership_type || 'No Membership'}</td>
                <td>
                    <button class="btn btn-secondary" onclick="editMember(${member.member_id})">Edit</button>
                    <button class="btn btn-danger" onclick="deleteMember(${member.member_id})">Delete</button>
                </td>
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
    
    const id = document.getElementById('member_id').value;
    const method = id ? 'PUT' : 'POST';
    const url = id ? `${API_URL}/members/${id}` : `${API_URL}/members`;

    const data = {
        first_name: document.getElementById('first_name').value,
        last_name: document.getElementById('last_name').value,
        email: document.getElementById('email').value,
        phone: document.getElementById('phone').value,
        join_date: new Date().toISOString().split('T')[0] // For new members
    };

    try {
        const res = await fetch(url, {
            method,
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(data)
        });

        if (res.ok) {
            closeMemberModal();
            fetchMembers(); // Refresh
        } else {
            alert('Failed to save member. Make sure email is unique.');
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
    
    document.getElementById('memberModal').style.display = 'block';
}

// Delete Member
async function deleteMember(id) {
    if (!confirm('Are you sure you want to delete this member? All their bookings and memberships will be deleted and this cannot be undone.')) return;

    try {
        const res = await fetch(`${API_URL}/members/${id}`, { method: 'DELETE' });
        if (res.ok) {
            fetchMembers(); // Refresh List
        }
    } catch (err) {
        console.error('Delete error:', err);
    }
}

// Search Filter (Extra Credit logic)
document.getElementById('search-input').addEventListener('keyup', (e) => {
    const term = e.target.value.toLowerCase();
    const filtered = globalMembers.filter(m => {
        const fullName = `${m.first_name} ${m.last_name}`.toLowerCase();
        const email = m.email.toLowerCase();
        return fullName.includes(term) || email.includes(term);
    });
    renderMembersTable(filtered);
});