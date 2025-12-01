const path = require("path");
const express = require("express");
const cors = require("cors");
const { v4: uuidv4 } = require("uuid");
const todosData = require("./todos");

const app = express();
const PORT = 3000;

// middleware za parsiranje JSON i URL-enc. podataka
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// dodaj id svakom TODO zapisu pomoću uuid
const todos = todosData.map(todo => ({
  ...todo,
  id: uuidv4()
}));

// statička mapa = client/dist (buildani Vite klijent) -- bespotrebna za "npx vite"
const clientDistPath = path.join(__dirname, "../client/dist");
app.use(express.static(clientDistPath));

// GET ruta koja vraća sve TODO zapise
app.get("/api/todos", (req, res) => {
  res.json(todos);
});

// PUT ruta za ažuriranje TODO zapisa
app.put("/api/todos/:id", (req, res) => {
  const id = req.params.id;
  const updatedTodo = req.body;

  const index = todos.findIndex(todo => todo.id === id);

  if (index === -1) {
    return res.status(404).json({ message: "Todo not found" });
  }

  // osiguraj da id ostane isti
  todos[index] = { ...todos[index], ...updatedTodo, id };
  res.json(todos[index]);
});

// pokretanje servera
app.listen(PORT, () => {
  console.log(`Express server listening on http://localhost:${PORT}`);
});
