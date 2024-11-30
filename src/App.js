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
      ) : ( //Horrific, but it's a hackathon!
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
            backgroundColor: '#f5f5f5', 
            padding: '2rem', 
            minHeight: '100vh'
          }}>
            <h1>Welcome, {username}!</h1>
            <Menu />
            <button onClick={handleLogout}>Logout</button>
          </div>
        </div>
      )}
    </div>
  );
}

export default App;
