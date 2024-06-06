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

    // Edit username functionality
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

    // Upload profile picture functionality
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

    // Edit bio functionality
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

    // Fetch and display user posts on page load
    fetchUserPosts();
});

// Fetch and display user posts
async function fetchUserPosts() {
    const response = await fetch('/get-user-posts');
    if (response.ok) {
        const data = await response.json();
        displayUserPosts(data.posts);
    } else {
        console.error('Failed to fetch user posts');
    }
}

// Display user posts on the profile page
// Display user posts on the profile page
function displayUserPosts(posts) {
    const postsList = document.getElementById('recent-posts');
    postsList.innerHTML = '';

    if (posts.length === 0) {
        const noPostsMsg = document.createElement('li');
        noPostsMsg.textContent = 'No recent posts available.';
        postsList.appendChild(noPostsMsg);
        return;
    }

    posts.forEach(post => {
        const postItem = document.createElement('li');
        const postContainer = document.createElement('div');
        postContainer.classList.add('post-container');
        
        const postedByDiv = document.createElement('div');
        postedByDiv.classList.add('posted-by');
        postedByDiv.textContent = `Posted by ${post.postedBy}`;
        postContainer.appendChild(postedByDiv);
        
        const textContainer = document.createElement('div');
        textContainer.classList.add('text-container');
        const postText = document.createElement('p'); 
        postText.textContent = `${post.message}`;
        textContainer.style.whiteSpace = 'pre-wrap';
        textContainer.appendChild(postText);
        postContainer.appendChild(textContainer);
        
        const likeButton = document.createElement('button');
        likeButton.classList.add('like-button');
        likeButton.innerHTML = `<span class="star">&#9733;</span> <span>${post.likes}</span>`;
        likeButton.addEventListener('click', () => handleLike(post._id, likeButton));
        postContainer.appendChild(likeButton);
        
        postItem.appendChild(postContainer);
        postsList.appendChild(postItem);
    });
}


// Handle like functionality for a post
async function handleLike(postId, button) {
    const response = await fetch('/like', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ postId })
    });
    if (response.ok) {
        // Refresh the user posts after liking
        fetchUserPosts();
    } else {
        console.error('Failed to like the post');
    }
}
