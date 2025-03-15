const express = require("express");
const connectDb = require("./src/config/database");
const dotenv = require("dotenv");
const cors = require("cors");
const http = require("http");
const authRouter = require("./src/routes/auth");
const cookieParser = require("cookie-parser");
const locationRouter = require("./src/routes/location");
const adminRouter = require("./src/routes/admin");
const profileRouter = require("./src/routes/profile");
const initializeSocket = require("./src/utils/socket");


const app = express();
dotenv.config();

app.use(cors({
    origin : ["http://localhost:5173","https://user-location-frontend.vercel.app"],
    credentials : true,
}));

//creating server using http and this app is express app we made
//we will do server.listen instead of app.listen,dont forget to change it to server.listen
const server = http.createServer(app);
initializeSocket(server);

app.use(express.json());
app.use(cookieParser());


app.use("/",authRouter);
app.use("/",locationRouter);
app.use("/",adminRouter);
app.use("/",profileRouter);


connectDb().then(()=>{
    console.log("Database connected.")
    server.listen(process.env.PORT,()=>{
        console.log("Server is running on port 7777");
    })
}).catch((err)=>{
    console.error(err);
})

