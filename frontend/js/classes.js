const API_URL = 'http://localhost:3000/api';

let globalClasses = [];
let allMembers = [];

document.addEventListener('DOMContentLoaded', () => {
    fetchClasses();
    fetchMembersForDropdown();
});

async function fetchClasses() {
    try {
        const res = await fetch(`${API_URL}/classes`);
        const classes = await res.json();
        globalClasses = classes;
        renderClassesTable(classes);
    } catch (err) {
        console.error('Error fetching classes:', err);
    }
}

async function fetchMembersForDropdown() {
    try {
        const res = await fetch(`${API_URL}/members`);
        const members = await res.json();
        allMembers = members;
    } catch (err) {
        console.error('Error fetching members:', err);
    }
}

function renderClassesTable(classes) {
    const tbody = document.getElementById('class-tbody');
    tbody.innerHTML = '';
    
    classes.forEach(c => {
        let date = new Date(c.schedule).toLocaleString();
        
        tbody.innerHTML += `
            <tr>
                <td><strong>${c.class_name}</strong></td>
                <td>${c.trainer_first} ${c.trainer_last} <em>(${c.specialty})</em></td>
                <td>${date}</td>
                <td>${c.duration_min} min</td>
                <td>${c.room}</td>
                <td>Up to ${c.capacity}</td>
                <td>
                    <button class="btn btn-primary" onclick="openBookingModal(${c.class_id})">Book Now</button>
                </td>
            </tr>
        `;
    });
}

function openBookingModal(classId) {
    const c = globalClasses.find(cls => cls.class_id === classId);
    if (!c) return;

    document.getElementById('book_class_id').value = c.class_id;
    document.getElementById('booking-class-name').innerText = c.class_name;
    document.getElementById('booking-class-trainer').innerText = `${c.trainer_first} ${c.trainer_last}`;
    
    // Populate select
    const select = document.getElementById('book_member_id');
    select.innerHTML = '<option value="">Select a member...</option>';
    allMembers.forEach(m => {
        select.innerHTML += `<option value="${m.member_id}">${m.first_name} ${m.last_name}</option>`;
    });

    document.getElementById('bookingModal').style.display = 'block';
}

function closeBookingModal() {
    document.getElementById('bookingModal').style.display = 'none';
}

// Handle Form Submission (Calls the Stored Procedure route!)
document.getElementById('booking-form').addEventListener('submit', async (e) => {
    e.preventDefault();
    
    const data = {
        member_id: document.getElementById('book_member_id').value,
        class_id: document.getElementById('book_class_id').value
    };

    try {
        const res = await fetch(`${API_URL}/bookings`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(data)
        });

        const resultInfo = await res.json();
        
        if (res.ok) {
            // "message" comes directly from MySQL Stored Procedure output
            alert(resultInfo.message); 
            closeBookingModal();
        } else {
            alert('Failed to book class.');
        }
    } catch (err) {
        console.error('Error:', err);
    }
});