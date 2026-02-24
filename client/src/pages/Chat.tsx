import { useState } from "react";
import API from "../api";

function Chat() {
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState<
    { role: string; content: string }[]
  >([]);

  const sendMessage = async () => {
    if (!input.trim()) return;

    const newMessages = [
      ...messages,
      { role: "user", content: input },
    ];
    setMessages(newMessages);

    try {
      const response = await API.post("/api/ai", {
        message: input,
      });

      setMessages([
        ...newMessages,
        { role: "assistant", content: response.data.reply },
      ]);
    } catch (error) {
      console.error("API Error:", error);
      setMessages([
        ...newMessages,
        { role: "assistant", content: "Server error." },
      ]);
    }

    setInput("");
  };

  return (
    <div style={{ padding: "20px" }}>
      <h2>AI Terminal</h2>

      <div style={{ minHeight: "300px", marginBottom: "20px" }}>
        {messages.map((msg, index) => (
          <div key={index}>
            <strong>{msg.role}:</strong> {msg.content}
          </div>
        ))}
      </div>

      <input
        type="text"
        value={input}
        onChange={(e) => setInput(e.target.value)}
        placeholder="Type your message"
      />

      <button onClick={sendMessage}>Send</button>
    </div>
  );
}

export default Chat;