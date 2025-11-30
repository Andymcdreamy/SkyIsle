import { GoogleGenAI, Type } from "@google/genai";
import { BuildingData, GeminiResponse } from "../types";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export const generateBuildingLore = async (building: BuildingData): Promise<GeminiResponse> => {
  try {
    const prompt = `
      Generate a creative sci-fi status report for a building on a floating space island.
      
      Building Name: ${building.name}
      Base Function: ${building.baseDescription}
      
      The output must be a JSON object with:
      - description: A 2-sentence atmospheric description of current operations.
      - secret: A one-sentence rumor or secret about this building.
      - status: One of 'operational', 'damaged', 'unknown', 'upgrading'.
    `;

    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
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

    const text = response.text;
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