import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useTable } from "react-table";
import "./StartActivity.css"; // Assume we add some custom CSS for styling

function StartActivity() {
  const [rows, setRows] = useState([{ sn: "", name: "", email: "", unit: "" }]);
  const [activity, setActivity] = useState("");
  const [activities, setActivities] = useState([]);
  const [setUnits] = useState([]);
  const [ongoingActivities, setOngoingActivities] = useState([]);
  const [showModal, setShowModal] = useState(false); 
  const [activityTypes, setActivityTypes] = useState([]); 
  const [selectedActivityType, setSelectedActivityType] = useState(""); 
  const navigate = useNavigate();
  const [selectedSN, setSelectedSN] = useState(null);
  const [selectedActivityName, setSelectedActivityName] = useState(null);

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

  // Fetch activity types when Add Data is clicked
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
          console.error("Failed to fetch activity types:", data.message);
        }
      })
      .catch((error) => console.error("Error fetching activity types:", error));
  };

  const handleActivityTypeChange = (e) => {
    setSelectedActivityType(e.target.value);
  };

  const handleNext = () => {
    navigate("/dot-placement", { state: { sn: selectedSN, activityName: selectedActivityName, activityType: selectedActivityType } });
    setShowModal(false); 
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
          navigate("/start-activity");
        }
      })
      .catch((error) => alert("Error registering activity!"));
  };

  // Columns for Create Activity Table
  const createActivityColumns = React.useMemo(
    () => [
      { Header: "SN", accessor: "sn" },
      { Header: "Name", accessor: "name" },
      { Header: "Email", accessor: "email" },
      { Header: "Unit", accessor: "unit" },
      {
        Header: "Actions",
        accessor: "actions",
        Cell: ({ row }) => (
          <button onClick={() => removeRow(row.index)}>Remove</button>
        ),
      },
    ],
    []
  );

  // Columns for Ongoing Activity Table
  const ongoingActivityColumns = React.useMemo(
    () => [
      { Header: "SN", accessor: "SN" },
      { Header: "Name", accessor: "NAME" },
      { Header: "Email", accessor: "EMAIL" },
      { Header: "Unit", accessor: "UnitName" },
      { Header: "Activity", accessor: "ActivityName" },
      {
        Header: "Actions",
        accessor: "actions",
        Cell: ({ row }) => (
          <button onClick={() => handleAddData(row.index)}>Add Data</button>
        ),
      },
    ],
    []
  );

  // Use react-table hook
  const { getTableProps, getTableBodyProps, headerGroups, rows: createActivityRows, prepareRow } = useTable({
    columns: createActivityColumns,
    data: rows,
  });

  const {
    getTableProps: getOngoingTableProps,
    getTableBodyProps: getOngoingTableBodyProps,
    headerGroups: ongoingHeaderGroups,
    rows: ongoingActivityRows,
    prepareRow: prepareOngoingRow,
  } = useTable({
    columns: ongoingActivityColumns,
    data: ongoingActivities,
  });

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
        <table {...getTableProps()}>
          <thead>
            {headerGroups.map(headerGroup => (
              <tr {...headerGroup.getHeaderGroupProps()}>
                {headerGroup.headers.map(column => (
                  <th {...column.getHeaderProps()}>{column.render("Header")}</th>
                ))}
              </tr>
            ))}
          </thead>
          <tbody {...getTableBodyProps()}>
            {createActivityRows.map(row => {
              prepareRow(row);
              return (
                <tr {...row.getRowProps()}>
                  {row.cells.map(cell => (
                    <td {...cell.getCellProps()}>{cell.render("Cell")}</td>
                  ))}
                </tr>
              );
            })}
          </tbody>
        </table>
        <button onClick={addRow}>Add Row</button>
      </div>

      {/* Ongoing Activity */}
      <div className="ongoing-activity">
        <h2>Ongoing Activity</h2>
        <table {...getOngoingTableProps()}>
          <thead>
            {ongoingHeaderGroups.map(headerGroup => (
              <tr {...headerGroup.getHeaderGroupProps()}>
                {headerGroup.headers.map(column => (
                  <th {...column.getHeaderProps()}>{column.render("Header")}</th>
                ))}
              </tr>
            ))}
          </thead>
          <tbody {...getOngoingTableBodyProps()}>
            {ongoingActivityRows.map(row => {
              prepareOngoingRow(row);
              return (
                <tr {...row.getRowProps()}>
                  {row.cells.map(cell => (
                    <td {...cell.getCellProps()}>{cell.render("Cell")}</td>
                  ))}
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Modal for Activity Types */}
      {showModal && (
        <div className="modal">
          <h3>Select Activity Type</h3>
          <select onChange={handleActivityTypeChange}>
            <option value="">Select Activity Type</option>
            {activityTypes.map((type, index) => (
              <option key={index} value={type}>
                {type}
              </option>
            ))}
          </select>
          <button onClick={handleNext}>Next</button>
        </div>
      )}
    </div>
  );
}

export default StartActivity;
