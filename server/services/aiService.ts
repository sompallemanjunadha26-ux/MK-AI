import axios from "axios";

const GROQ_URL = "https://api.groq.com/openai/v1/chat/completions";

export const askGroq = async (message: string) => {
  try {
    const response = await axios.post(
      GROQ_URL,
      {
        model: process.env.GROQ_MODEL,
        messages: [
          { role: "system", content: "You are a helpful AI assistant." },
          { role: "user", content: message }
        ]
      },
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${process.env.GROQ_API_KEY}`
        }
      }
    );

    return {
      reply: response.data.choices[0].message.content,
      source: "groq",
      tokens: response.data.usage?.total_tokens || 0
    };
  } catch (error) {
    throw new Error("Groq failed");
  }
};

export const askOllama = async (message: string) => {
  try {
    const response = await axios.post(
      "http://localhost:11434/api/generate",
      {
        model: process.env.OLLAMA_MODEL,
        prompt: message,
        stream: false
      }
    );

    return {
      reply: response.data.response,
      source: "ollama",
      tokens: 0
    };
  } catch (error) {
    throw new Error("Ollama failed");
  }
};

export const smartAI = async (message: string) => {
  try {
    const groq = await askGroq(message);
    return groq;
  } catch (error) {
    console.log("⚠ Groq failed. Switching to Ollama...");
    const offline = await askOllama(message);
    return offline;
  }
};