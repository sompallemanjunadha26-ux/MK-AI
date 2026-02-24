import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

export default function Splash() {
  const navigate = useNavigate();

  useEffect(() => {
    setTimeout(() => {
      navigate("/login");
    }, 3000);
  }, []);

  return (
    <div style={styles.container}>
      <h1 style={styles.title}>AI TERMINAL</h1>
      <p style={styles.subtitle}>Initializing System...</p>
    </div>
  );
}

const styles: any = {
  container: {
    height: "100vh",
    background: "black",
    color: "#00ff88",
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
    fontFamily: "monospace",
  },
  title: {
    fontSize: "48px",
    textShadow: "0 0 20px #00ff88",
  },
  subtitle: {
    marginTop: "20px",
    opacity: 0.7,
  },
};