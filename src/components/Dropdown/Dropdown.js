import React from "react";

function Dropdown() {
  return (
    <div
      style={{
        position: "absolute",
        top: "30px",
        right: "0",
        backgroundColor: "#f9f9f9",
        minWidth: "160px",
        boxShadow: "0px 8px 16px 0px rgba(0, 0, 0, 0.2)",
        zIndex: 1,
      }}
    >
      <button onClick={() => alert("Graph")}>Graph</button>
      <button onClick={() => alert("Stats")}>Stats</button>
    </div>
  );
}

export default Dropdown;
