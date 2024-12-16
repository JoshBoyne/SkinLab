/*@Authour Joshua Boyne - Student Number: 23343338
  This file is primarily for "Case Opening Simulator" game.
  This file fetches the case information from the api below
*/

const axios = require("axios");

async function fetchCrates() {
  let cachedCrates = {};
  try {
    
    const response = await axios.get("https://bymykel.github.io/CSGO-API/api/en/skins.json");//api

   
    const groupedCrates = response.data.reduce((acc, skin) => {
      const crate = skin.crates && skin.crates[0]; 

      if (crate) {
        const crateName = crate.name; 
        const crateImage = crate.image; 

        
        if (!acc[crateName]) {
          acc[crateName] = {
            skins: [], 
            image: crateImage,
          };
        }

       
        acc[crateName].skins.push({
          id: acc[crateName].skins.length + 1,
          weapon: skin.weapon.name,
          pattern: skin.pattern ? skin.pattern.name : "N/A",
          rarity: skin.rarity.name,
          image: skin.image,
        });
      }
      return acc;
    }, {});

   
    cachedCrates = groupedCrates;
  } catch (error) {
    console.error("Error fetching crates and skins:", error.message);
    cachedCrates = {};
  }
  return cachedCrates;
}

module.exports = fetchCrates;