import { useState } from "react";
import API from "../api";
import { useNavigate } from "react-router-dom";

export default function Chat() {
  const navigate = useNavigate();
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState<any[]>([]);
  const [usage, setUsage] = useState(0);
  const [loading, setLoading] = useState(false);

  const send = async () => {
    if (!message) return;

    const token = localStorage.getItem("token");

    setMessages([...messages, { role: "user", content: message }]);
    setLoading(true);

    const res = await API.post(
      "/api/ai",
      { message },
      {
        headers: { Authorization: `Bearer ${token}` },
      }
    );

    setMessages((prev) => [
      ...prev,
      { role: "assistant", content: res.data.reply },
    ]);

    setUsage(res.data.usage);
    setMessage("");
    setLoading(false);
  };

  const logout = () => {
    localStorage.removeItem("token");
    navigate("/");
  };

  return (
    <div style={styles.container}>
      <div style={styles.sidebar}>
        <h2>AI Terminal</h2>
        <button style={styles.newChat}>+ New Chat</button>

        <div style={styles.usageBox}>
          <h4>Usage</h4>
          <div style={styles.bar}>
            <div
              style={{
                ...styles.fill,
                width: `${(usage / 100) * 100}%`,
              }}
            />
          </div>
          <p>{usage} / 100</p>
        </div>

        <button style={styles.logout} onClick={logout}>
          Logout
        </button>
      </div>

      <div style={styles.main}>
        <div style={styles.chatArea}>
          {messages.map((m, i) => (
            <div
              key={i}
              style={{
                alignSelf:
                  m.role === "user" ? "flex-end" : "flex-start",
                background:
                  m.role === "user" ? "#f59e0b" : "#e2e8f0",
                padding: 10,
                borderRadius: 10,
                margin: 5,
                maxWidth: "60%",
              }}
            >
              {m.content}
            </div>
          ))}
          {loading && <div>AI is typing...</div>}
        </div>

        <div style={styles.inputBox}>
          <input
            style={styles.input}
            value={message}
            onChange={(e) => setMessage(e.target.value)}
          />
          <button style={styles.send} onClick={send}>
            Send
          </button>
        </div>
      </div>
    </div>
  );
}

const styles: any = {
  container: { display: "flex", height: "100vh" },
  sidebar: {
    width: 250,
    background: "#1e293b",
    color: "white",
    padding: 20,
    display: "flex",
    flexDirection: "column",
    justifyContent: "space-between",
  },
  newChat: {
    background: "#f59e0b",
    border: "none",
    padding: 10,
    borderRadius: 5,
    marginBottom: 20,
  },
  usageBox: { marginTop: 20 },
  bar: {
    height: 10,
    background: "#334155",
    borderRadius: 5,
    overflow: "hidden",
  },
  fill: {
    height: "100%",
    background: "#f59e0b",
  },
  logout: {
    background: "#ef4444",
    border: "none",
    padding: 10,
    borderRadius: 5,
    color: "white",
  },
  main: { flex: 1, display: "flex", flexDirection: "column" },
  chatArea: {
    flex: 1,
    padding: 20,
    display: "flex",
    flexDirection: "column",
    overflowY: "auto",
    background: "#f1f5f9",
  },
  inputBox: {
    display: "flex",
    padding: 10,
    background: "white",
  },
  input: {
    flex: 1,
    padding: 10,
    borderRadius: 5,
    border: "1px solid #ccc",
  },
  send: {
    marginLeft: 10,
    padding: 10,
    background: "#f59e0b",
    border: "none",
    borderRadius: 5,
  },
};