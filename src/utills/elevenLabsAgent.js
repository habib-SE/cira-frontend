// src/utils/elevenLabsAgent.js
import axios from "axios";

const ELEVENLABS_API_KEY = "your_elevenlabs_api_key"; // Replace with your actual API key
const AGENT_ID = "agent_01jytk2qhke8nrwt3cs47bqdd4";

export const talkToAgent = async (userInput) => {
  try {
    const response = await axios.post(
      `https://api.elevenlabs.io/v1/agents/${AGENT_ID}`,
      {
        text: userInput,
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
