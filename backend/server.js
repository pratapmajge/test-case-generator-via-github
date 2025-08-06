const express= require('express');
const cors=require('cors')
const session=require('express-session')
const passport = require('passport');
require('dotenv').config();

const app=express();
app.use(cors());
app.use(session({secret: "secret", resave: false, saveUninitialized: true}));
app.use(express.json());



app.use(passport.initialize());
app.use(passport.session());

//routes
require("./auth/githubAuth")(app);


app.listen(5000, () => console.log("running on port 5000"))