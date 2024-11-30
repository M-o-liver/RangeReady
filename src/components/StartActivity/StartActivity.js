import React, { useState, useEffect } from "react";

function StartActivity() {
  const [rows, setRows] = useState([{ sn: "", name: "", email: "", unit: "" }]); // Default row
  const [activity, setActivity] = useState("");
  const [activities, setActivities] = useState([]); // Store activity options
  const [units, setUnits] = useState([]); // Store unit options
  const [ongoingActivities, setOngoingActivities] = useState([]); // Store ongoing activities
  const [modalOpen, setModalOpen] = useState(false); // To manage popup state
  const [selectedActivity, setSelectedActivity] = useState(""); // To manage selected activity
  const [activityTypes, setActivityTypes] = useState([]); // Store activity types for dropdown

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
          setOngoingActivities(data.data); // Populate ongoing activities
        } else {
          console.error("Failed to fetch ongoing activities:", data.message);
        }
      })
      .catch((error) => console.error("Error fetching ongoing activities:", error));
  }, []);

  // Fetch activity types for the dropdown inside the modal
  const fetchActivityTypes = (activityName) => {
    fetch("https://hackfd-rangeready.ca/api/getOnGoingActivityType", {
      method: "GET",
      headers: {
        "Authorization": "Basic QWRtaW5pc3RyYXRvcjpSYW5nZXJlYWR5ITE=",
      },
    })
      .then((response) => response.json())
      .then((data) => {
        if (data.success) {
          setActivityTypes(data.data); // Populate activity types dropdown
        } else {
          console.error("Failed to fetch activity types:", data.message);
        }
      })
      .catch((error) => console.error("Error fetching activity types:", error));
  };

  // Open the modal and fetch activity types
  const handleAddData = (index) => {
    const activityData = ongoingActivities[index];
    setModalOpen(true); // Open the modal
    setSelectedActivity(activityData.ActivityName); // Set selected activity name
    fetchActivityTypes(activityData.ActivityName); // Fetch activity types for selected activity
  };

  const handleCloseModal = () => {
    setModalOpen(false); // Close the modal
  };

  const handleNext = () => {
    // Handle the logic when Next button is clicked
    console.log("Next button clicked with selected activity:", selectedActivity);
    setModalOpen(false); // Close the modal on "Next"
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
        <table>
          <thead>
            <tr>
              <th>SN</th>
              <th>Name</th>
              <th>Email</th>
              <th>Unit</th>
              <th>Activity Name</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {ongoingActivities.map((activity, index) => (
              <tr key={index}>
                <td>{activity.SN}</td>
                <td>{activity.NAME}</td>
                <td>{activity.EMAIL}</td>
                <td>{activity.UnitName}</td>
                <td>{activity.ActivityName}</td>
                <td>
                  <button onClick={() => handleAddData(index)}>Add Data</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Modal for Activity Data */}
      {modalOpen && (
        <div className="modal">
          <div className="modal-content">
            <h2>Select Activity Type</h2>
            <select>
              <option value="">Select Activity Type</option>
              {activityTypes.map((type, index) => (
                <option key={index} value={type.name}>
                  {type.name}
                </option>
              ))}
            </select>
            <div>
              <button onClick={handleCloseModal}>Close</button>
              <button onClick={handleNext}>Next</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default StartActivity;
