const express = require("express");
const connectDb = require("./src/config/database");
const dotenv = require("dotenv");
const cors = require("cors");
const authRouter = require("./src/routes/auth");
const cookieParser = require("cookie-parser");
const locationRouter = require("./src/routes/location");
const adminRouter = require("./src/routes/admin");

const app = express();
dotenv.config();

app.use(cors({
    origin : ["http://localhost:5173"],
    credentials : true,
    methods: ["GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"],
    allowedHeaders: ["Authorization", "X-CSRF-Token", "X-Requested-With", "Accept", "Accept-Version", "Content-Length", "Content-MD5", "Content-Type", "Date", "X-Api-Version"],
}));

app.use(express.json());
app.use(cookieParser());

app.use("/",authRouter);
app.use("/",locationRouter);
app.use("/",adminRouter);

connectDb().then(()=>{
    console.log("Database connected.")
    app.listen(process.env.PORT,()=>{
        console.log("Server is running on port 7777");
    })
}).catch((err)=>{
    console.error(err);
})

