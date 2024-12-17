/* We referenced Abduls notes for this section 
 */
const express = require("express");// set up server
const bodyParser = require("body-parser");//middleware to parse incoming request
const fetchData = require("./modules/cache_data.js");//fetch data from api
const app = express();//create instance of express application
const PORT = 3000;//defines port which server will run on
const fetchCrates = require("./modules/fetchCrates");//fetch crate data


let items = [];
const fs = require("fs");


//async function that automatically populates the items array with data from the fetchData function
(async () => {
  items = await fetchData();
})();

/*@Authour Joshua Boyne - Student Number: 23343338 

  retrieves crate data using "fetchCrates" function 
  if successful, returns crates as json
  if error, logs error message and responds with 500 status code and error message
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

/* We referenced Abduls notes for this section 
 */
// Middleware
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json()); 
app.use(express.static("public"));
app.set("view engine", "ejs");


/*@Authour Joshua Boyne - Student Number: 23343338 
*/
// Home Page
/*
  fetches the skin data and extracts the the unique weapon skins to render the home page
  populates the carousel with skins (only 20)
*/
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

  this functions gets the the skins from the skins list and checks for duplicates based on the weapon name
  store the first occurrence of each weapon in an object and returns an array of skins 
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

  route that provides the api endpoint to fetch and return the skin data in JSON
  if data retrieval is successful, skins are sent as a JSON response 
  otherwise 500 error message will appear
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
  /game
  renders the game page and sets the active tab to "game" for the navigation

  /api/collection
  provides an api endpoint that returns the current collection data in JSON format
*/

app.get("/game", (req, res) => {
  res.render("pages/game", { activeTab: "game" });
});
app.get("/api/collection", (req, res) => {
  res.json(collection);
});


/*@Authour Joshua Boyne - Student Number: 23343338 

  handles the tradeup process by accepting 6 skins
  validates if exactly 6 skins are provided
  removes the selected skins from the collection
  updates the collection 
  if it fails, responds with 400 error 
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

/* 
  generates and returns a data for the chart by getting item names and their values as json
*/
app.get("/api/chart-data", (req, res) => {
  const labels = items.map((item) => item.name);
  const values = items.map((item) => item.value);
  res.json({ labels, values });
});

/* for case opening game  
  adds a new skins to the users collection, making sure it doesnt exist already 
 */
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




/*  @Authour Sean Byrne - Student Number: 23343362
    --- Skin Catalogue Section & Collection Section ---
    This section contains the a list of every weapon type with corresponding skin patterns.
    An image of every weapon with a skin pattern will have a button allowing the user to add to a collection (this would be the Add for the CRUD functionality).
    CRUD FUNCTIONALITY - within the collection, users can delete (remove weapon from collection) or update (change weapon from collection to another weapon).
*/

// route handler for getting the GET request from the skin endpoint, renders the skin page with all weapon names, patterns and images
app.get("/skin",(req, res) => {
  res.render("pages/skin", {items: items, activeTab: "skin" });
});


/* We referenced Abduls notes for this section 
 */
//route handler for POST request from refreshData endpoint, removes all weapons from collection
app.post("/refreshData", async (req, res) => {
 collection = []; 
 //console.log(collection);
  res.render('pages/skin', { items, activeTable: "skin"});
});


let collection = []; // stores selected weapons from skin page within an array called collection



//route handler for collection POST endpoint
// function adds selected weapons from the skin page to the collection page 
app.post("/collection", (req, res) => {
  const weaponid = parseInt(req.body.id);
  const weapon = items.find(item => item.id === weaponid);
  if (weapon && !collection.find(item => item.id === weaponid)) { //if for preventing mulitple of the same weapon to be within the collection
    collection.push(weapon); // adds selected weapon to the collection
   // console.log(weapon)
  }
  res.redirect("/skin");
});

//route handler for getting GET requests from collection endpoint, renders collection page with selected weapons from skin page
app.get("/collection", (req, res) => {
  res.render("pages/collection", {collection, activeTab: "collection" });
});


// route handler for getting GET requests from edit endpoint, renders editWeapon page for editing and updating selected weapons from the collection page
app.get("/edit/:id", (req, res) => {
  const weapon = collection.find((weapon) => weapon.id === parseInt(req.params.id));
  if (weapon) {
    res.render("pages/editWeapon", { weapon, activeTab: "collection" });
  } else {
    res.status(404).send("Item not found");
  }
});

// route handler for sending POST requests to collection endpoint, renders collection page with selected weapons from skin page
app.post("/updateWeapon", (req, res) => {
  const { id, weapon, pattern, image } = req.body;
  const weaponIndex = collection.findIndex((item) => item.id === parseInt(id));
  if (weaponIndex !== -1) {
    collection[weaponIndex] = {
      ...collection[weaponIndex],
      weapon,
      pattern
    };
  }
  res.redirect("collection");
});

// handles deleting an weapon from the collection page

/* We referenced Abduls notes for this section */

app.post("/delete", (req, res) => {
  const { id } = req.body;
  collection = collection.filter((item) => item.id !== parseInt(id));
  res.redirect("collection");
});



/* We referenced Abduls notes for this section 
 */
// Start the server
app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});
