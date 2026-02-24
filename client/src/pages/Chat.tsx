import { useEffect, useRef, useState } from "react";
import axios from "axios";
import "./chat.css";

const API = "http://localhost:5000/api/ai";
const TOKEN_LIMIT = 2000;

export default function Chat() {
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState<any[]>([]);
  const [chatId, setChatId] = useState("chat-" + Date.now());
  const [allChats, setAllChats] = useState<string[]>([]);
  const [typing, setTyping] = useState(false);
  const [totalTokens, setTotalTokens] = useState<number>(0);
  const [listening, setListening] = useState(false);

  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    loadAllChats();
  }, []);

  useEffect(() => {
    loadChatHistory(chatId);
  }, [chatId]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const loadAllChats = async () => {
    const res = await axios.get(`${API}/all-chats`);
    setAllChats(res.data);
  };

  const loadChatHistory = async (id: string) => {
    const res = await axios.get(`${API}/history/${id}`);
    setMessages(res.data);

    const total = res.data.reduce(
      (sum: number, m: any) => sum + (m.tokens || 0),
      0
    );
    setTotalTokens(total);
  };

  const sendMessage = async () => {
    if (!message.trim()) return;

    if (totalTokens >= TOKEN_LIMIT) {
      alert("⚠ Token Limit Reached");
      return;
    }

    setTyping(true);

    const res = await axios.post(API, { message, chatId });

    const newMsg = {
      userMessage: message,
      aiMessage: res.data.reply,
      tokens: res.data.tokens,
    };

    setMessages((prev) => [...prev, newMsg]);
    setTotalTokens((prev) => prev + (res.data.tokens || 0));

    setMessage("");
    setTyping(false);
    loadAllChats();
  };

  const newChat = () => {
    setChatId("chat-" + Date.now());
    setMessages([]);
    setTotalTokens(0);
  };

  const startListening = () => {
    const SpeechRecognition =
      (window as any).webkitSpeechRecognition ||
      (window as any).SpeechRecognition;

    if (!SpeechRecognition) {
      alert("Speech not supported");
      return;
    }

    const recognition = new SpeechRecognition();
    recognition.start();
    setListening(true);

    recognition.onresult = (event: any) => {
      setMessage(event.results[0][0].transcript);
      setListening(false);
    };
  };

  const handleImage = (e: any) => {
    const file = e.target.files[0];
    if (!file) return;
    setMessage(`User uploaded image: ${file.name}`);
  };

  const progress = Math.min((totalTokens / TOKEN_LIMIT) * 100, 100);

  return (
    <div className="layout">
      <div className="sidebar">
        <h2 className="logo">AI Terminal</h2>

        <button className="new-btn" onClick={newChat}>
          + New Chat
        </button>

        <div className="chat-list">
          {allChats.map((id) => (
            <div
              key={id}
              onClick={() => setChatId(id)}
              className={`chat-item ${chatId === id ? "active" : ""}`}
            >
              {id}
            </div>
          ))}
        </div>

        <div className="token-box">
          <h4>Usage</h4>
          <div className="progress-bar">
            <div
              className="progress-fill"
              style={{ width: progress + "%" }}
            ></div>
          </div>
          <p>
            {totalTokens} / {TOKEN_LIMIT}
          </p>
        </div>
      </div>

      <div className="chat-area">
        <div className="header">AI Chat Assistant</div>

        <div className="messages">
          {messages.map((m, i) => (
            <div key={i}>
              <div className="bubble user">{m.userMessage}</div>
              <div className="bubble ai">{m.aiMessage}</div>
            </div>
          ))}

          {typing && <div className="bubble ai typing">AI is typing...</div>}
          <div ref={messagesEndRef}></div>
        </div>

        <div className="input-area">
          <input
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder="Type message..."
          />

          <button onClick={sendMessage}>Send</button>
          <button onClick={startListening}>
            {listening ? "Listening..." : "🎤"}
          </button>
          <input type="file" onChange={handleImage} />
        </div>
      </div>
    </div>
  );
}