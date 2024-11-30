import React from "react";

function Menu() {
  return (
    <div className="menu">
      <ul>
        <li><button onClick={() => alert("Register Activity")}>Register Activity</button></li>
        <li><button onClick={() => alert("View Activity")}>View Activity</button></li>
        <li>
          <div className="dropdown">
            <select onChange={(e) => alert(`Selected: ${e.target.value}`)}>
              <option value="graph">Graph</option>
              <option value="stats">Stats</option>
            </select>
          </div>
        </li>
      </ul>
    </div>
  );
}

export default Menu;
