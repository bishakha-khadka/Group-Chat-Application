import axios from "axios";
import React, { useEffect, useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { loginRoute } from "../utils/apiRoutes.js";

const Login = ({ socket }) => {
  const navigate = useNavigate();
  const [values, setValues] = useState({ email: "", password: "" });
  const [error, setError] = useState("");

  useEffect(() => {
    if (localStorage.getItem("currentUser")) {
      navigate("/home");
    }
  }, []);

  const handleChange = (e) => {
    setValues({ ...values, [e.target.name]: e.target.value });
    setError("");
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    const { email, password } = values;

    if (!email || !password) {
      setError("Please fill in all fields.");
      return;
    }

    try {
      const res = await axios.post(loginRoute, {
        email,
        password,
      });
      // const token = res?.data?.result?.token;
      // console.log(token);

      // localStorage.setItem("token", token);
      console.log(res?.data);

      const userInfo = res?.data?.result;
      localStorage.setItem("currentUser", JSON.stringify(userInfo));

      navigate("/home");
    } catch (err) {
      console.error("Login failed:", err.response?.data?.error);
      if (
        err?.response &&
        err?.response?.data &&
        err?.response?.data?.message
      ) {
        setError(err?.response?.data?.message);
      } else {
        setError("Something went wrong. Please try again later.");
      }
    }
  };

  return (
    <div
      style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        height: "100vh",
        backgroundColor: "#f9f9f9",
      }}
    >
      <form
        onSubmit={(e) => handleLogin(e)}
        style={{
          backgroundColor: "#fff",
          padding: "30px",
          borderRadius: "10px",
          boxShadow: "0 5px 15px rgba(0, 0, 0, 0.2)",
          width: "100%",
          maxWidth: "400px",
          textAlign: "center",
        }}
      >
        <h2 style={{ marginBottom: "20px", color: "#333" }}>Login</h2>

        {/* Display error messages */}
        {error && (
          <p
            style={{
              color: "red",
              fontWeight: "bold",
              marginBottom: "15px",
            }}
          >
            {error}
          </p>
        )}

        <input
          type="text"
          placeholder="Email"
          value={values.email}
          name="email"
          onChange={(e) => handleChange(e)}
          style={{
            width: "100%",
            padding: "10px",
            marginBottom: "15px",
            border: "1px solid #ccc",
            borderRadius: "5px",
            fontSize: "1em",
          }}
        />
        <input
          type="password"
          placeholder="Password"
          value={values.password}
          name="password"
          onChange={(e) => handleChange(e)}
          style={{
            width: "100%",
            padding: "10px",
            marginBottom: "20px",
            border: "1px solid #ccc",
            borderRadius: "5px",
            fontSize: "1em",
          }}
        />
        <button
          type="submit"
          style={{
            width: "100%",
            padding: "10px",
            backgroundColor: "#4CAF50",
            color: "#fff",
            border: "none",
            borderRadius: "5px",
            fontSize: "1em",
            cursor: "pointer",
          }}
        >
          Login
        </button>
        <p style={{ marginTop: "15px", fontSize: "0.9em", color: "#555" }}>
          Don't have an account yet?{" "}
          <NavLink
            to="/signup"
            style={{
              color: "#4CAF50",
              textDecoration: "none",
              fontWeight: "bold",
            }}
          >
            Sign Up
          </NavLink>
        </p>
      </form>
    </div>
  );
};

export default Login;
