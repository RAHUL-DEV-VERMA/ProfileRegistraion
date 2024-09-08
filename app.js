import express from "express";
import passport from "passport";
import userModel from "./models/user.js"
import { config } from "dotenv";
import { connectDB } from "./utils/feature.js";
import session from "express-session";
import flash from "connect-flash";
// *dy 84839
// Importing Routes
import loginRouter from "./routes/login.js";
import profileRouter from "./routes/profile.js";

const app = express();

// Middleware 
app.use(express.urlencoded({ extended: true }));
// app.use(express.json());
app.set("view engine", "ejs");
app.use(express.static("./public"));
app.use(flash());
app.use(session({
    resave:false,
    saveUninitialized: false, 
    secret: "manjulika"
}))

config({
    path: "./.env"
})

const PORT = process.env.PORT;
const MONGO_URI = process.env.MONGO_URI;

connectDB(MONGO_URI);


app.use(passport.initialize());
app.use(passport.session());
passport.serializeUser(userModel.serializeUser());
passport.deserializeUser(userModel.deserializeUser());


app.get("/", (req, res)=>{
    res.send(`API working on /api/v1`);
})

// calling api 
app.use("/api/v1" , loginRouter);
app.use("/api/v1" , profileRouter);

app.listen(PORT, ()=>{
    console.log(`Server is live on localhost PORT ${PORT}`)
})
