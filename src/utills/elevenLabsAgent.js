// utils/elevenLabsAgent.js
import axios from "axios";

const ELEVENLABS_API_KEY = "your-api-key";
const AGENT_ID = "your-agent-id";

export const talkToAgent = async (message) => {
  try {
    const response = await axios.post(
      `https://api.elevenlabs.io/v1/agents/${AGENT_ID}/message`,
      {
        text: message,
      },
      {
        headers: {
          "xi-api-key": ELEVENLABS_API_KEY,
          "Content-Type": "application/json",
        },
      }
    );

    return response.data;
  } catch (error) {
    console.error("Error talking to agent:", error.response?.data || error.message);
    throw error;
  }
};
