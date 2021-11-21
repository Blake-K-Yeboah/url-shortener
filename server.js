// Import Dependencies
const mongoose = require("mongoose");
const express = require("express");
const dotenv = require("dotenv");
const path = require("path");

// Enable Environment Variables
dotenv.config();

// Initialize Express App
const app = express();

// Define Database URL
const dbUrl =
    process.env.NODE_ENV === "development"
        ? process.env.DEV_DB
        : process.env.PROD_DB;

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// Make Public Folder Static
app.use(express.static(path.join(__dirname, "public")));

// Connect to DB
mongoose.connect(
    dbUrl,
    {
        useNewUrlParser: true,
        useUnifiedTopology: true,
    },
    (err) => {
        if (err) throw err;
        console.log("MongoDB Connected :)");
    }
);

// Define Port
const port = process.env.PORT;

// Start Server
const server = app.listen(port, () => {
    console.log(`Server running on port ${server.address().port}`);
});
