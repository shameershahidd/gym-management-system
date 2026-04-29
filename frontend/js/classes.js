const API_URL = 'http://localhost:3000/api';

let globalClasses = [];
let allMembers = [];

document.addEventListener('DOMContentLoaded', () => {
    fetchClasses();
    fetchMembersForDropdown();
});

async function fetchClasses() {
    try {
        const res = await checkAuthAndFetch(`${API_URL}/classes`);
        if (res.status === 401) return;
        const classes = await res.json();
        globalClasses = classes;
        renderClassesTable(classes);
    } catch (err) {
        console.error('Error fetching classes:', err);
    }
}

async function fetchMembersForDropdown() {
    // Only fetch if admin or staff, viewers can't book
    if (getUserRole() === 'viewer') return; 

    try {
        const res = await checkAuthAndFetch(`${API_URL}/members`);
        if (res.ok) {
            const members = await res.json();
            allMembers = members;
        }
    } catch (err) {
        console.error('Error fetching members:', err);
    }
}

function renderClassesTable(classes) {
    const tbody = document.getElementById('class-tbody');
    tbody.innerHTML = '';
    
    classes.forEach(c => {
        let date = new Date(c.schedule).toLocaleString();
        
        let actionBtn = '';
        if (getUserRole() !== 'viewer') {
            actionBtn = `
                <button class="btn btn-primary" onclick="openBookingModal(${c.class_id})">Book Now</button>
                <button class="btn btn-secondary" onclick="viewAttendees(${c.class_id}, '${c.class_name}')" style="margin-left: 5px;">Attendees</button>
            `;
        } else {
            actionBtn = `<em style="color:#7f8c8d;">Read-Only</em>`;
        }

        tbody.innerHTML += `
            <tr>
                <td><strong>${c.class_name}</strong></td>
                <td>${c.trainer_first} ${c.trainer_last} <em>(${c.specialty})</em></td>
                <td>${date}</td>
                <td>${c.duration_min} min</td>
                <td>${c.room}</td>
                <td>Up to ${c.capacity}</td>
                <td>${actionBtn}</td>
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

async function viewAttendees(classId, className) {
    document.getElementById('attendees-class-name').innerText = className;
    const tbody = document.getElementById('attendees-tbody');
    tbody.innerHTML = '<tr><td colspan="4">Loading...</td></tr>';
    
    document.getElementById('attendeesModal').style.display = 'block';

    try {
        const res = await checkAuthAndFetch(`${API_URL}/classes/${classId}/bookings`);
        if (res.ok) {
            const attendees = await res.json();
            tbody.innerHTML = '';
            
            if (attendees.length === 0) {
                tbody.innerHTML = '<tr><td colspan="4" style="text-align: center;">No members booked yet.</td></tr>';
                return;
            }

            attendees.forEach(a => {
                let statusColor = a.status === 'Confirmed' ? 'green' : 'orange';
                tbody.innerHTML += `
                    <tr>
                        <td>#${a.member_id}</td>
                        <td>${a.first_name} ${a.last_name}</td>
                        <td>${a.email}</td>
                        <td style="color: ${statusColor}; font-weight: bold;">${a.status}</td>
                    </tr>
                `;
            });
        }
    } catch (err) {
        console.error('Error fetching attendees:', err);
        tbody.innerHTML = '<tr><td colspan="4" style="color: red;">Error loading attendees.</td></tr>';
    }
}

function closeAttendeesModal() {
    document.getElementById('attendeesModal').style.display = 'none';
}

// Handle Form Submission (Calls the Stored Procedure route!)
document.getElementById('booking-form').addEventListener('submit', async (e) => {
    e.preventDefault();
    
    const data = {
        member_id: document.getElementById('book_member_id').value,
        class_id: document.getElementById('book_class_id').value
    };

    try {
        const res = await checkAuthAndFetch(`${API_URL}/bookings`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(data)
        });

        const resultInfo = await res.json();
        
        if (res.ok) {
            alert(resultInfo.message); 
            closeBookingModal();
        } else {
            alert(`Failed: ${resultInfo.message || 'Server error'}`);
        }
    } catch (err) {
        console.error('Error:', err);
    }
});