/*
@Authour Joshua Boyne - Student Number: 23343338
    ---Bar graph js file---
*/

document.addEventListener("DOMContentLoaded", async () => {
    const barChartCanvas = document.getElementById("barChart");
    const barChartOptions = document.getElementById("barChartOptions");

    const data = await fetchSkinsData(); //fetches the skin data

    const chartData = {
        rarity: countByCategory(data, "rarity"), //skins by rarity
        weaponType: countByCategory(data, "weapon"), //skins by weapon type
        case: countByCategory(data, "crate"), //skins by case
        weaponRarity: countByWeaponRarity(data), //skins by weapon rarity
    };

    let currentBarChart = createBarChart(barChartCanvas, chartData.rarity); //the default is "rarity"

    barChartOptions.addEventListener("change", (event) => {
        const selectedOption = event.target.value;
        currentBarChart.destroy(); //gets rid of the old chart
        currentBarChart = createBarChart(barChartCanvas, chartData[selectedOption]);
    });

    function createBarChart(canvas, data) {//creates the chart with the data from the dropdown box
        return new Chart(canvas, {
            type: "bar",
            data: {
                labels: Object.keys(data),
                datasets: [
                    {
                        label: "Number of Skins",
                        data: Object.values(data),
                        backgroundColor: "#36A2EB",
                        borderColor: "#2C88C6",
                        borderWidth: 1,
                    },
                ],
            },
            options: {
                scales: {
                    x: {
                        ticks: { color: "white" },
                        grid: { color: "rgba(255, 255, 255, 0.2)" },
                    },
                    y: {
                        beginAtZero: true,
                        ticks: { color: "white" },
                        grid: { color: "rgba(255, 255, 255, 0.2)" },
                    },
                },
                plugins: {
                    legend: {
                        labels: { color: "white" },
                    },
                },
            },
        });
    }

    async function fetchSkinsData() {//fetches the skin data
        const response = await fetch("/api/skins");
        return await response.json();
    }

    function countByCategory(skins, category) {//counts the skins by the category
        return skins.reduce((acc, skin) => {
            acc[skin[category]] = (acc[skin[category]] || 0) + 1;
            return acc;
        }, {});
    }

    function countByWeaponRarity(skins) {// counts the weapon by their rarity
        return skins.reduce((acc, skin) => {
            const weaponRarityKey = `${skin.weapon} (${skin.rarity})`;
            acc[weaponRarityKey] = (acc[weaponRarityKey] || 0) + 1;
            return acc;
        }, {});
    }
}); 