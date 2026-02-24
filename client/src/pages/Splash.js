"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = Splash;
const react_1 = require("react");
const react_router_dom_1 = require("react-router-dom");
function Splash() {
    const navigate = (0, react_router_dom_1.useNavigate)();
    (0, react_1.useEffect)(() => {
        setTimeout(() => {
            navigate("/login");
        }, 3000);
    }, []);
    return (<div style={styles.container}>
      <h1 style={styles.title}>AI TERMINAL</h1>
      <p style={styles.subtitle}>Initializing System...</p>
    </div>);
}
const styles = {
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
