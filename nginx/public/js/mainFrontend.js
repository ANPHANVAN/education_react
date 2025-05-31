
document.addEventListener('DOMContentLoaded', async () => {
    const respose = await fetch('/api/user-current')
    const { user } = await respose.json()
    const profileUser = document.querySelector('#profile-user')
    profileUser.innerHTML = `${user.fullname || "Profile"}`
})

async function fetchUserData(userId) {
    if (!userId) {
        const response = await fetch(`/api/user/all-user`)
        const { users } = await response.json();
        return users;
    } else {
        const response = await fetch(`/api/users/${userId}`)
        const { user } = await response.json();
        return user;
    }
}

    // Fetch one users
async function fetchOneUser(userId) {
    try {
    const response = await fetch(`/api/users/${userId}`);
    const user = await response.json();
    return user
    } catch (error) {
    console.error('Error fetching users:', error);
    }
}

// Fetch All Users
async function fetchAllUser() {
    try {
    const response = await fetch(`/api/user/all-user`);
    const allUser = await response.json();
    return allUser
    } catch (error) {
    console.error('Error fetching users:', error);
    }
}

// Fetch current User
async function fetchCurrentUser() {
    try {
    const response = await fetch(`/api/user-current`);
    const user = await response.json();
    return user.user
    } catch (error) {
    console.error('Error fetching users:', error);
    }
}