const users = [];

// Join user to chat
function userJoin(id, username, room) {
    const user = {id, username, room};

    users.push(user);

    return user;
}

// Get Current user
function getCurrentUser(id) {
    return users.find(user => user.id);
}

// User leave the chat
function userLeave(id) {
    const index = users.findIndex(user => user.id === id);

    if(index !== -1) {
        // Chỉ trả về người dùng nên dùng [0] vào
        return users.splice(index, 1)[0];
    }
}

// Get Room chat
function getRoomUsers(room) {
    return users.filter(user => user.room === room);
}

module.exports = {
    userJoin,
    getCurrentUser,
    userLeave,
    getRoomUsers
};