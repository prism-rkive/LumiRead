import React, { useState } from "react";
import api from "../../../service/api";
import { useNavigate } from "react-router-dom";
import "./style.css";

function SignedOut() {
  const navigate = useNavigate();

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

  const resetValidation = () => {
    setNameValid(true);
    setNumberValid(true);
    setUsernameValid(true);
    setPasswordValid(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage("");
    resetValidation();

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
        const res = await api.post("/api/user/login", { username, password });

        if (res.data.status) {
          localStorage.setItem("currentUser", JSON.stringify(res.data));
          navigate("/home");
        } else {
          setMessage("Invalid credentials");
          setUsernameValid(false);
          setPasswordValid(false);
        }
      } catch (err) {
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
        const res = await api.post("/api/user/register", {
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
      } catch (err) {
        setMessage("Error occurred. Please try again.");
      }
    }
  };

  return (
    <div className="auth-container">
      {/* LEFT SIDE */}
      <div
        className="auth-left"
        style={{
          backgroundImage: `url(${process.env.PUBLIC_URL}/back.jpg)`,
        }}
      >
        <div className="auth-left-content">
          <h1>LumiRead</h1>
          <p>Track, review, and discover your next favorite book</p>
        </div>
      </div>

      {/* RIGHT SIDE */}
      <div className="auth-right">
        <div className="auth-form-container">
          <div className="auth-form-header">
            <h2>{isLogin ? "Welcome Back" : "Create Account"}</h2>
            <p>
              {isLogin
                ? "Login to your account"
                : "Enter your details to get started"}
            </p>
          </div>

          <form onSubmit={handleSubmit} className="auth-form">
            {!isLogin && (
              <div className="form-group">
                <label>Full Name</label>
                <input
                  type="text"
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
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className={!usernameValid ? "error" : ""}
              />
            </div>

            <div className="form-group">
              <label>Password</label>
              <input
                type="password"
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
                  value={password2}
                  onChange={(e) => setPassword2(e.target.value)}
                  className={!passwordValid ? "error" : ""}
                />
              </div>
            )}

            {message && (
              <div
                className={`message ${
                  message.includes("Success") ? "success" : "error"
                }`}
              >
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
                  <span
                    onClick={() => {
                      setIsLogin(false);
                      setMessage("");
                      setName("");
                      setNumber("");
                      setUsername("");
                      setPassword("");
                      setPassword2("");
                      resetValidation();
                    }}
                  >
                    Sign Up
                  </span>
                </p>
              ) : (
                <p>
                  Already have an account?{" "}
                  <span
                    onClick={() => {
                      setIsLogin(true);
                      setMessage("");
                      setUsername("");
                      setPassword("");
                      resetValidation();
                    }}
                  >
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
