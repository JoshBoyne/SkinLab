const express = require("express");
const bodyParser = require("body-parser");
const fetchData = require("./modules/cache_data.js");
const app = express();
const PORT = 3000;

// In-memory data store for simplicity
/*
let items = [
  { id: 1, name: "Item 1", value: 10 },
  { id: 2, name: "Item 2", value: 20 },
  { id: 3, name: "Item 3", value: 30 },
];



*/

let items = [];

// Middleware
app.use(bodyParser.urlencoded({ extended: true })); // Parse form data
app.use(express.static("public")); // Serve static files
app.set("view engine", "ejs"); // Set EJS as the view engine

// List Data
app.get("/refresh", async (req, res) => {
  items = await fetchData();
  console.log(items);
  res.render("api", { items: items, activeTab: "API" });
  //res.redirect("/");
});

// 1. Index Page: Show list of items with add and delete actions
app.get("/", (req, res) => {
  res.render("index", { items, activeTab: "list" });
});

// Add Item Page
app.get("/add", (req, res) => {
  res.render("add", { activeTab: "add" });
});

// Handle Add Item Form Submission
app.post("/add", (req, res) => {
  const { name, value } = req.body;

  // Ensure both fields are provided
  if (!name || !value) {
    return res.status(400).send("Name and value are required.");
  }

  const id = items.length ? items[items.length - 1].id + 1 : 1;
  items.push({ id, name, value: parseInt(value) });
  res.redirect("/"); // Redirect back to the listing page
});

// Edit Item Form
app.get("/edit/:id", (req, res) => {
  const item = items.find((item) => item.id === parseInt(req.params.id));
  if (item) {
    res.render("form", { item, activeTab: "add" });
  } else {
    res.status(404).send("Item not found");
  }
});

// Update Item
app.post("/update", (req, res) => {
  const { id, name, value } = req.body;
  const itemIndex = items.findIndex((item) => item.id === parseInt(id));
  if (itemIndex !== -1) {
    items[itemIndex] = { id: parseInt(id), name, value: parseInt(value) };
  }
  res.redirect("/");
});

// 3. Handle Deleting an Item
app.post("/delete", (req, res) => {
  const { id } = req.body;
  items = items.filter((item) => item.id !== parseInt(id));
  res.redirect("/");
});

// 4. Chart Page: Render the chart page
// Index Page
app.get("/chart", (req, res) => {
  res.render("chart", { activeTab: "chart" });
});

// 5. API Endpoint: Provide chart data
app.get("/api/chart-data", (req, res) => {
  const labels = items.map((item) => item.name);
  const values = items.map((item) => item.value);
  res.json({ labels, values });
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});
