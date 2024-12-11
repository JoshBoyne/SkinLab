const axios = require("axios");

// Fetch the first 100 skins from the CS:GO API
async function fetchData() {
  let cachedData = [];
  try {
    const response = await axios.get("https://bymykel.github.io/CSGO-API/api/en/skins.json");

    // Transform the response to include only the first 100 skins
    cachedData = response.data.slice(0,1808).map((skin, index) => ({
      id: index + 1, // Assign a new ID
      weapon: skin.weapon.name, // Weapon name
      pattern: skin.pattern ? skin.pattern.name : "N/A", // Safely access pattern name
      rarity: skin.rarity.name, // Rarity name
      image: skin.image
    }));
  } catch (error) {
    console.error("Error fetching CS:GO skins:", error.message);
    cachedData = []; // Reset cache on failure
  }
  return cachedData;
}

module.exports = fetchData;