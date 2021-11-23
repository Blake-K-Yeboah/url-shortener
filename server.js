// Import Dependencies
const mongoose = require("mongoose");
const express = require("express");
const dotenv = require("dotenv");
const path = require("path");
const nanoid = require("nanoid");

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

// Define URL model
const ShortUrl = mongoose.model(
    "shortUrl",
    new mongoose.Schema({
        fullUrl: {
            type: String,
            required: true,
        },
        shortUrl: {
            type: String,
            default: nanoid.nanoid(),
        },
        clickCount: {
            type: Number,
            default: 0,
        },
    })
);

// Get Route
app.get("/", (req, res) => {
    // Return index page
    res.render("public/index.html");
});

// Short Link Route
app.get("/:shortUrl", async (req, res) => {
    const shortUrl = await ShortUrl.find({ shortUrl: req.params.shortUrl });
    if (!shortUrl)
        return res
            .status(404)
            .send("URL doesn't exist. Check you typed it correctly.");

    shortUrl.clickCount += 1;
    const newShortUrl = await shortUrl.save();

    return res.redirect(shortUrl.fullUrl);
});

// Create short url Post Route
app.post("/createUrl", async (req, res) => {
    if (!req.body.url) return res.status(400).send("Please enter a url");

    const newUrl = new ShortUrl({
        fullUrl: req.body.url,
    });

    newUrl.save();

    return res.json({
        shortUrl: `${req.protocol}://${req.hostname}/${newUrl.shortUrl}`,
    });
});

// Define Port
const port = process.env.PORT;

// Start Server
const server = app.listen(port, () => {
    console.log(`Server running on port ${server.address().port}`);
});
