import React from "react";
import { Link, useNavigate } from "react-router-dom";
import "./Menu.css";

function Menu({ handleLogout }) {
  const navigate = useNavigate();

  // Handle selection change for the dropdown
  const handleSelectChange = (e) => {
    const selectedValue = e.target.value;
    if (selectedValue === "graph") {
      navigate("/graph"); // Navigate to Graph page
    } else if (selectedValue === "stats") {
      alert("Feature in development!"); // Placeholder for Stats functionality
    }
  };

  return (
    <div className="menu-bar">
      <ul className="menu-list">
      <li>
          <Link to="/start-activity">
            <button>Register Activity</button>
          </Link>
        </li>
        <li>
          <Link to="/view-activity">
            <button>View Activity</button> {/* Link to View Activity page */}
          </Link>
        </li>
        <li>
        <select onChange={handleSelectChange} className="menu-select">
            <option value="">
              Graph or Stats
            </option>
            <option value="graph">Graph</option>
            <option value="stats">Stats</option>
          </select>
        </li>
        <li>
          <button onClick={handleLogout}>Logout</button>
        </li>
      </ul>
    </div>
  );
}

export default Menu;
