import React, { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom"; // Import useLocation and useNavigate

function DotPlacement() {
  const { state } = useLocation(); // Get the state from the router
  const { sn, activityType, activityName } = state || {}; // Destructure sn and activityType from the state
  const [dots, setDots] = useState([]); // Store dot coordinates
  const [selectedActivityType] = useState(activityType || ""); // Store selected activity type from state
  const imageUrl = "./img/Target.jpg";

  const navigate = useNavigate(); // Hook to navigate programmatically

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

  // Submit the data to the API
  const handleSubmit = async () => {
    try {
      const formattedDots = dots.map((dot) => `[${dot[0]}, ${dot[1]}]`).join(", ");
  
      // Fetch the group_size from the external API
      const groupScoreResponse = await fetch(
        "https://spruce.palantircloud.com/function-executor/api/functions/ri.function-registry.main.function.a5be4bde-2de3-4e03-858a-2e1e4ba9a308/versions/0.0.4/executeUntyped",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization:
              "Bearer eyJwbG50ciI6Im41Mi92Z0VUU0ZTYXkvb3VmUEplVnc9PSIsImFsZyI6IkVTMjU2In0.eyJzdWIiOiJDRWI2c3FtUlFyRzBORFZxV1NsdkpRPT0iLCJqdGkiOiJza09EOTdmeVFsV3dmb2o3MGw1bDB3PT0iLCJvcmciOiJNMXQrbFA3Q1FsYXpNSHc3cVV1cnpnPT0ifQ.ctDWRgg2jHrQ3bINX_lZcJCkeEi26amednl3EWwr-YZ0D8NaUYd7T4mtWfNnFDQoH23OxkvyHq2p2Eh2pKyb7w",
          },
          body: JSON.stringify({
            parameters: {
              event: {
                coordinates: JSON.parse(`[${formattedDots}]`), // Convert to array format
                num_clusters: 1,
              },
            },
          }),
        }
      );
  
      const groupScoreData = await groupScoreResponse.json();
  
      // Extract group_size from the response
      const groupSize =
        groupScoreData?.executionResult?.success?.returnValue?.group_size || 0;
  
      // Prepare the data to be sent in the POST request
      const postData = {
        sn, // SN passed from the parent component via navigate state
        activityName,
        activityType: selectedActivityType, // Selected Activity Type
        coordinates: dots, // Coordinates of placed dots
        groupSize, // New field from external API response
      };
  
      console.log("Request Body:", postData);
  
      // Send a POST request to the API
      const response = await fetch("https://hackfd-rangeready.ca/api/insertActivityData", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: "Basic QWRtaW5pc3RyYXRvcjpSYW5nZXJlYWR5ITE=",
        },
        body: JSON.stringify(postData),
      });
  
      const data = await response.json();
  
      // Handle the response (success or failure)
      console.log("Success:", data);
      alert("Activity data submitted successfully!");
      navigate("/start-activity");
    } catch (error) {
      // Handle any errors
      console.error("Error:", error);
      alert("Error submitting activity data.");
      navigate("/start-activity");
    }
  };
  

  // Close the activity page and return to the previous page
  const handleClose = () => {
    navigate(-1); // Go back to the previous page
  };

  return (
    <div className="dot-placement">
      <h2>Click on the image to place dots</h2>

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
        <button onClick={handleClose}>Close</button> {/* Close Button */}
      </div>
    </div>
  );
}

export default DotPlacement;
