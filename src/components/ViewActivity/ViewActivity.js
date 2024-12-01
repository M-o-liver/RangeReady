import React, { useState } from "react";

function ViewActivity() {
  const [sn, setSn] = useState(""); // State to store SN input
  const [dots, setDots] = useState([]); // State to store the coordinates (dots)
  const [loading, setLoading] = useState(false); // State to show loading spinner
  const [error, setError] = useState(""); // State for error handling
  const imageUrl = "./img/Target.jpg"; // Image URL for target

  // Handle the SN input change
  const handleSnChange = (e) => {
    setSn(e.target.value);
  };

  // Fetch the coordinates based on the SN
  const handleFetchCoordinates = async () => {
    if (!sn) {
      alert("Please enter a valid SN.");
      return;
    }

    setLoading(true); // Show loading state
    setError(""); // Clear previous error

    try {
        const response = await fetch(`https://hackfd-rangeready.ca/api/getShooter?SN=${sn}`, {
          method: "GET", // Specify GET method
          headers: {
            "Content-Type": "application/json", // Set content type
            Authorization: "Basic QWRtaW5pc3RyYXRvcjpSYW5nZXJlYWR5ITE=", // Authorization header
          },
        });
    
        const data = await response.json();
        if (data.coordinates && Array.isArray(data.coordinates)) {
          setDots(data.coordinates); // Update the dots with fetched coordinates
        } else {
          setError("No coordinates found for this SN.");
          setDots([]); // Reset dots if no data found
        }
      } catch (error) {
        setError("Error fetching data.");
        console.error(error);
      } finally {
        setLoading(false); // Hide loading spinner
      }
    };

  return (
    <div>
      <h1>View Activity</h1>
      <p>Enter the Shooter SN to view the activity coordinates on the target image.</p>

      {/* SN Input field */}
      <div>
        <label htmlFor="sn">SN:</label>
        <input
          type="text"
          id="sn"
          value={sn}
          onChange={handleSnChange}
          placeholder="Enter SN"
        />
        <button onClick={handleFetchCoordinates} disabled={loading}>
          {loading ? "Loading..." : "Fetch Coordinates"}
        </button>
      </div>

      {/* Display Error if there's any */}
      {error && <p style={{ color: "red" }}>{error}</p>}

      {/* Image with coordinates (dots) */}
      <div className="image-container" style={{ position: "relative", marginTop: "20px" }}>
        <img
          src={imageUrl}
          alt="Target"
          style={{ width: "100%", height: "auto", cursor: "pointer" }}
        />
        {dots.map((dot, index) => (
          <div
            key={index}
            style={{
              position: "absolute",
              left: dot.x - 5, // Adjust for dot position
              top: dot.y - 5,
              width: "10px",
              height: "10px",
              backgroundColor: "red",
              borderRadius: "50%",
            }}
          />
        ))}
      </div>
    </div>
  );
}

export default ViewActivity;
