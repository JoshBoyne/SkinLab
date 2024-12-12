document.addEventListener("DOMContentLoaded", async () => {
    const barChartCanvas = document.getElementById("barChart");
    const barChartOptions = document.getElementById("barChartOptions");

    const data = await fetchSkinsData(); // Fetch skins data 

    const chartData = {
        weaponType: countByCategory(data, "weapon"),
        rarity: countByCategory(data, "rarity"),
    };

    let currentBarChart = createBarChart(barChartCanvas, chartData.weaponType);

    barChartOptions.addEventListener("change", (event) => {
        const selectedOption = event.target.value;
        currentBarChart.destroy(); 
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
                    y: {
                        beginAtZero: true,
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
});