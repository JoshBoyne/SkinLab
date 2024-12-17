/*
@Authour Joshua Boyne - Student Number: 23343338
    ---Pie chart js file---
*/

document.addEventListener("DOMContentLoaded", async () => {
    const pieChartCanvas = document.getElementById("pieChart");
    const pieChartOptions = document.getElementById("pieChartOptions");

    const data = await fetchSkinsData(); // fetches skin data

    const chartData = {
        rarity: countByCategory(data, "rarity"), // Skins by rarity
        weaponType: countByCategory(data, "weapon"), // Skins by weapon type
        case: countByCategory(data, "crate"), // Skins by case
        weaponRarity: countByWeaponRarity(data), // Skins by weapon rarity
    };

    let currentPieChart = createPieChart(pieChartCanvas, chartData.rarity); // Default is "rarity"

    pieChartOptions.addEventListener("change", (event) => {
        const selectedOption = event.target.value;
        currentPieChart.destroy(); // gets rid of old chart
        currentPieChart = createPieChart(pieChartCanvas, chartData[selectedOption]);
    });
/* We referenced Abduls notes for this section 
 */
    function createPieChart(canvas, data) {//creates chart with data from dropdown box
        return new Chart(canvas, {
            type: "pie",
            data: {
                labels: Object.keys(data),
                datasets: [
                    {
                        data: Object.values(data),
                        backgroundColor: generateRandomColors(Object.keys(data).length),
                    },
                ],
            },
            options: {
                plugins: {
                    legend: {
                        display: false, 
                    },
                    tooltip: {
                        enabled: true, // Enable tooltips
                        callbacks: {
                            label: (tooltipItem) => {
                                const label = tooltipItem.label || "";
                                const value = tooltipItem.raw || 0;
                                return `${label}: ${value}`; 
                            },
                        },
                    },
                },
            },
        });
    }

    async function fetchSkinsData() {
        const response = await fetch("/api/skins");
        return await response.json();
    }

    function countByCategory(skins, category) {
        return skins.reduce((acc, skin) => {
            acc[skin[category]] = (acc[skin[category]] || 0) + 1;
            return acc;
        }, {});
    }

    function countByWeaponRarity(skins) {
        return skins.reduce((acc, skin) => {
            const weaponRarityKey = `${skin.weapon} (${skin.rarity})`;
            acc[weaponRarityKey] = (acc[weaponRarityKey] || 0) + 1;
            return acc;
        }, {});
    }

    function generateRandomColors(count) {
        const colors = [];
        for (let i = 0; i < count; i++) {
            const r = Math.floor(Math.random() * 255);
            const g = Math.floor(Math.random() * 255);
            const b = Math.floor(Math.random() * 255);
            colors.push(`rgba(${r}, ${g}, ${b}, 0.6)`);
        }
        return colors;
    }
});