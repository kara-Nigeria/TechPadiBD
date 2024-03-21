const express = require("express");
const cors = require("cors");
// const path = require("path");
const multer = require("multer");
const session = require("express-session");
const bodyParser = require("body-parser");

const mongoose = require("mongoose");
require("dotenv").config();
// const uploadrouter = require('./cloudinary.upload.js')

const authorRoutes = require("./routes/authors");
const categoriesRoutes = require("./routes/categories");
const postRoutes = require("./routes/posts");
const EmailRoutes = require("./routes/email");
const AuthRoutes = require("./routes/auth");

const app = express();
// Middleware
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(
  session({
    secret: "@q#e=fB_2F-1o2lQ*SJt@eg$+rMOjNU#+SfJUDH`GUvPo+b7$5P@rLQA[u+0T",
    resave: false,
    saveUninitialized: true,
  })
);

app.use("/api", authorRoutes);
app.use("/api", categoriesRoutes);
app.use("/api", postRoutes);
app.use("/api", EmailRoutes);
app.use("/api", AuthRoutes);

mongoose
  .connect(process.env.MONGODB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })

  .then(() => console.log("MongoDB connected"))
  .catch((err) => console.error("MongoDB connection error:", err));

// mongoose
//   .connect("mongodb://localhost:27017/blog", {
//     useNewUrlParser: true,
//     useUnifiedTopology: true,
//   })
//   .then(() => {
//     console.log("Connected to MongoDB");
//   })
//   .catch((error) => {
//     console.error("Error connecting to MongoDB:", error);
//   });

app.get("/", (req, res) => {
  res.send(" <h1> welcome to backend </h1> ");
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server is listening on port ${PORT}`);
});
