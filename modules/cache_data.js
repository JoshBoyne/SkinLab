const axios = require("axios");

async function fetchData() {
  let cachedData = [];
  try {
    const response = await axios.get("https://bymykel.github.io/CSGO-API/api/en/skins.json");//api key


    
 

    // include only the first 100 skins
    cachedData = response.data.slice(0,1808).map((skin, index) => ({
      id: index + 1, // Assign a new ID
      weapon: skin.weapon.name, // Weapon name
      pattern: skin.pattern ? skin.pattern.name : "N/A", // Safely access pattern name
      rarity: skin.rarity.name, // Rarity name
      image: skin.image
      
    // Process and return all skins with necessary fields
  /*  cachedData = response.data.map(skin => ({

      weapon: skin.weapon.name,
      pattern: skin.pattern ? skin.pattern.name : "N/A",
      rarity: skin.rarity.name,
      image: skin.image || "",
*/
    }));
  } catch (error) {
    console.error("Error fetching CS:GO skins:", error.message);
    cachedData = [];
  }
  return cachedData;
}

module.exports = fetchData;

