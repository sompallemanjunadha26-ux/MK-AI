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
    alert("Registered");
  };

  return (
    <div style={{height:"100vh",display:"flex",justifyContent:"center",alignItems:"center",background:"#0f172a"}}>
      <div style={{background:"#1e293b",padding:40,borderRadius:10,width:350,color:"white"}}>
        <h2>AI Terminal</h2>
        <input style={{width:"100%",padding:10,margin:"10px 0"}} placeholder="Email" onChange={e=>setEmail(e.target.value)}/>
        <input style={{width:"100%",padding:10,margin:"10px 0"}} type="password" placeholder="Password" onChange={e=>setPassword(e.target.value)}/>
        <button style={{width:"100%",padding:10,background:"#f59e0b",border:"none"}} onClick={login}>Login</button>
        <button style={{width:"100%",padding:10,background:"#334155",border:"none",marginTop:10,color:"white"}} onClick={register}>Register</button>
      </div>
    </div>
  );
}