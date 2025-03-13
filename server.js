const express = require("express");
const connectDb = require("./src/config/database");
const dotenv = require("dotenv");
const cors = require("cors");
const authRouter = require("./src/routes/auth");
const cookieParser = require("cookie-parser");
const locationRouter = require("./src/routes/location");
const adminRouter = require("./src/routes/admin");
const profileRouter = require("./src/routes/profile");
const redisRouter = require("./src/routes/redisRoute");

const app = express();
dotenv.config();

app.use(cors({
    origin : ["http://localhost:5173","https://user-location-frontend.vercel.app"],
    credentials : true,
}));

app.use(express.json());
app.use(cookieParser());


app.use("/",authRouter);
app.use("/",locationRouter);
app.use("/",adminRouter);
app.use("/",profileRouter);
// app.use("/",redisRouter);

connectDb().then(()=>{
    console.log("Database connected.")
    app.listen(process.env.PORT,()=>{
        console.log("Server is running on port 7777");
    })
}).catch((err)=>{
    console.error(err);
})

