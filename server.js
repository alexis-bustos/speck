const express = require("express");
const cors = require("cors");
const app = express();
const mongoose = require("mongoose");
const passport = require("passport");
const session = require("express-session");
const MongoStore = require("connect-mongo")(session);
const flash = require("express-flash");
const logger = require("morgan");
const connectDB = require("./config/database");
const mainRoutes = require("./routes/main");
const postRoutes = require("./routes/postRoutes");
const commentRoutes = require("./routes/commentRoutes");
const profileRoutes = require("./routes/profileRoutes");
const methodOverride = require("method-override");

// Use .env file in the config folder
// console.log("[boot] loading env");
require("dotenv").config({ path: "./config/.env" });

// Passport config
// console.log("[boot] passport config");
require("./config/passport")(passport);

// Connect to DB
// console.log("[boot] connectDB()");
connectDB()
  .then(() => console.log("[boot] Mongo connected (connectDB resolved)"))
  .catch((e) => console.error("[boot] connectDB failed:", e));

// Using EJS for views
app.set("view engine", "ejs");

// Static folder
// console.log("[boot] static/public");
app.use(express.static("public"));

// Allow your Netlify site + local dev to call the API
app.use(
  cors({
    origin: [
      "http://localhost:5173",
      "http://localhost:3000",
      "https://speck-app.netlify.app",
    ],
  })
);

// Body parsing
// console.log("[boot] body parsers");
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// Logging
app.use(logger("dev"));

// Use forms for put/delete methods
app.use(methodOverride("_method"));

// Setup Sessions - stored in MongoDB
// console.log("[boot] sessions");
app.use(
  session({
    secret: "keyboard cat", // can be anything you want
    resave: false,
    saveUninitialized: false,
    store: new MongoStore({ mongooseConnection: mongoose.connection }),
  })
);

// Passport middleware
app.use(passport.initialize());
app.use(passport.session());

// Use flash messages for errors, info, ect...
app.use(flash());

// Setup routes for which the server is listening
// console.log("[boot] routes mount");
app.use("/", mainRoutes);
app.use("/posts", postRoutes);
app.use("/comment", commentRoutes);
app.use("/profile", profileRoutes);

// Add healthcheck route
app.get("/health", (req, res) => res.json({ ok: true }));

// console.log("[boot] calling listen()");
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Listening on port ${PORT}`);
});
