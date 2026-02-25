import { useState } from "react";
import { http } from "../api/http";
import { useNavigate } from "react-router-dom";

export default function LoginPage() {
  const [email, setEmail] = useState("admin@demo.com");
  const [password, setPassword] = useState("Admin#123");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const navigate = useNavigate();

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");
    setSuccess("");

    try {
      const res = await http.post("/auth/login", { email, password });

      localStorage.setItem("token", res.data.token);
      localStorage.setItem("role", res.data.user.role);
      localStorage.setItem("email", res.data.user.email);


      setSuccess(`Logged in as ${res.data.user.role}`);
      navigate("/admin");
    } catch (err) {
      setError(err?.response?.data?.error || "Login failed");
    }
  }

  return (
    <div style={{ padding: 40 }}>
      <h2>Login</h2>

      <form onSubmit={handleSubmit}>
        <input
          data-testid="login-email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <br /><br />
        <input
          data-testid="login-password"
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <br /><br />
        <button data-testid="login-submit">Login</button>
      </form>

      {success && <p data-testid="login-success">{success}</p>}
      {error && <p data-testid="login-error" style={{ color: "red" }}>{error}</p>}
    </div>
  );
}