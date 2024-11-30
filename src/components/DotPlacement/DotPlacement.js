import React, { useState } from "react";
import { useLocation } from "react-router-dom"; // Import useLocation to access passed state

function DotPlacement() {
  const { state } = useLocation(); // Get the state from the router
  const { sn, activityType } = state || {}; // Destructure sn and activityType from the state
  const [dots, setDots] = useState([]); // Store dot coordinates
  const [selectedActivityType, setSelectedActivityType] = useState(activityType || ""); // Store selected activity type from state
  const imageUrl = "./img/Target.jpg";

  // Handle dot placement on click
  const handleImageClick = (e) => {
    const rect = e.target.getBoundingClientRect(); // Get the image's bounding box
    const x = e.clientX - rect.left; // Calculate x position
    const y = e.clientY - rect.top; // Calculate y position
    setDots([...dots, { x, y }]); // Add new dot coordinates
  };

  // Undo the last dot
  const handleUndo = () => {
    setDots(dots.slice(0, -1)); // Remove the last dot
  };

  // Handle Activity Type change from the dropdown
  const handleActivityTypeChange = (e) => {
    setSelectedActivityType(e.target.value);
  };

  // Submit the data to the API
  const handleSubmit = () => {
    // Prepare the data to be sent in the POST request
    const postData = {
      sn, // SN passed from the parent component via navigate state
      activityType: selectedActivityType, // Selected Activity Type
      coordinates: dots, // Coordinates of placed dots
    };

    console.log("Request Body:", postData);

    // Send a POST request to the API
    fetch("https://hackfd-rangeready.ca/api/insertActivityData", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(postData),
    })
      .then((response) => response.json())
      .then((data) => {
        // Handle the response (success or failure)
        console.log("Success:", data);
        alert("Activity data submitted successfully!");
      })
      .catch((error) => {
        // Handle any errors
        console.error("Error:", error);
        alert("Error submitting activity data.");
      });
  };

  return (
    <div className="dot-placement">
      <h2>Click on the image to place dots</h2>

      {/* Activity Type Dropdown */}
      <select
        value={selectedActivityType}
        onChange={handleActivityTypeChange}
        style={{ marginBottom: "10px", padding: "5px" }}
      >
        <option value="">Select Activity Type</option>
        <option value="ActivityType1">Activity Type 1</option>
        <option value="ActivityType2">Activity Type 2</option>
        <option value="ActivityType3">Activity Type 3</option>
        {/* Add more activity types as needed */}
      </select>

      {/* Image and Dot Placement */}
      <div className="image-container" style={{ position: "relative" }}>
        <img
          src={imageUrl}
          alt="Interactive"
          onClick={handleImageClick}
          style={{ width: "100%", height: "auto", cursor: "pointer" }}
        />
        {dots.map((dot, index) => (
          <div
            key={index}
            style={{
              position: "absolute",
              left: dot.x - 5,
              top: dot.y - 5,
              width: "10px",
              height: "10px",
              backgroundColor: "red",
              borderRadius: "50%",
            }}
          />
        ))}
      </div>

      {/* Dot Actions */}
      <div className="dot-actions" style={{ marginTop: "10px" }}>
        <button onClick={handleUndo}>Undo</button>
        <button onClick={handleSubmit}>Submit</button>
      </div>
    </div>
  );
}

export default DotPlacement;
