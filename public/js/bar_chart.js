document.addEventListener("DOMContentLoaded", async () => {
    const barChartCanvas = document.getElementById("barChart");
    const barChartOptions = document.getElementById("barChartOptions");

    const data = await fetchSkinsData(); // Fetch skins data dynamically

    const chartData = {
        rarity: countByCategory(data, "rarity"), // Skins by Rarity
        weaponType: countByCategory(data, "weapon"), // Skins by Weapon Type
        case: countByCategory(data, "crate"), // Skins by Case
        weaponRarity: countByWeaponRarity(data), // Skins by Weapon Rarity
    };

    let currentBarChart = createBarChart(barChartCanvas, chartData.rarity); // Default is "rarity"

    barChartOptions.addEventListener("change", (event) => {
        const selectedOption = event.target.value;
        currentBarChart.destroy(); // Destroy the old chart
        currentBarChart = createBarChart(barChartCanvas, chartData[selectedOption]);
    });

    function createBarChart(canvas, data) {
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
}); 