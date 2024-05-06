// Function to fetch and display team members
function fetchTeamMembers() {
    fetch('http://localhost:8000/server.php')
        .then(response => {
            if (!response.ok) {
                throw new Error('Failed to fetch team members');
            }
            return response.json();
        })
        .then(data => {
            const teamMembersContainer = document.getElementById('teamMembers');
            teamMembersContainer.innerHTML = ''; // Clear previous content

            if (data.length === 0) {
                teamMembersContainer.innerHTML = '<p>No team members available</p>';
                return;
            }

            data.forEach(member => {
                const memberElement = document.createElement('div');
                memberElement.classList.add('col-md-4', 'mb-4');
                memberElement.innerHTML = `
                    <div class="card">
                        <div class="card-body">
                            <p class="card-text">Name: ${member.name}</p>
                            <p class="card-text">ID: ${member.id}</p>
                            <p class="card-text">Age: ${member.age}</p>
                            <p class="card-text">CGPA: ${member.cgpa}</p>
                            <button class="btn btn-primary view-details-btn" data-id="${member.id}">View Details</button>
                            <button class="btn btn-info edit-member-btn" data-id="${member.id}" data-toggle="modal" data-target="#editMemberModal">Edit</button>
                            <button class="btn btn-danger delete-member-btn" data-id="${member.id}">Delete</button>
                        </div>
                    </div>
                `;
                teamMembersContainer.appendChild(memberElement);
            });

            // Attach event listener to view details button
            document.querySelectorAll('.view-details-btn').forEach(button => {
                button.addEventListener('click', viewMemberDetails);
            });

            // Attach event listener to edit member button
            document.querySelectorAll('.edit-member-btn').forEach(button => {
                button.addEventListener('click', editMember);
            });

            // Attach event listener to delete member button
            document.querySelectorAll('.delete-member-btn').forEach(button => {
                button.addEventListener('click', deleteMember);
            });
        })
        .catch(error => {
            console.error('Error fetching team members:', error);
            alert('Failed to fetch team members');
        });
}

// Function to fetch and display individual member details
function viewMemberDetails(event) {
    const memberId = event.target.dataset.id;

    fetch(`http://localhost:8000/server.php?memberId=${memberId}`)
        .then(response => response.json())
        .then(member => {
            // Display member details on the page
            alert(`Name: ${member.name}\nAge: ${member.age}\nCGPA: ${member.cgpa}`);
        })
        .catch(error => {
            console.error('Error fetching member details:', error);
            alert('Failed to fetch member details');
        });
}

// Function to populate edit form with member details
function editMember(event) {
    const memberId = event.target.dataset.id;

    fetch(`http://localhost:8000/server.php?memberId=${memberId}`)
        .then(response => response.json())
        .then(member => {
            // Populate edit form fields with member details
            document.getElementById('editId').value = member.id;
            document.getElementById('editName').value = member.name;
            document.getElementById('editAge').value = member.age;
            document.getElementById('editCgpa').value = member.cgpa;
        })
        .catch(error => {
            console.error('Error fetching member details for editing:', error);
            alert('Failed to fetch member details for editing');
        });
}

// Function to edit a member
function saveChanges(event) {
    event.preventDefault();

    const id = document.getElementById('editId').value;
    const name = document.getElementById('editName').value;
    const age = document.getElementById('editAge').value;
    const cgpa = document.getElementById('editCgpa').value;

    fetch('http://localhost:8000/server.php', {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded'
        },
        body: `id=${id}&name=${name}&age=${age}&cgpa=${cgpa}`
    })
    .then(response => {
        if (response.ok) {
            // Member edited successfully
            alert('Member details updated successfully');
            $('#editMemberModal').modal('hide'); // Hide modal
            fetchTeamMembers(); // Refresh the list of team members
        } else {
            // Failed to edit member
            alert('Failed to update member details. Please try again.');
        }
    })
    .catch(error => {
        console.error('Error updating member details:', error);
        alert('Failed to update member details. Please try again.');
    });
}

// Function to delete a member
function deleteMember(event) {
    const memberId = event.target.dataset.id;

    if (confirm('Are you sure you want to delete this member?')) {
        fetch('http://localhost:8000/server.php', {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded'
            },
            body: `id=${memberId}`
        })
        .then(response => {
            if (response.ok) {
                // Member deleted successfully
                alert('Member deleted successfully');
                fetchTeamMembers(); // Refresh the list of team members
            } else {
                // Failed to delete member
                alert('Failed to delete member. Please try again.');
            }
        })
        .catch(error => {
            console.error('Error deleting member:', error);
            alert('Failed to delete member. Please try again.');
        });
    }
}

// Function to add a new team member
function addMember(event) {
    event.preventDefault();

    const id = document.getElementById('id').value;
    const name = document.getElementById('name').value;
    const age = document.getElementById('age').value;
    const cgpa = document.getElementById('cgpa').value;

    fetch('http://localhost:8000/server.php', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ id, name, age, cgpa })
    })
    .then(response => {
        if (response.ok) {
            // Member added successfully
            alert('Member added successfully');
            $('#addMemberModal').modal('hide'); // Hide modal
            fetchTeamMembers(); // Refresh the list of team members
        } else {
            // Failed to add member
            alert('Failed to add member. Please try again.');
        }
    })
    .catch(error => {
        console.error('Error adding member:', error);
        alert('Failed to add member. Please try again.');
    });
}

// Attach event listener to the form submit event for adding a member
document.getElementById('addMemberForm').addEventListener('submit', addMember);

// Attach event listener to the edit form submit button
document.getElementById('editMemberForm').addEventListener('submit', saveChanges);

// Fetch and display team members when the page loads
fetchTeamMembers();
