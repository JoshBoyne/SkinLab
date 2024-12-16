document.addEventListener("DOMContentLoaded", async () => {
    const pieChartCanvas = document.getElementById("pieChart");
    const pieChartOptions = document.getElementById("pieChartOptions");

    const data = await fetchSkinsData(); // Fetch skins data dynamically

    const chartData = {
        rarity: countByCategory(data, "rarity"), // Skins by Rarity
        weaponType: countByCategory(data, "weapon"), // Skins by Weapon Type
        case: countByCategory(data, "crate"), // Skins by Case
        weaponRarity: countByWeaponRarity(data), // Skins by Weapon Rarity
    };

    let currentPieChart = createPieChart(pieChartCanvas, chartData.rarity); // Default is "rarity"

    pieChartOptions.addEventListener("change", (event) => {
        const selectedOption = event.target.value;
        currentPieChart.destroy(); // Destroy the old chart
        currentPieChart = createPieChart(pieChartCanvas, chartData[selectedOption]);
    });

    function createPieChart(canvas, data) {
        return new Chart(canvas, {
            type: "pie",
            data: {
                labels: Object.keys(data), // Labels are still required for data alignment
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
                        display: false, // Completely hide the legend
                    },
                    tooltip: {
                        enabled: false, // Disable tooltips
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