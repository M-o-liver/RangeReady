import React, { useState, useEffect } from "react";

function StartActivity() {
  const [rows, setRows] = useState([{ sn: "", name: "", email: "", unit: "" }]); // Default row
  const [activity, setActivity] = useState("");
  const [activities, setActivities] = useState([]); // Store activity options
  const [units, setUnits] = useState([]); // Store unit options

  // Fetch activity options when component mounts
  useEffect(() => {
    fetch("https://hackfd-rangeready.ca/api/getActivitiesOptions", {
      method: "GET",
      headers: {
        "Authorization": "Basic QWRtaW5pc3RyYXRvcjpSYW5nZXJlYWR5ITE=",
      },
    })
      .then((response) => response.json())
      .then((data) => {
        if (data.success) {
          setActivities(data.data); // Populate activity options
        } else {
          console.error("Failed to fetch activities:", data.message);
        }
      })
      .catch((error) => console.error("Error fetching activity options:", error));
    
    // Fetch unit options when component mounts
    fetch("https://hackfd-rangeready.ca/api/getUnitOptions", {
      method: "GET",
      headers: {
        "Authorization": "Basic QWRtaW5pc3RyYXRvcjpSYW5nZXJlYWR5ITE=",
      },
    })
      .then((response) => response.json())
      .then((data) => {
        if (data.success) {
          setUnits(data.data); // Populate unit options
        } else {
          console.error("Failed to fetch units:", data.message);
        }
      })
      .catch((error) => console.error("Error fetching unit options:", error));
  }, []);

  const addRow = () => {
    setRows([...rows, { sn: "", name: "", email: "", unit: "" }]);
  };

  const removeRow = (index) => {
    const newRows = [...rows];
    newRows.splice(index, 1); // Remove the row at the given index
    setRows(newRows);
  };

  const handleChange = (index, field, value) => {
    const newRows = [...rows];
    newRows[index][field] = value;
    setRows(newRows);
  };

  const handleSubmit = () => {
    // Basic validation to ensure activity and rows are filled
    if (!activity) {
      alert("Please select an activity.");
      return;
    }

    // Ensure each row has valid values for sn, name, email, and unit
    for (let i = 0; i < rows.length; i++) {
      const { sn, name, email, unit } = rows[i];
      if (!sn || !name || !email || !unit) {
        alert("Please fill out all fields in each row.");
        return;
      }
    }

    const data = {
      activity,
      rows: rows.map(row => ({
        ...row,
        unit: row.unit.split(" ")[0],
      })),
    };

    fetch("https://hackfd-rangeready.ca/api/registerActivity", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": "Basic QWRtaW5pc3RyYXRvcjpSYW5nZXJlYWR5ITE=",
      },
      body: JSON.stringify(data),
    })
      .then((response) => response.json())
      .then((data) => {
        if (data.success) {
          alert("Activity Registered Successfully!");
        } else {
          alert("Error registering activity: " + data.message);
        }
      })
      .catch((error) => alert("Error registering activity!"));
  };

  return (
    <div className="start-activity">
      {/* Top Section */}
      <div className="create-activity">
        <h2>Create Activity</h2>
        <select onChange={(e) => setActivity(e.target.value)} value={activity}>
          <option value="">Select Activity</option>
          {activities.map((activityOption, index) => (
            <option key={index} value={activityOption.Name}>
              {activityOption.Name}
            </option>
          ))}
        </select>
        <table>
          <thead>
            <tr>
              <th>SN</th>
              <th>Name</th>
              <th>Email</th>
              <th>Unit</th>
              <th>Actions</th> {/* Added column for actions */}
            </tr>
          </thead>
          <tbody>
            {rows.map((row, index) => (
              <tr key={index}>
                <td>
                  <input
                    type="text"
                    value={row.sn}
                    onChange={(e) => handleChange(index, "sn", e.target.value)}
                  />
                </td>
                <td>
                  <input
                    type="text"
                    value={row.name}
                    onChange={(e) =>
                      handleChange(index, "name", e.target.value)
                    }
                  />
                </td>
                <td>
                  <input
                    type="email"
                    value={row.email}
                    onChange={(e) =>
                      handleChange(index, "email", e.target.value)
                    }
                  />
                </td>
                <td>
                  <select
                    value={row.unit}
                    onChange={(e) => handleChange(index, "unit", e.target.value)}
                  >
                    <option value="">Select Unit</option>
                    {units.map((unitOption, index) => (
                      <option key={index} value={unitOption.Unit}>
                        {unitOption.Unit}
                      </option>
                    ))}
                  </select>
                </td>
                <td>
                  {/* Remove button */}
                  <button onClick={() => removeRow(index)}>Remove</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        <button onClick={addRow}>Add Row</button>
        <button onClick={handleSubmit}>Register</button>
      </div>

      {/* Bottom Section */}
      <div className="ongoing-activity">
        <h2>Ongoing Activity</h2>
        {/* Fetch and display ongoing activity here */}
      </div>
    </div>
  );
}

export default StartActivity;
