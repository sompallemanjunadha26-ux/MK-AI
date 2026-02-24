import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

export default function Splash() {
  const navigate = useNavigate();

  useEffect(() => {
    setTimeout(() => {
      navigate("/login");
    }, 2000);
  }, []);

  return (
    <div style={{
      height:"100vh",
      display:"flex",
      justifyContent:"center",
      alignItems:"center",
      background:"#0f172a",
      color:"white",
      fontSize:30
    }}>
      AI Terminal 🚀
    </div>
  );
}