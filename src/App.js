import './styles/styles.css';
import React, { useState, useEffect } from "react";
import LoginForm from "./components/LoginForm/LoginForm";
import Menu from "./components/Menu/Menu";
import StartActivity from "./components/StartActivity/StartActivity";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import DotPlacement from "./components/DotPlacement/DotPlacement";
import GraphPage from "./components/GraphPage/GraphPage";
import ViewActivity from "./components/ViewActivity/ViewActivity";

function App() {
  useEffect(() => {
    document.title = "Range Ready";
  }, []);

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [message, setMessage] = useState("");

  // Persist login state on page reload
  useEffect(() => {
    const loggedIn = localStorage.getItem("isLoggedIn");
    if (loggedIn === "true") {
      setIsLoggedIn(true);
    }
  }, []);

  const handleLogin = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch("https://hackfd-rangeready.ca/api/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Basic QWRtaW5pc3RyYXRvcjpSYW5nZXJlYWR5ITE=`, // Very very bad practice but it's hackaton!
        },
        body: JSON.stringify({ username, password }),
      });

      if (response.ok) {
        setIsLoggedIn(true);
        localStorage.setItem("isLoggedIn", "true");  // Save login state in localStorage
      } else {
        const errorData = await response.json();
        setMessage("Login failed: " + (errorData.message || "Invalid credentials"));
      }
    } catch (error) {
      console.error("Error:", error);
      setMessage("Login failed: " + error.message);
    }
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
    setUsername("");
    setPassword("");
    setMessage("");
    localStorage.removeItem("isLoggedIn");  // Remove login state on logout
  };

  return (
    <Router>
      <div style={{ padding: "2rem", textAlign: "center" }}>
        {!isLoggedIn ? (
          <LoginForm 
            username={username} 
            password={password} 
            setUsername={setUsername} 
            setPassword={setPassword} 
            message={message} 
            handleLogin={handleLogin} 
          />
        ) : (
          <div>
            <header style={{
              backgroundColor: '#000',
              color: 'white',
              padding: '1rem',
              marginBottom: '1rem'
            }}>
              <h2>Range Ready</h2>
            </header>
            <div style={{
              backgroundColor: '#02230E',
              padding: '2rem',
              minHeight: '100vh',
              color: '#FFFFFF'
            }}>
              <h1 style={{ color: 'white' }}>Welcome, {username}!</h1>
              <Menu handleLogout={handleLogout} />
              <Routes>
                <Route path="/" element={<Navigate to="/start-activity" />} />
                <Route path="/start-activity" element={<StartActivity />} />
                <Route path="/dot-placement" element={<DotPlacement />} />
                <Route path="/graph" element={<GraphPage />} />
                <Route path="/view-activity" element={<ViewActivity />} />
              </Routes>
            </div>
          </div>
        )}
      </div>
    </Router>
  );
}

export default App;
