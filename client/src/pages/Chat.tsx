import { useState, useEffect } from "react";
import API from "../api";

export default function Chat() {
  const [chats, setChats] = useState<any[]>([]);
  const [currentChat, setCurrentChat] = useState<any>(null);
  const [message, setMessage] = useState("");

  const token = localStorage.getItem("token");

  useEffect(() => {
    loadHistory();
  }, []);

  const loadHistory = async () => {
    const res = await API.get("/api/chat/history", {
      headers: { Authorization: `Bearer ${token}` },
    });
    setChats(res.data);
  };

  const newChat = async () => {
    const res = await API.post("/api/chat/new", {}, {
      headers: { Authorization: `Bearer ${token}` },
    });
    setChats([res.data, ...chats]);
    setCurrentChat(res.data);
  };

  const send = async () => {
    const res = await API.post(`/api/ai/${currentChat._id}`,
      { message },
      { headers: { Authorization: `Bearer ${token}` } }
    );

    setCurrentChat({
      ...currentChat,
      messages: [...currentChat.messages, { role:"user",content:message }, { role:"assistant",content:res.data.reply }]
    });

    setMessage("");
  };

  const startVoice = () => {
    const recognition = new (window as any).webkitSpeechRecognition();
    recognition.lang = "en-US";
    recognition.start();
    recognition.onresult = (event: any) => {
      setMessage(event.results[0][0].transcript);
    };
  };

  const uploadFile = async (e:any) => {
    const formData = new FormData();
    formData.append("file", e.target.files[0]);

    await API.post("/api/upload", formData, {
      headers: { Authorization: `Bearer ${token}` },
    });

    alert("File uploaded");
  };

  return (
    <div style={{display:"flex",height:"100vh"}}>
      <div style={{width:250,background:"#1e293b",color:"white",padding:20}}>
        <h2>AI Terminal</h2>
        <button onClick={newChat}>+ New Chat</button>
        {chats.map((c:any)=>(
          <div key={c._id} onClick={()=>setCurrentChat(c)} style={{marginTop:10,cursor:"pointer"}}>
            {c.title}
          </div>
        ))}
      </div>

      <div style={{flex:1,display:"flex",flexDirection:"column"}}>
        <div style={{flex:1,padding:20,overflowY:"auto"}}>
          {currentChat?.messages?.map((m:any,i:number)=>(
            <div key={i} style={{margin:5}}>
              <b>{m.role}:</b> {m.content}
            </div>
          ))}
        </div>

        <div style={{display:"flex",padding:10}}>
          <input style={{flex:1}} value={message} onChange={e=>setMessage(e.target.value)}/>
          <button onClick={send}>Send</button>
          <button onClick={startVoice}>🎤</button>
          <input type="file" onChange={uploadFile}/>
        </div>
      </div>
    </div>
  );
}