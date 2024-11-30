import React from "react";
import './Dropdown.css'; // Import the custom CSS for Dropdown styling

function Dropdown() {
  return (
    <div className="dropdown-container">
      <button className="dropdown-btn" onClick={() => alert("Graph")}>
        Graph
      </button>
      <button className="dropdown-btn" onClick={() => alert("Stats")}>
        Stats
      </button>
    </div>
  );
}

export default Dropdown;
