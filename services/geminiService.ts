import { GoogleGenAI, Type } from "@google/genai";
import { BuildingData, GeminiResponse } from "../types";

const apiKey = process.env.API_KEY;
// Only initialize if key exists
const ai = apiKey ? new GoogleGenAI({ apiKey }) : null;

export const generateBuildingLore = async (building: BuildingData): Promise<GeminiResponse> => {
  // Immediate fallback if no AI client
  if (!ai) {
    console.warn("Gemini API Key missing. Using fallback data.");
    return {
      description: `Archives offline (No API Key). Displaying cached data: ${building.baseDescription}`,
      secret: "Connection to colonial database failed. Please configure API_KEY.",
      status: "unknown"
    };
  }

  try {
    const prompt = `
      Generate a creative sci-fi status report for a building on a floating space island.
      
      Building Name: ${building.name}
      Base Description: ${building.baseDescription}
      
      The output must be a JSON object with:
      - description: A 2-sentence atmospheric description of current operations.
      - secret: A one-sentence rumor or secret about this building.
      - status: One of 'operational', 'damaged', 'unknown', 'upgrading'.
    `;

    const response = await ai.models.generateContent({
      model: "gemini-2.0-flash", // Updated model name if applicable, or keep existing
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            description: { type: Type.STRING },
            secret: { type: Type.STRING },
            status: { type: Type.STRING, enum: ['operational', 'damaged', 'unknown', 'upgrading'] }
          },
          required: ["description", "secret", "status"]
        }
      }
    });

    const text = response.text; // Accessing as property, not function
    if (!text) throw new Error("No response from Gemini");

    return JSON.parse(text) as GeminiResponse;

  } catch (error) {
    console.error("Gemini API Error:", error);
    // Fallback if API fails
    return {
      description: `Archives offline. Displaying cached data: ${building.baseDescription}`,
      secret: "Data corruption detected. Unable to retrieve classified intel.",
      status: "unknown"
    };
  }
};