import React, { useState } from "react";
import Dropdown from "../Dropdown/Dropdown";

function Menu() {
  const [dropdownOpen, setDropdownOpen] = useState(false);

  const toggleDropdown = () => {
    setDropdownOpen(!dropdownOpen);
  };

  return (
    <div style={{ marginTop: "20px" }}>
      <h2>Menu</h2>
      <div>
        <button onClick={() => alert("Register Activity")}>Register Activity</button>
      </div>
      <div>
        <button onClick={() => alert("View Activity")}>View Activity</button>
      </div>
      <div style={{ position: "relative", display: "inline-block" }}>
        <button onClick={toggleDropdown}>Self</button>
        {dropdownOpen && <Dropdown />}
      </div>
    </div>
  );
}

export default Menu;
