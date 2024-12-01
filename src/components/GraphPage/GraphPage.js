import React, { useState } from "react";
import { Line } from "react-chartjs-2";
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend } from "chart.js";

// Register the chart components
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

function GraphPage() {
  const [sn, setSn] = useState("");  // State for user input (SN)
  const [graphData, setGraphData] = useState(null);  // State for graph data

  // Handle input change
  const handleInputChange = (e) => {
    setSn(e.target.value);
  };

  // Fetch graph data from the API
  const fetchGraphData = async () => {
    if (!sn) {
      alert("Please enter a service number.");
      return;
    }

    try {
        const response = await fetch(`https://hackfd-rangeready.ca/api/getGraphData?SN=${sn}`, {
          method: 'GET',
          headers: {
            "Content-Type": "application/json",
            "Authorization": "Basic QWRtaW5pc3RyYXRvcjpSYW5nZXJlYWR5ITE=",
          },
        });
        
        const data = await response.json();

      if (data.success) {
        // Prepare the data for the chart
        const dates = data.data.map(item => item.createdAt);
        const groupSizes = data.data.map(item => parseInt(item.GroupScore, 10));

        const chartData = {
          labels: dates,
          datasets: [
            {
              label: 'Group Size',
              data: groupSizes,
              borderColor: 'rgba(75, 192, 192, 1)',
              backgroundColor: 'rgba(75, 192, 192, 0.2)',
              fill: true,
            },
          ],
        };

        setGraphData(chartData);  // Update the state with the graph data
      } else {
        alert("No data available for the provided SN.");
      }
    } catch (error) {
      console.error("Error fetching graph data:", error);
      alert("An error occurred while fetching data.");
    }
  };

  return (
    <div>
      <h1>Graph Page</h1>
      <p>This is where the Graph will be displayed.</p>

      {/* Input field to capture the SN */}
      <div>
        <input
          type="text"
          value={sn}
          onChange={handleInputChange}
          placeholder="Enter Service Number (SN)"
        />
        <button onClick={fetchGraphData}>Generate Graph</button>
      </div>

      {/* Display the graph if data is available */}
      {graphData ? (
        <div style={{ marginTop: "20px" }}>
          <Line data={graphData} />
        </div>
      ) : null}
    </div>
  );
}

export default GraphPage;
