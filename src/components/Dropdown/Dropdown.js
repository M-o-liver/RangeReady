import React from "react";
import { useNavigate } from "react-router-dom";
import './Dropdown.css'; // Import the custom CSS for Dropdown styling


function Dropdown() {
  const navigate = useNavigate(); // Initialize the navigate function

  const handleGraphClick = () => {
    navigate("/graph");
  };

  const handleStatsClick = () => {
    alert("Feature in development!");
  };

  return (
    <div className="dropdown-container">
      <button className="dropdown-btn" onClick={handleGraphClick}>
        Graph
      </button>
      <button className="dropdown-btn" onClick={handleStatsClick}>
        Stats
      </button>
    </div>
  );
}

export default Dropdown;
