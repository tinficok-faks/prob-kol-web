const express = require("express");
const app = express();
const todos = require("./todos");

// middleware za JSON
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// static folder -> client
app.use(express.static("../client"));

// GET ruta
app.get("/todos", (req, res) => {
    res.json(todos);
});

app.listen(3000, () => {
    console.log("Server running on http://localhost:3000");
});
