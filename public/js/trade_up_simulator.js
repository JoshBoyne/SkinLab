document.addEventListener("DOMContentLoaded", () => {
    const tradeUpSelectors = document.querySelectorAll(".trade-up-combo");
    const tradeUpButton = document.getElementById("tradeUpButton");
    const clearAllButton = document.getElementById("clearAllButton");
    const tradeUpResult = document.getElementById("tradeUpResult");

    let selectedSkins = []; // To store selected skins for trade-up
    let collection = []; // Collection data

    // Fetch collection data and populate combo boxes
    fetch("/api/collection")
        .then((response) => response.json())
        .then((data) => {
            collection = data;

            tradeUpSelectors.forEach((selector, index) => {
                populateSelector(selector, collection, selectedSkins[index]);

                // Listen for changes in each combo box
                selector.addEventListener("change", () => {
                    const selectedIndex = parseInt(selector.getAttribute("data-index"), 10);
                    const skin = JSON.parse(selector.value);

                    // Update the selected skin for this dropdown
                    selectedSkins[selectedIndex] = skin;

                    // Update all dropdowns to reflect the changes
                    updateSelectors();

                    // Enable the Trade-Up button if 6 skins are selected
                    tradeUpButton.disabled = selectedSkins.filter(Boolean).length !== 6;
                });
            });
        })
        .catch((error) => console.error("Error fetching collection:", error));

    // Populate a selector with available skins, preserving the selected option
    function populateSelector(selector, skins, selectedSkin) {
        selector.innerHTML = `<option value="" disabled ${
            selectedSkin ? "" : "selected"
        }>Select a Skin</option>`;
        skins.forEach((skin) => {
            const option = document.createElement("option");
            option.value = JSON.stringify(skin);
            option.textContent = `${skin.weapon} - ${skin.pattern} (${skin.rarity})`;
            if (selectedSkin && skin.id === selectedSkin.id) {
                option.selected = true; // Preserve the selected skin
            }
            selector.appendChild(option);
        });
    }

    // Update all selectors to exclude already selected skins
    function updateSelectors() {
        const selectedIds = selectedSkins.map((skin) => skin?.id); // Get the IDs of selected skins
        tradeUpSelectors.forEach((selector, index) => {
            const currentSelection = selectedSkins[index]; // Get the current selection for this dropdown
            populateSelector(
                selector,
                collection.filter(
                    (skin) => !selectedIds.includes(skin.id) || skin.id === currentSelection?.id
                ), // Include the currently selected skin
                currentSelection
            );
        });
    }

    // Handle the "Clear All" button click
    clearAllButton.addEventListener("click", () => {
        selectedSkins = []; // Clear selected skins
        tradeUpButton.disabled = true; // Disable Trade-Up button
        tradeUpSelectors.forEach((selector) => (selector.selectedIndex = 0)); // Reset dropdowns
        updateSelectors(); // Refresh dropdowns
    });

    // Handle the "Trade-Up" button click
    tradeUpButton.addEventListener("click", () => {
        if (selectedSkins.filter(Boolean).length === 6) {
            fetch("/api/tradeUp", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ skins: selectedSkins }),
            })
                .then((response) => response.json())
                .then((tradeUpResultData) => {
                    // Clear selections and update result display
                    selectedSkins = [];
                    tradeUpButton.disabled = true;
                    tradeUpSelectors.forEach((selector) => (selector.selectedIndex = 0));
                    updateSelectors();

                    // Display the new skin obtained
                    tradeUpResult.innerHTML = `
                        <h3>You received:</h3>
                        <img src="${tradeUpResultData.image}" alt="${tradeUpResultData.weapon} - ${tradeUpResultData.pattern}" />
                        <p>${tradeUpResultData.weapon} - ${tradeUpResultData.pattern} (${tradeUpResultData.rarity})</p>
                    `;
                })
                .catch((error) => console.error("Error during trade-up:", error));
        }
    });
});