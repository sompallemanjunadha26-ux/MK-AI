"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = Login;
const react_1 = require("react");
const react_router_dom_1 = require("react-router-dom");
function Login() {
    const navigate = (0, react_router_dom_1.useNavigate)();
    const [username, setUsername] = (0, react_1.useState)("");
    const [password, setPassword] = (0, react_1.useState)("");
    const handleLogin = () => {
        if (username && password) {
            navigate("/chat");
        }
        else {
            alert("Enter username & password");
        }
    };
    return (<div style={styles.container}>
      <div style={styles.box}>
        <h2>Login - AI Terminal</h2>
        <input placeholder="Username" value={username} onChange={(e) => setUsername(e.target.value)} style={styles.input}/>
        <input type="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} style={styles.input}/>
        <button onClick={handleLogin} style={styles.button}>
          Login
        </button>
      </div>
    </div>);
}
const styles = {
    container: {
        height: "100vh",
        background: "#0f0f0f",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        color: "#00ff88",
        fontFamily: "monospace",
    },
    box: {
        background: "#111",
        padding: "40px",
        border: "1px solid #00ff88",
        borderRadius: "10px",
    },
    input: {
        display: "block",
        marginBottom: "15px",
        padding: "10px",
        width: "250px",
        background: "black",
        color: "#00ff88",
        border: "1px solid #00ff88",
    },
    button: {
        padding: "10px",
        width: "100%",
        background: "#00ff88",
        border: "none",
        cursor: "pointer",
        fontWeight: "bold",
    },
};
