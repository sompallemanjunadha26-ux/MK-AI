import axios from "axios";

const API = axios.create({
  baseURL:
    import.meta.env.VITE_API_URL ||
    "https://mk-ai-74xu.onrender.com",
});

export default API;