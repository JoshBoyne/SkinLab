document.addEventListener("DOMContentLoaded", async () => {
    const caseDropdown = document.getElementById("caseDropdown");
    const skinsDisplay = document.getElementById("skinsDisplay");

    // Fetch cases and skins data
    const data = await fetchCratesData();

    // Populate the dropdown with crate names
    Object.keys(data).forEach((crateName) => {
        const option = document.createElement("option");
        option.value = crateName;
        option.textContent = crateName;
        caseDropdown.appendChild(option);
    });

    // Handle crate selection
    caseDropdown.addEventListener("change", (event) => {
        const selectedCase = event.target.value;
        const skins = data[selectedCase];

        // Clear previous skins
        skinsDisplay.innerHTML = "";

        // Display skins in rows of 6
        skins.forEach((skin) => {
            const skinElement = document.createElement("div");
            skinElement.classList.add("skin-item");
            skinElement.innerHTML = `
                <img src="${skin.image}" alt="${skin.weapon} - ${skin.pattern}" />
                <p>${skin.weapon} - ${skin.pattern}</p>
            `;
            skinsDisplay.appendChild(skinElement);
        });
    });

    // Function to fetch crates data
    async function fetchCratesData() {
        const response = await fetch("/api/crates");
        return await response.json();
    }
});

caseDropdown.addEventListener("change", (event) => {
    const selectedCase = event.target.value;
    const skins = data[selectedCase];

    // Clear previous skins
    skinsDisplay.innerHTML = "";

    // Reset scroll position
    skinsDisplay.scrollTop = 0;

    // Display skins in rows of 6
    skins.forEach((skin) => {
        const skinElement = document.createElement("div");
        skinElement.classList.add("skin-item");
        skinElement.innerHTML = `
            <img src="${skin.image}" alt="${skin.weapon} - ${skin.pattern}" />
            <p>${skin.weapon} - ${skin.pattern}</p>
        `;
        skinsDisplay.appendChild(skinElement);
    });
});

document.addEventListener("DOMContentLoaded", async () => {
    const caseDropdown = document.getElementById("caseDropdown");
    const confirmButton = document.getElementById("confirmButton");
    const previewButton = document.getElementById("previewButton");
    const openButton = document.getElementById("openButton");
    const crateImageContainer = document.getElementById("crateImageContainer");
    const randomSkinContainer = document.getElementById("randomSkinContainer");
    const skinsDisplay = document.getElementById("skinsDisplay");

    // Odds for different rarities 
    const rarityOdds = {
        "Consumer Grade": 79.92, // 79.92% chance
        "Industrial Grade": 15.98, // 15.98% chance
        "Mil-Spec": 3.2, // 3.2% chance
        "Restricted": 0.64, // 0.64% chance
        "Classified": 0.26, // 0.26% chance
        "Covert": 0.08, // 0.08% chance
        "Knife": 0.02, // 0.02% chance (extremely rare)
    };

    // Fetch cases and skins data
    const data = await fetchCratesData();

    // Populate the dropdown with crate names
    Object.keys(data).forEach((crateName) => {
        const option = document.createElement("option");
        option.value = crateName;
        option.textContent = crateName;
        caseDropdown.appendChild(option);
    });

    // Show preview and open buttons only when a case is selected
    caseDropdown.addEventListener("change", () => {
        const selectedCase = caseDropdown.value;

        if (selectedCase) {
            previewButton.style.display = "inline-block"; 
            openButton.style.display = "inline-block"; 
        } else {
            previewButton.style.display = "none"; 
            openButton.style.display = "none"; 
        }
    });

    // Handle "Confirm" button click
    confirmButton.addEventListener("click", () => {
        const selectedCase = caseDropdown.value;

        if (!selectedCase) {
            alert("Please select a case first.");
            return;
        }

        // Get the crate image
        const crateImage = data[selectedCase]?.image;

        // Display crate image
        if (crateImage) {
            crateImageContainer.innerHTML = `
                <img src="${crateImage}" alt="${selectedCase}" />
                <p>${selectedCase}</p>
            `;
        } else {
            crateImageContainer.innerHTML = `<p>Image not available for ${selectedCase}</p>`;
        }

        // Clear the random skin container
        randomSkinContainer.innerHTML = "";
    });

    // Handle "Preview" button click
    previewButton.addEventListener("click", () => {
        const selectedCase = caseDropdown.value;

        if (!selectedCase) {
            alert("Please select a case first.");
            return;
        }

        const skins = data[selectedCase]?.skins;

        // Clear previous skins
        skinsDisplay.innerHTML = "";

        // Display all skins in the crate
        skins.forEach((skin) => {
            const skinElement = document.createElement("div");
            skinElement.classList.add("skin-item");
            skinElement.innerHTML = `
                <img src="${skin.image}" alt="${skin.weapon} - ${skin.pattern}" />
                <p>${skin.weapon} - ${skin.pattern}</p>
            `;
            skinsDisplay.appendChild(skinElement);
        });

        // Clear the random skin container
        randomSkinContainer.innerHTML = "";
    });

    // Handle "Open" button click
    openButton.addEventListener("click", async () => {
        const selectedCase = caseDropdown.value;
    
        if (!selectedCase) {
            alert("Please select a case first.");
            return;
        }
    
        const skins = data[selectedCase]?.skins;
    
        if (!skins || skins.length === 0) {
            randomSkinContainer.innerHTML = `<p>No skins available for this crate.</p>`;
            return;
        }
    
        // Select a random skin based on rarity odds
        const randomSkin = getRandomSkinByOdds(skins);
    
        // Clear the crate image and skins grid
        crateImageContainer.innerHTML = "";
        skinsDisplay.innerHTML = "";
    
        // Display the random skin
        randomSkinContainer.innerHTML = `
            <img src="${randomSkin.image}" alt="${randomSkin.weapon} - ${randomSkin.pattern}" />
            <p>${randomSkin.weapon} - ${randomSkin.pattern} (${randomSkin.rarity})</p>
        `;
    
        
        const response = await fetch("/addToCollection", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ skin: randomSkin }),
        });
    
        if (response.ok) {
            alert("Skin added to your collection!");
        } else {
            alert("Failed to add skin to your collection.");
        }
    });

    
    function getRandomSkinByOdds(skins) {
        const weightedSkins = [];

        
        skins.forEach((skin) => {
            const weight = rarityOdds[skin.rarity] || 0;
            for (let i = 0; i < weight * 100; i++) {
                weightedSkins.push(skin);
            }
        });

        
        const randomIndex = Math.floor(Math.random() * weightedSkins.length);
        return weightedSkins[randomIndex];
    }

    
    async function fetchCratesData() {
        const response = await fetch("/api/crates");
        return await response.json();
    }
});