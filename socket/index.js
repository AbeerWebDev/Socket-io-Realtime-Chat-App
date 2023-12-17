const io = require('socket.io')(8900, {
    cors: {
        origin: "http://localhost:3000"
    }
})

let users = []

const addUSer = (userId, socketId) => {
    !users.some((user) => user.userId === userId) &&
    users.push({userId, socketId})
}

const removeUser = (socketId) => {
    users = users.filter(user=> user.socketId !== socketId)
}

const getUser = (userId) => {
    return users.find(user=> user.userId === userId)
}

io.on("connection", (socket) => {
    // When a user connects
  console.log("A user connected")
  // take userId and socketId from user
  socket.on("addUser", userId => {
      addUSer(userId, socket.id)
      io.emit("getUsers", users)
    })

    // send and get message
    socket.on("sendMessage", ({senderId, receiverId, text}) => {
        const user = getUser(receiverId)
        io.to(user.socketId).emit("getMessage", {
            senderId,
            text
        })
    })

    // when a user disconnects
    socket.on('disconnection', ()=>{
        console.log("a user disconnected")
        removeUser(socket.id)
        io.emit("getUsers", users);
    })
});
