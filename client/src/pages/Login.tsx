import { useState } from "react";
import API from "../api";
import { useNavigate } from "react-router-dom";

export default function Login() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const login = async () => {
    const res = await API.post("/api/auth/login", { email, password });
    localStorage.setItem("token", res.data.token);
    navigate("/chat");
  };

  const register = async () => {
    await API.post("/api/auth/register", { email, password });
    alert("Registered. Now Login.");
  };

  return (
    <div style={styles.container}>
      <div style={styles.card}>
        <h2>AI Terminal Login</h2>
        <input
          style={styles.input}
          placeholder="Email"
          onChange={(e) => setEmail(e.target.value)}
        />
        <input
          style={styles.input}
          type="password"
          placeholder="Password"
          onChange={(e) => setPassword(e.target.value)}
        />
        <button style={styles.button} onClick={login}>
          Login
        </button>
        <button style={styles.registerBtn} onClick={register}>
          Register
        </button>
      </div>
    </div>
  );
}

const styles: any = {
  container: {
    height: "100vh",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    background: "#0f172a",
  },
  card: {
    background: "#1e293b",
    padding: 40,
    borderRadius: 10,
    width: 350,
    color: "white",
    textAlign: "center",
  },
  input: {
    width: "100%",
    padding: 10,
    margin: "10px 0",
    borderRadius: 5,
    border: "none",
  },
  button: {
    width: "100%",
    padding: 10,
    background: "#f59e0b",
    border: "none",
    borderRadius: 5,
    marginTop: 10,
    cursor: "pointer",
  },
  registerBtn: {
    width: "100%",
    padding: 10,
    background: "#334155",
    border: "none",
    borderRadius: 5,
    marginTop: 10,
    color: "white",
    cursor: "pointer",
  },
};