import React, { useState, useRef } from "react";

function DotPlacement() {
  const [dots, setDots] = useState([]); // Store dot coordinates
  const imageRef = useRef(null); // Reference to the image element

  const imageUrl = "./img/Target.jpg";

  // Handle dot placement on click
  const handleImageClick = (e) => {
    const rect = imageRef.current.getBoundingClientRect(); // Get the image's bounding box
    const scaleX = rect.width / imageRef.current.naturalWidth; // Scale factor for width
    const scaleY = rect.height / imageRef.current.naturalHeight; // Scale factor for height

    const x = (e.clientX - rect.left) / scaleX; // Calculate x position based on scaling
    const y = (e.clientY - rect.top) / scaleY; // Calculate y position based on scaling

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
          ref={imageRef}
          src={imageUrl}
          alt="Interactive"
          onClick={handleImageClick}
          style={{ width: "50%", height: "auto", cursor: "pointer" }}
        />
        {dots.map((dot, index) => (
          <div
            key={index}
            style={{
              position: "absolute",
              left: dot.x * imageRef.current.naturalWidth - 5,
              top: dot.y * imageRef.current.naturalHeight - 5,
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
