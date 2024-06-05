document.addEventListener('DOMContentLoaded', () => {
    const editButton = document.getElementById('edit-button');
    const saveButton = document.getElementById('save-button');
    const editForm = document.getElementById('edit-form');
    const username = document.getElementById('username');
    const newUsernameInput = document.getElementById('new-username');
    const profilePicUpload = document.getElementById('profile-pic-upload');
    const profilePic = document.getElementById('profile-pic');
    const editBioButton = document.getElementById('edit-bio-button');
    const saveBioButton = document.getElementById('save-bio-button');
    const editBioForm = document.getElementById('edit-bio-form');
    const bio = document.getElementById('bio');
    const newBioInput = document.getElementById('new-bio');

    editButton.addEventListener('click', () => {
        editForm.style.display = 'block';
    });

    saveButton.addEventListener('click', async () => {
        const newUsername = newUsernameInput.value;
        if (newUsername) {
            const response = await fetch('/update-username', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ username: newUsername })
            });
            if (response.ok) {
                username.textContent = newUsername;
                editForm.style.display = 'none';
            }
        }
    });

    profilePicUpload.addEventListener('change', async () => {
        const file = profilePicUpload.files[0];
        const formData = new FormData();
        formData.append('profilePic', file);

        const response = await fetch('/upload-profile-pic', {
            method: 'POST',
            body: formData
        });

        if (response.ok) {
            const data = await response.json();
            profilePic.src = data.profilePicUrl;
        }
    });

    editBioButton.addEventListener('click', () => {
        editBioForm.style.display = 'block';
    });

    saveBioButton.addEventListener('click', async () => {
        const newBio = newBioInput.value;
        if (newBio) {
            const response = await fetch('/update-bio', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ bio: newBio })
            });
            if (response.ok) {
                bio.textContent = newBio;
                editBioForm.style.display = 'none';
            }
        }
    });

    // Fetch user data on page load
    async function fetchUserData() {
        const response = await fetch('/get-user-data');
        if (response.ok) {
            const data = await response.json();
            username.textContent = data.username;
            bio.textContent = data.bio || 'This is your bio';
            if (data.profilePicUrl) {
                profilePic.src = data.profilePicUrl;
            }
        }
    }

    fetchUserData();
});
