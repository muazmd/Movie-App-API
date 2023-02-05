const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const authRouter = require('./Routs/auth');
const userRoute = require('./Routs/users');
const MovieRoute = require('./Routs/movies');
const ListRoute = require('./Routs/lists');
dotenv.config();

const app = express();

mongoose.connect(process.env.MONGO_URI,
    {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useCreateIndex:true,
      })
      .then(() =>console.log("DB connection established"))
      .catch(err => console.log(err));

app.use(express.json());
app.use("/api/auth", authRouter);
app.use("/api/users", userRoute);
app.use("/api/movies", MovieRoute);
app.use("/api/lists", ListRoute);
    app.listen(8800, ()=>{
    console.log("backend is running");
})