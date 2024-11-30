import React, { useState } from "react";

function DotPlacement() {
  const [dots, setDots] = useState([]); // Store dot coordinates
  const imageUrl = "./assets/Target.png";

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

  // Submit the dots (send coordinates to the backend or console log)
  const handleSubmit = () => {
    console.log("Submitted dots:", dots);
    // log for now, submit to DB via API later
  };

  return (
    <div className="dot-placement">
      <h2>Click on the image to place dots</h2>
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
              left: dot.x - 5, // Adjust for dot size
              top: dot.y - 5,
              width: "10px",
              height: "10px",
              backgroundColor: "red",
              borderRadius: "50%",
            }}
          />
        ))}
      </div>

      <div className="dot-actions">
        <button onClick={handleUndo}>Undo</button>
        <button onClick={handleSubmit}>Submit</button>
      </div>
    </div>
  );
}

export default DotPlacement;
