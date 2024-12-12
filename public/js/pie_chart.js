document.addEventListener("DOMContentLoaded", async () => {
  const pieChartCanvas = document.getElementById("pieChart");
  const pieChartOptions = document.getElementById("pieChartOptions");

  const data = await fetchSkinsData(); // Fetch skins data dynamically

  const chartData = {
      weaponType: countByCategory(data, "weapon"),
      rarity: countByCategory(data, "rarity"),
  };

  let currentPieChart = createPieChart(pieChartCanvas, chartData.weaponType);

  pieChartOptions.addEventListener("change", (event) => {
      const selectedOption = event.target.value;
      currentPieChart.destroy(); // Destroy the old chart
      currentPieChart = createPieChart(pieChartCanvas, chartData[selectedOption]);
  });

  function createPieChart(canvas, data) {
    return new Chart(canvas, {
        type: "pie",
        data: {
            labels: Object.keys(data), // Keep labels for accessibility
            datasets: [
                {
                    data: Object.values(data),
                    backgroundColor: ["#FF6384", "#36A2EB", "#FFCE56", "#4CAF50", "#F44336"],
                },
            ],
        },
        options: {
            plugins: {
                legend: {
                    display: false, // Hide the legend
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