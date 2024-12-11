document.addEventListener("DOMContentLoaded", () => {
    // Check if the chart canvas exists on the page
    const chartCanvas = document.getElementById("chart");
    if (chartCanvas) {
      // Fetch chart data from the server
      fetch("/api/chart-data")
        .then((response) => {
          if (!response.ok) throw new Error("Failed to fetch chart data");
          return response.json();
        })
        .then((data) => {
          // Render the chart using Chart.js
          const ctx = chartCanvas.getContext("2d");
          new Chart(ctx, {
            type: "bar", // You can change this to 'line', 'pie', etc.
            data: {
              labels: data.labels,
              datasets: [
                {
                  label: "Values",
                  data: data.values,
                  backgroundColor: "rgba(75, 192, 192, 0.2)",
                  borderColor: "rgba(75, 192, 192, 1)",
                  borderWidth: 1,
                },
              ],
            },
            options: {
              responsive: true,
              scales: {
                y: {
                  beginAtZero: true,
                },
              },
            },
          });
        })
        .catch((error) => {
          console.error("Error loading chart data:", error.message);
        });
    }
  });
  