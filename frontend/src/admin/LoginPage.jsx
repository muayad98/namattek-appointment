import { useState } from "react";
import axios from "axios";

export default function LoginPage({ onLogin }) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    const { username, password } = e.target;
    try {
      const res = await axios.post("http://127.0.0.1:8000/auth/login", {
        username: username.value,
        password: password.value,
      });
      localStorage.setItem("token", res.data.token);
      onLogin();
    } catch {
      setError("Invalid credentials");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ marginTop: 100, textAlign: "center" }}>
      <h2>Admin Login</h2>
      <form onSubmit={handleSubmit}>
        <input name="username" placeholder="User" required />
        <br />
        <input name="password" type="password" placeholder="Password" required />
        <br />
        <button disabled={loading}>{loading ? "…" : "Login"}</button>
      </form>
      {error && <p style={{ color: "red" }}>{error}</p>}
    </div>
  );
}
