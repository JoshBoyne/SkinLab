/*
@Authour Joshua Boyne - Student Number: 23343338
    ---Trade up simulator js file---
    This lets the user perform a trade up with the skins they have in their collection, they will be able to see how many skins they have in
    the "My Collection" page. The user will need to have at least 6 skins in their collection
*/

document.addEventListener("DOMContentLoaded", () => {
    const tradeUpSelectors = document.querySelectorAll(".trade-up-combo");
    const tradeUpButton = document.getElementById("tradeUpButton");
    const clearAllButton = document.getElementById("clearAllButton");
    const tradeUpResult = document.getElementById("tradeUpResult");

    let selectedSkins = []; // stores the selected skins for the tradeup
    let collection = []; // collection of data

    //fetches the the collection of data and populate the combo boxes
    fetch("/api/collection")
        .then((response) => response.json())
        .then((data) => {
            collection = data;

            tradeUpSelectors.forEach((selector, index) => {
                populateSelector(selector, collection, selectedSkins[index]);

                //listens for the changes in each of the combo boxes
                selector.addEventListener("change", () => {
                    const selectedIndex = parseInt(selector.getAttribute("data-index"), 10);
                    const skin = JSON.parse(selector.value);

                    //updates the selected skins for the dropdown
                    selectedSkins[selectedIndex] = skin;

                    //updates all the dropdown boxes to reflect the changes
                    updateSelectors();

                    //enables the tradeup button if 6 skins are selected
                    tradeUpButton.disabled = selectedSkins.filter(Boolean).length !== 6;
                });
            });
        })
        .catch((error) => console.error("Error fetching collection:", error));

    //populates the dropdown with the selected skins and preserves the selected option
    function populateSelector(selector, skins, selectedSkin) {
        selector.innerHTML = `<option value="" disabled ${
            selectedSkin ? "" : "selected"
        }>Select a Skin</option>`;
        skins.forEach((skin) => {
            const option = document.createElement("option");
            option.value = JSON.stringify(skin);
            option.textContent = `${skin.weapon} - ${skin.pattern} (${skin.rarity})`;
            if (selectedSkin && skin.id === selectedSkin.id) {
                option.selected = true; //preserves the selected skin
            }
            selector.appendChild(option);
        });
    }

    //updates all the selectors that will exclude skins that are already selected
    function updateSelectors() {
        const selectedIds = selectedSkins.map((skin) => skin?.id); //gets the id of the selected skin
        tradeUpSelectors.forEach((selector, index) => {
            const currentSelection = selectedSkins[index]; //gets the current selection for the dropdown
            populateSelector(
                selector,
                collection.filter(
                    (skin) => !selectedIds.includes(skin.id) || skin.id === currentSelection?.id
                ), //includes the currently selected skin
                currentSelection
            );
        });
    }

    //"Clear All" button logic
    clearAllButton.addEventListener("click", () => {
        selectedSkins = []; //clear selected skins
        tradeUpButton.disabled = true; //disables the "Trade-Up" button
        tradeUpSelectors.forEach((selector) => (selector.selectedIndex = 0)); //resets the dropdowns
        updateSelectors(); //refreshes the dropdowns
    });

    //"Trade-Up" button logic
    tradeUpButton.addEventListener("click", () => {
        if (selectedSkins.filter(Boolean).length === 6) {
            fetch("/api/tradeUp", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ skins: selectedSkins }),
            })
                .then((response) => response.json())
                .then((tradeUpResultData) => {
                    //clear the selections and updates the results display
                    selectedSkins = [];
                    tradeUpButton.disabled = true;
                    tradeUpSelectors.forEach((selector) => (selector.selectedIndex = 0));
                    updateSelectors();

                    //displays the new skin obtained
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