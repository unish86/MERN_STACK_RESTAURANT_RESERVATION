import React, { useState } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import { Link, useNavigate } from "react-router-dom";
import { FiLock } from "react-icons/fi";
import { API_BASE_URL } from "../../config/api";

const AdminLogin = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async (event) => {
    event.preventDefault();

    try {
      setLoading(true);
      const { data } = await axios.post(`${API_BASE_URL}/admin/login`, {
        username,
        password
      });

      localStorage.setItem("adminToken", data.token);
      toast.success(data.message);
      navigate("/admin");
    } catch (error) {
      toast.error(error.response?.data?.message || "Admin login failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="adminLoginPage">
      <form className="adminLoginBox" onSubmit={handleLogin}>
        <div className="adminLoginIcon">
          <FiLock />
        </div>
        <p className="adminEyebrow">Private Access</p>
        <h1>Admin Login</h1>
        <input
          type="text"
          placeholder="Username"
          value={username}
          onChange={(event) => setUsername(event.target.value)}
          autoComplete="username"
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(event) => setPassword(event.target.value)}
          autoComplete="current-password"
        />
        <button type="submit" disabled={loading}>
          {loading ? "Checking..." : "Login"}
        </button>
        <Link to="/">Back to Site</Link>
      </form>
    </section>
  );
};

export default AdminLogin;
