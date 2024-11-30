import React from "react";

function LoginForm({ username, password, setUsername, setPassword, message, handleLogin }) {
  return (
    <div className="container">
      <div className="military-header">
        <h1>RANGE READY</h1>
        <div className="military-subtitle">CANADIAN ARMED FORCES</div>
      </div>
      <form onSubmit={handleLogin}>
        <div className="form-group">
          <label htmlFor="username">SERVICE NUMBER</label>
          <input
            id="username"
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
          />
        </div>
        <div className="form-group">
          <label htmlFor="password">PASSWORD</label>
          <input
            id="password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>
        <button type="submit">LOGIN</button>
      </form>
      {message && <p className="error">{message}</p>}
    </div>
  );
}

export default LoginForm;
