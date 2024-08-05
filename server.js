const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const cors = require("cors");
const dotenv = require("dotenv");
const cookieParser = require('cookie-parser');

const app = express();
dotenv.config();

const PORT = process.env.PORT || 5000;

// Load environment variables
const MONGODB_URL = process.env.MONGODB_URL;

app.use(bodyParser.json());
app.use(cookieParser());
app.use(express.urlencoded({extended: false}));

mongoose.connect(MONGODB_URL, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
});

const connection = mongoose.connection;

connection.once("open", () => {
    console.log("MongoDB Connection success!..");
});

app.listen(PORT, () =>{
    console.log(`Server is up and running on the PORT ${PORT}`);
});