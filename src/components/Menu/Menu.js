import React from "react";
import { Link, useNavigate } from "react-router-dom";
import "./Menu.css";

function Menu({ handleLogout }) {  // Receive handleLogout as prop
  const navigate = useNavigate();

  return (
    <div className="menu-bar">
      <ul className="menu-list">
        <li>
          <Link to="/start-activity">
            <button>Register Activity</button>
          </Link>
        </li>
        <li>
          <button onClick={() => navigate("/")}>View Activity</button>
        </li>
        <li>
          <select onChange={(e) => alert(`Selected: ${e.target.value}`)} className="menu-select">
            <option value="graph">Graph</option>
            <option value="stats">Stats</option>
          </select>
        </li>
        <li>
          <button onClick={handleLogout}>Logout</button>  {}
        </li>
      </ul>
    </div>
  );
}

export default Menu;
