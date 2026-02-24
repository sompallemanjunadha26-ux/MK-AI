import axios from "axios";

const API = axios.create({
  baseURL: "https://mk-ai-74xu.onrender.com",
  headers: {
    "Content-Type": "application/json",
  },
});

export default API;