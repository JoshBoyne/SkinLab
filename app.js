const express = require("express");
const bodyParser = require("body-parser");
const fetchData = require("./modules/cache_data.js");
const app = express();
const PORT = 3000;
const fetchCrates = require("./modules/fetchCrates");


let items = [];
const fs = require("fs");

var myCSS = {
  //headerStyle : fs.readFileSync('public/css/header.css', 'utf8')
  collectionStyle : fs.readFileSync('public/css/catalogue.css', 'utf8')
};

(async () => {
  items = await fetchData();
})();

/*@Authour Joshua Boyne - Student Number: 23343338 
*/
app.get("/api/crates", async (req, res) => {
  try {
    const crates = await fetchCrates();
    res.json(crates);
  } catch (error) {
    console.error("Error fetching crates for API:", error.message);
    res.status(500).json({ error: "Failed to fetch crates data" });
  }
});


// Middleware
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json()); 
app.use(express.static("public"));
app.set("view engine", "ejs");


/*@Authour Joshua Boyne - Student Number: 23343338 
*/
// Home Page
app.get("/", async (req, res) => {
  try {
    const skins = await fetchData(); 
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

/*@Authour Joshua Boyne - Student Number: 23343338 
*/
function getUniqueWeaponSkins(skins) {
  const uniqueSkins = {};
  skins.forEach((skin) => {
    if (!uniqueSkins[skin.weapon]) {
      uniqueSkins[skin.weapon] = skin; 
    }
  });
  return Object.values(uniqueSkins); 
}

/*@Authour Joshua Boyne - Student Number: 23343338 
*/
app.get("/api/skins", async (req, res) => {
  try {
    const skins = await fetchData();
    res.json(skins);
  } catch (error) {
    console.error("Error fetching skins for API:", error.message);
    res.status(500).json({ error: "Failed to fetch skins data" });
  }
});

/*@Authour Joshua Boyne - Student Number: 23343338 
*/
// Game Page
app.get("/game", (req, res) => {
  res.render("pages/game", { activeTab: "game" });
});
app.get("/api/collection", (req, res) => {
  res.json(collection);
});
/*@Authour Joshua Boyne - Student Number: 23343338 
*/
app.post("/api/tradeUp", (req, res) => {
  const { skins } = req.body;

  if (!skins || skins.length !== 6) {
      return res.status(400).send("You must trade exactly 6 skins.");
  }

  // removes the selecte skins from the collection
  skins.forEach((skin) => {
      const index = collection.findIndex((item) => item.id === skin.id);
      if (index > -1) {
          collection.splice(index, 1);
      }
  });

  // Generate a random rare skin for the trade-up
  const rarityLevels = ["Restricted", "Classified", "Covert", "Knife"];
  const randomRarity = rarityLevels[Math.floor(Math.random() * rarityLevels.length)];
  const availableSkins = items.filter((item) => item.rarity === randomRarity);
  const randomSkin = availableSkins[Math.floor(Math.random() * availableSkins.length)];

  // Add the new skin to the collection
  collection.push(randomSkin);

  // Return the new skin to the frontend
  res.json(randomSkin);
});

/*@Authour Joshua Boyne - Student Number: 23343338 
*/
// Chart Page
app.get("/chart", (req, res) => {
  res.render("chart", { activeTab: "chart" });
});

/*@Authour Joshua Boyne - Student Number: 23343338 
*/
//  Provide chart data
app.get("/api/chart-data", (req, res) => {
  const labels = items.map((item) => item.name);
  const values = items.map((item) => item.value);
  res.json({ labels, values });
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







//Collection Page
let collection = []; 
// Skin Page
app.get("/skin", async (req, res) => {
  try {
    const skins = await fetchData();
    res.render("pages/skin", { activeTab: "skin", skins });
  } catch (error) {
    console.error("Error fetching skins for skin page:", error.message);
    res.render("pages/skin", { activeTab: "skin", skins: [] });
  }
});

app.post("/addToCollection", (req, res) => {
  console.log("Received skin:", req.body.skin); 
  const { skin } = req.body;

  if (!skin || collection.find((item) => item.id === skin.id)) {
      console.log("Invalid skin or already in collection.");
      return res.status(400).send("Invalid skin or already in collection.");
  }

  collection.push(skin);
  console.log("Skin added to collection:", skin); 
  res.sendStatus(200); 
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




// Start the server
app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});
