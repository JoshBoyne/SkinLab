const axios = require("axios");

async function fetchData() {
  let cachedData = [];
  try {
    const response = await axios.get("https://bymykel.github.io/CSGO-API/api/en/skins.json");

    // Group skins by weapon type and take only the first skin from each group
    const groupedSkins = response.data.reduce((acc, skin) => {
      const weapon = skin.weapon.name;
      if (!acc[weapon]) {
        acc[weapon] = {
          weapon,
          pattern: skin.pattern ? skin.pattern.name : "N/A",
          rarity: skin.rarity.name,
          image: skin.image || "",
        };
      }
      return acc;
    }, {});

    // Convert the grouped object to an array
    cachedData = Object.values(groupedSkins);
  } catch (error) {
    console.error("Error fetching CS:GO skins:", error.message);
    cachedData = [];
  }
  return cachedData;
}

module.exports = fetchData;

