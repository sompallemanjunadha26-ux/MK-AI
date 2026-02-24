import { useState } from "react";
import API from "../api";
import { useNavigate } from "react-router-dom";

function Login() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLogin, setIsLogin] = useState(true);

  const handleSubmit = async () => {
    try {
      const url = isLogin ? "/api/auth/login" : "/api/auth/register";

      const res = await API.post(url, { email, password });

      if (isLogin) {
        localStorage.setItem("token", res.data.token);
        navigate("/chat");
      } else {
        alert("Registered successfully. Now login.");
        setIsLogin(true);
      }
    } catch (err: any) {
      alert(err.response?.data?.message || "Error");
    }
  };

  return (
    <div style={styles.container}>
      <div style={styles.card}>
        <h2>{isLogin ? "Login" : "Register"}</h2>

        <input
          style={styles.input}
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />

        <input
          style={styles.input}
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />

        <button style={styles.button} onClick={handleSubmit}>
          {isLogin ? "Login" : "Register"}
        </button>

        <p
          style={{ cursor: "pointer", marginTop: 10 }}
          onClick={() => setIsLogin(!isLogin)}
        >
          {isLogin
            ? "Don't have an account? Register"
            : "Already have account? Login"}
        </p>
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
    background: "linear-gradient(135deg,#1e3c72,#2a5298)",
  },
  card: {
    background: "white",
    padding: 30,
    borderRadius: 10,
    width: 300,
    textAlign: "center",
  },
  input: {
    width: "100%",
    padding: 10,
    margin: "10px 0",
    borderRadius: 5,
    border: "1px solid #ccc",
  },
  button: {
    width: "100%",
    padding: 10,
    background: "#1e3c72",
    color: "white",
    border: "none",
    borderRadius: 5,
    cursor: "pointer",
  },
};

export default Login;