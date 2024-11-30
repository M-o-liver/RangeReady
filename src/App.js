import './styles/styles.css';
import React, { useState, useEffect  } from "react";
import LoginForm from "./components/LoginForm/LoginForm";
import Menu from "./components/Menu/Menu";

function App() {
  useEffect(() => {
    document.title = "Range Ready";
  }, []);

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [message, setMessage] = useState("");

  const handleLogin = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch("https://hackfd-rangeready.ca/api/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Basic QWRtaW5pc3RyYXRvcjpSYW5nZXJlYWR5ITE=`, // Horrific, but it's hackaton :P
        },
        body: JSON.stringify({ username, password }),
      });

      if (response.ok) {
        setIsLoggedIn(true);
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
  };

  return (
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
          <h1>Welcome, {username}!</h1>
          <p>You have successfully logged in.</p>
          <button onClick={handleLogout}>Logout</button>
          <Menu />
        </div>
      )}
    </div>
  );
}

export default App;
