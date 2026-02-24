import { useState } from "react";
import API from "../api";

function Chat() {
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  const sendMessage = async () => {
    if (!message) return;

    const token = localStorage.getItem("token");

    setMessages([...messages, { role: "user", content: message }]);
    setLoading(true);

    try {
      const res = await API.post(
        "/api/ai",
        { message },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setMessages((prev) => [
        ...prev,
        { role: "assistant", content: res.data.reply },
      ]);
    } catch {
      alert("AI Error");
    }

    setMessage("");
    setLoading(false);
  };

  return (
    <div style={styles.container}>
      <div style={styles.chatBox}>
        {messages.map((msg, i) => (
          <div
            key={i}
            style={{
              ...styles.message,
              alignSelf:
                msg.role === "user" ? "flex-end" : "flex-start",
              background:
                msg.role === "user" ? "#1e3c72" : "#eee",
              color: msg.role === "user" ? "white" : "black",
            }}
          >
            {msg.content}
          </div>
        ))}

        {loading && <div style={styles.typing}>AI is typing...</div>}
      </div>

      <div style={styles.inputBox}>
        <input
          style={styles.input}
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder="Type message..."
        />
        <button style={styles.sendBtn} onClick={sendMessage}>
          Send
        </button>
      </div>
    </div>
  );
}

const styles: any = {
  container: {
    height: "100vh",
    display: "flex",
    flexDirection: "column",
    background: "#f4f6f9",
  },
  chatBox: {
    flex: 1,
    padding: 20,
    display: "flex",
    flexDirection: "column",
    gap: 10,
    overflowY: "auto",
  },
  message: {
    padding: 10,
    borderRadius: 10,
    maxWidth: "60%",
  },
  typing: {
    fontStyle: "italic",
    color: "gray",
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
  sendBtn: {
    marginLeft: 10,
    padding: 10,
    background: "#1e3c72",
    color: "white",
    border: "none",
    borderRadius: 5,
  },
};

export default Chat;