import React, { useState } from "react";
import api from "../../../service/api";
import "./style.css";

function SignedOut() {
  const [isLogin, setIsLogin] = useState(false);
  const [name, setName] = useState("");
  const [nameValid, setNameValid] = useState(true);
  const [number, setNumber] = useState("");
  const [numberValid, setNumberValid] = useState(true);
  const [username, setUsername] = useState("");
  const [usernameValid, setUsernameValid] = useState(true);
  const [password, setPassword] = useState("");
  const [password2, setPassword2] = useState("");
  const [passwordValid, setPasswordValid] = useState(true);
  const [message, setMessage] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage("");
    setUsernameValid(true);
    setNumberValid(true);
    setPasswordValid(true);
    setNameValid(true);

    if (username === "") {
      setUsernameValid(false);
      setMessage("Enter username");
      return;
    }
    if (password === "") {
      setPasswordValid(false);
      setMessage("Enter password");
      return;
    }

    if (isLogin) {
      try {
        const res = await api.post("/login", { username, password });
        if (res.data.status) {
          localStorage.setItem("currentUser", JSON.stringify(res.data));
          window.location.href = "/";
        } else {
          setMessage("Invalid credentials");
          setUsernameValid(false);
          setPasswordValid(false);
        }
      } catch (e) {
        setMessage("Login failed. Please try again.");
        setUsernameValid(false);
        setPasswordValid(false);
      }
    } else {
      if (name === "") {
        setNameValid(false);
        setMessage("Enter Name");
        return;
      }
      if (number === "") {
        setNumberValid(false);
        setMessage("Enter Mobile Number");
        return;
      }
      if (password !== password2) {
        setPasswordValid(false);
        setMessage("Passwords not matching");
        return;
      }
      try {
        const res = await api.post("/register", {
          name,
          number,
          username,
          password,
        });
        if (res.data.status) {
          setMessage("Success! You can login now");
             setTimeout(() => {
             setIsLogin(true);
             setMessage("");
  }, 1500);
        } else if (res.data.type === "username") {
          setUsernameValid(false);
          setMessage("Username already taken");
        } else if (res.data.type === "number") {
          setNumberValid(false);
          setMessage("Number already registered");
        } else {
          setMessage("Registration failed");
        }
      } catch (e) {
        setMessage("Error occurred. Please try again.");
      }
    }
  };

return (
  <div className="auth-container">
    {/* Left Side - Background Image */}
    <div className="auth-left">
      <div className="auth-left-content">
        <h1>LumiRead</h1>
        <p>Track, review, and discover your next favorite book</p>
      </div>
    </div>

    {/* Right Side - Form */}
    <div className="auth-right">
      <div className="auth-form-container">
        <div className="auth-form-header">
          <h2>{isLogin ? "Welcome Back" : "Create Account"}</h2>
          <p>{isLogin ? "Login to your account" : "Enter your details to get started"}</p>
        </div>

        <form onSubmit={handleSubmit} className="auth-form">
          {!isLogin && (
            <div className="form-group">
              <label>Full Name</label>
              <input
                type="text"
                placeholder="John Doe"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className={!nameValid ? "error" : ""}
              />
            </div>
          )}

          {!isLogin && (
            <div className="form-group">
              <label>Mobile Number</label>
              <input
                type="text"
                placeholder="1234567890"
                value={number}
                onChange={(e) => setNumber(e.target.value)}
                className={!numberValid ? "error" : ""}
              />
            </div>
          )}

          <div className="form-group">
            <label>Username</label>
            <input
              type="text"
              placeholder={isLogin ? "Enter your username" : "Choose a username"}
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className={!usernameValid ? "error" : ""}
            />
          </div>

          <div className="form-group">
            <label>Password</label>
            <input
              type="password"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className={!passwordValid ? "error" : ""}
            />
          </div>

          {!isLogin && (
            <div className="form-group">
              <label>Confirm Password</label>
              <input
                type="password"
                placeholder="••••••••"
                value={password2}
                onChange={(e) => setPassword2(e.target.value)}
                className={!passwordValid ? "error" : ""}
              />
            </div>
          )}

          {message && (
            <div className={`message ${message.includes("Success") ? "success" : "error"}`}>
              {message}
            </div>
          )}

          <button type="submit" className="auth-button">
            {isLogin ? "Login" : "Create Account"}
          </button>

 <div className="auth-footer">
  {isLogin ? (
    <p>
      Don't have an account?{" "}
      <span onClick={() => {
        setIsLogin(false);
        setMessage("");
        setName("");
        setNumber("");
        setUsername("");
        setPassword("");
        setPassword2("");
        setNameValid(true);
        setNumberValid(true);
        setUsernameValid(true);
        setPasswordValid(true);
      }}>
        Sign Up
      </span>
    </p>
  ) : (
    <p>
      Already have an account?{" "}
      <span onClick={() => {
        setIsLogin(true);
        setMessage("");
        setUsername("");
        setPassword("");
        setUsernameValid(true);
        setPasswordValid(true);
      }}>
        Login
      </span>
    </p>
  )}
</div>
        </form>
      </div>
    </div>
  </div>
);
}

export default SignedOut;