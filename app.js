const express = require("express");
const bodyParser = require("body-parser");
const fetchData = require("./modules/cache_data.js");
const app = express();
const PORT = 3000;

let items = [];
const fs = require("fs");
var myCSS = {
  //headerStyle : fs.readFileSync('public/css/header.css', 'utf8')
  collectionStyle : fs.readFileSync('public/css/catalogue.css', 'utf8')
};

(async () => {
  items = await fetchData();
})();




// Middleware
app.use(bodyParser.urlencoded({ extended: true })); // Parse form data
app.use(express.static("public")); // Serve static files
app.set("view engine", "ejs"); // Set EJS as the view engine

// Home Page
app.get("/", async (req, res) => {
  try {
    const skins = await fetchData(); // Fetch all skins
    const uniqueWeaponSkins = getUniqueWeaponSkins(skins); // Get one skin per weapon type

    // Render the homepage and pass data to the view
    res.render("pages/index", {
      activeTab: "home",
      carouselSkins: uniqueWeaponSkins, // Pass this to the carousel
      featuredSkins: uniqueWeaponSkins.slice(0, 20), // Take the first 20 skins for the featured section
    });
  } catch (error) {
    console.error("Error in home route:", error.message);
    res.render("pages/index", {
      activeTab: "home",
      carouselSkins: [], // Default empty data to avoid errors
      featuredSkins: [], // Default empty data
    });
  }
});

function getUniqueWeaponSkins(skins) {
  const uniqueSkins = {};
  skins.forEach((skin) => {
    if (!uniqueSkins[skin.weapon]) {
      uniqueSkins[skin.weapon] = skin; // Add first occurrence of each weapon type
    }
  });
  return Object.values(uniqueSkins); // Return as an array
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

/*  @Authour Sean Byrne - Student Number: 23343362
    ---Skin Catalogue Section---
    This section contains the a list of every weapon type with corresponding skin patterns.
    An image of every weapon with a skin pattern will have a button allowing the user to add to a collection (this would be the Add for the CRUD functionality).
    CRUD FUNCTIONALITY - within the collection, users can delete (remove weapon from collection) or update (change weapon from collection to another weapon).
*/
app.get("/skin",(req, res) => {
  res.render("pages/skin", {myCSS: myCSS, items: items, activeTab: "skin" });
});

app.post("/refreshData", async (req, res) => {
 collection = []; 
 //console.log(items);
  res.render('pages/skin', { items, activeTable: "skin"});
});




// Game Page
app.get("/game", (req, res) => {
  res.render("pages/game", { activeTab: "game" });
});

//Collection Page
let collection = []; // Store collected items
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
});

app.post("/collection", (req, res) => {
  const weaponid = parseInt(req.body.id, 10);
  const weapon = items.find(item => item.id === weaponid);
  if (weapon && !collection.find(item => item.id === weaponid)) {
    collection.push(weapon); // Add the weapon to the collection
  }
  res.redirect("/skin");
});

app.get("/collection", (req, res) => {
  res.render("pages/collection", {collection, activeTab: "collection" });
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
  collection = collection.filter((item) => item.id !== parseInt(id));
  res.redirect("collection");
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
