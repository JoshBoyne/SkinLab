const express = require("express");
const bodyParser = require("body-parser");
const fetchData = require("./modules/cache_data.js");
const app = express();
const PORT = 3000;
const items = [];

// Middleware
app.use(bodyParser.urlencoded({ extended: true })); // Parse form data
app.use(express.static("public")); // Serve static files
app.set("view engine", "ejs"); // Set EJS as the view engine

// Home Page
app.get("/", async (req, res) => {
  try {
    const skins = await fetchData(); // Fetch all skins
    const uniqueWeaponSkins = getUniqueWeaponSkins(skins); 

    
    res.render("pages/index", {
      activeTab: "home",
      carouselSkins: uniqueWeaponSkins, 
      featuredSkins: uniqueWeaponSkins.slice(0, 20), 
    });
  } catch (error) {
    console.error("Error in home route:", error.message);
    res.render("pages/index", {
      activeTab: "home",
      carouselSkins: [], 
      featuredSkins: [], 
    });
  }
});

function getUniqueWeaponSkins(skins) {
  const uniqueSkins = {};
  skins.forEach((skin) => {
    if (!uniqueSkins[skin.weapon]) {
      uniqueSkins[skin.weapon] = skin; 
    }
  });
  return Object.values(uniqueSkins); 
}

// API endpoint for chart data
app.get("/api/skins", async (req, res) => {
  try {
    const skins = await fetchData();
    res.json(skins);
  } catch (error) {
    console.error("Error fetching skins for API:", error.message);
    res.status(500).json({ error: "Failed to fetch skins data" });
  }
});




// Collection Page
app.get("/collection", (req, res) => {
  res.render("pages/collection", { activeTab: "collection" });
});

// Game Page
app.get("/game", (req, res) => {
  res.render("pages/game", { activeTab: "game" });
});

// Skin Page
app.get("/skin", async (req, res) => {
  try {
    const skins = await fetchData(); // Fetch skin data for the skin page
    res.render("pages/skin", { activeTab: "skin", skins });
  } catch (error) {
    console.error("Error fetching skins for skin page:", error.message);
    res.render("pages/skin", { activeTab: "skin", skins: [] });
  }
});

// Use for adding skin to collection
app.post("/skin", (req, res) => {
  const { name, value } = req.body;

  // Ensure both fields are provided
  if (!name || !value) {
    return res.status(400).send("Name and value are required.");
  }

  const id = items.length ? items[items.length - 1].id + 1 : 1;
  items.push({ id, name, value: parseInt(value) });
  res.redirect("/"); // Redirect back to the listing page
});

// Use for collection page
app.get("/edit/:id", (req, res) => {
  const item = items.find((item) => item.id === parseInt(req.params.id));
  if (item) {
    res.render("form", { item, activeTab: "collection" });
  } else {
    res.status(404).send("Item not found");
  }
});

// Use for collection page
app.post("/update", (req, res) => {
  const { id, name, value } = req.body;
  const itemIndex = items.findIndex((item) => item.id === parseInt(id));
  if (itemIndex !== -1) {
    items[itemIndex] = { id: parseInt(id), name, value: parseInt(value) };
  }
  res.redirect("/");
});

// Handle Deleting an Item
app.post("/delete", (req, res) => {
  const { id } = req.body;
  items = items.filter((item) => item.id !== parseInt(id));
  res.redirect("/");
});

// Chart Page
app.get("/chart", (req, res) => {
  res.render("chart", { activeTab: "chart" });
});

// API Endpoint: Provide chart data
app.get("/api/chart-data", (req, res) => {
  const labels = items.map((item) => item.name);
  const values = items.map((item) => item.value);
  res.json({ labels, values });
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});
