import { GoogleGenAI } from "@google/genai";

const ai = new GoogleGenAI({ apiKey: process.env.GENINI_API_KEY || "" });

export default async function geminiAi(prompt, responseJsonSchema) {
    try {
        const response = await ai.models.generateContent({
            model: "gemini-2.5-flash-lite",
            contents: prompt,
            config: {
                responseMimeType: "application/json",
                responseJsonSchema: responseJsonSchema,
            },
        });

        return JSON.parse(response.text);
    } catch (error) {
        // Handle quota exceeded errors
        if (error.status === 429) {
            throw new Error("API quota exceeded. Please wait a few minutes and try again.");
        }

        throw new Error("Failed to generate content. Please try again.");
    }
}
