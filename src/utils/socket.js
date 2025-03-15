const socket = require("socket.io");


const initializeSocket = (server) => {
    const io = socket(server,{
        cors:{
            origin : ["http://localhost:5173","https://user-location-frontend.vercel.app"],
            credentials:true,
        },
    })
    console.log("Socket initialized");

    io.on("connection",(socket)=>{
        console.log("Connection established");
    })
}

module.exports = initializeSocket;