const express = require("express");

const app = express();

app.get("/", (req, res) => {
    res.send("Hello! My application is running on AWS EKS 🚀");
});

app.get("/health", (req, res) => {
    res.send("Application is healthy");
});

app.listen(3000, () => {
    console.log("Application running on port 3000");
});
