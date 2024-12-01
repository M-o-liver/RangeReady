import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Select from 'react-select';  // Import react-select
import './StartActivity.css';

function StartActivity() {
  const [rows, setRows] = useState([{ sn: "", name: "", email: "", unit: "" }]);
  const [activity, setActivity] = useState("");
  const [activities, setActivities] = useState([]);
  const [units, setUnits] = useState([]);
  const [ongoingActivities, setOngoingActivities] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [activityTypes, setActivityTypes] = useState([]);
  const [selectedActivityType, setSelectedActivityType] = useState("");
  const navigate = useNavigate();
  const [selectedSN, setSelectedSN] = useState(null);
  const [selectedActivityName, setSelectedActivityName] = useState(null);
  const [setFetchError] = useState(null);

  // Fetch activity options
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
          setActivities(data.data);
        } else {
          console.error("Failed to fetch activities:", data.message);
        }
      })
      .catch((error) => console.error("Error fetching activity options:", error));

    // Fetch unit options
    fetch("https://hackfd-rangeready.ca/api/getUnitOptions", {
      method: "GET",
      headers: {
        "Authorization": "Basic QWRtaW5pc3RyYXRvcjpSYW5nZXJlYWR5ITE=",
      },
    })
      .then((response) => response.json())
      .then((data) => {
        if (data.success) {
          setUnits(data.data);
        } else {
          console.error("Failed to fetch units:", data.message);
        }
      })
      .catch((error) => console.error("Error fetching unit options:", error));

    // Fetch ongoing activity data
    fetch("https://hackfd-rangeready.ca/api/getOnGoingActivity", {
      method: "GET",
      headers: {
        "Authorization": "Basic QWRtaW5pc3RyYXRvcjpSYW5nZXJlYWR5ITE=",
      },
    })
      .then((response) => response.json())
      .then((data) => {
        if (data.success) {
          setOngoingActivities(data.data);
        } else {
          console.error("Failed to fetch ongoing activities:", data.message);
        }
      })
      .catch((error) => console.error("Error fetching ongoing activities:", error));
  }, []);

  const handleAddData = (index) => {
    const activityData = ongoingActivities[index];
    const activityName = activityData.ActivityName;
    const sn = activityData.SN;
    setSelectedSN(sn);
    setSelectedActivityName(activityName);

    const url = `https://hackfd-rangeready.ca/api/getOnGoingActivityType?activityName=${encodeURIComponent(activityName)}`;
  
    fetch(url, {
      method: "GET",
      headers: {
        "Authorization": "Basic QWRtaW5pc3RyYXRvcjpSYW5nZXJlYWR5ITE=",
      },
    })
      .then((response) => response.json())
      .then((data) => {
        if (data.success) {
          setActivityTypes(data.data);
          setShowModal(true);
        } else {
          setFetchError("Failed to fetch activity types");
        }
      })
      .catch((error) => console.error("Error fetching activity types:", error));
  };

  const handleActivityTypeChange = (selectedOption) => {
    setSelectedActivityType(selectedOption ? selectedOption.value : '');
  };

  const handleNext = () => {
    if (!selectedActivityType) {
      alert("Please select an activity type.");
      return;
    }

    navigate("/dot-placement", { state: { sn: selectedSN, activityName: selectedActivityName, activityType: selectedActivityType } });
    setShowModal(false); // Close the modal
  };

  const addRow = () => {
    setRows([...rows, { sn: "", name: "", email: "", unit: "" }]);
  };

  const removeRow = (index) => {
    const newRows = [...rows];
    newRows.splice(index, 1);
    setRows(newRows);
  };

  const handleChange = (index, field, value) => {
    const newRows = [...rows];
    newRows[index][field] = value;
    setRows(newRows);
  };

  const handleSubmit = () => {
    if (!activity) {
      alert("Please select an activity.");
      return;
    }

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
          navigate("/start-activity");
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
        <Select
          options={activities.map(activityOption => ({ value: activityOption.Name, label: activityOption.Name }))}
          onChange={(selectedOption) => setActivity(selectedOption ? selectedOption.value : '')}
          value={activity ? { value: activity, label: activity } : null}
          placeholder="Select Activity"
        />
        <table>
          <thead>
            <tr>
              <th>SN</th>
              <th>Name</th>
              <th>Email</th>
              <th>Unit</th>
              <th>Actions</th>
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
                    onChange={(e) => handleChange(index, "name", e.target.value)}
                  />
                </td>
                <td>
                  <input
                    type="email"
                    value={row.email}
                    onChange={(e) => handleChange(index, "email", e.target.value)}
                  />
                </td>
                <td>
                  <Select
                    options={units.map(unitOption => ({ value: unitOption.Unit, label: unitOption.Unit }))}
                    value={row.unit ? { value: row.unit, label: row.unit } : null}
                    onChange={(selectedOption) => handleChange(index, "unit", selectedOption ? selectedOption.value : '')}
                    placeholder="Select Unit"
                  />
                </td>
                <td>
                  <button onClick={() => removeRow(index)}>Remove</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        <button className="add-row-button" onClick={addRow}>Add Row</button>
        <button className="register-button" onClick={handleSubmit}>Register</button>
      </div>

      {/* Separator */}
      <div className="separator"></div>

      {/* Bottom Section */}
      <div className="ongoing-activity">
        <h2>Ongoing Activity</h2>
        <table className="ongoing-table">
          <thead>
            <tr>
              <th>SN</th>
              <th>Name</th>
              <th>Email</th>
              <th>Unit</th>
              <th>Activity</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {ongoingActivities.map((activity, index) => (
              <tr key={index}>
                <td>{activity.SN}</td>
                <td>{activity.Name}</td>
                <td>{activity.Email}</td>
                <td>{activity.Unit}</td>
                <td>{activity.ActivityName}</td>
                <td>
                  <button className="add-btn" onClick={() => handleAddData(index)}>Add Data</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Modal */}
      {showModal && (
        <div className="modal">
          <div className="modal-content">
            <h3>Select Activity Type</h3>
            <Select
              options={activityTypes.map(type => ({ value: type.Name, label: type.Name }))}
              onChange={handleActivityTypeChange}
              value={selectedActivityType ? { value: selectedActivityType, label: selectedActivityType } : null}
              placeholder="Select Activity Type"
            />
            <button className="next-button" onClick={handleNext}>Next</button>
            <button className="close-button" onClick={() => setShowModal(false)}>Close</button>
          </div>
        </div>
      )}
    </div>
  );
}

export default StartActivity;
