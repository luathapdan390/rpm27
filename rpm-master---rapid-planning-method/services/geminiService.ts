import { GoogleGenAI, Type, Schema } from "@google/genai";
import { RPMPlan } from "../types";

export const generateRPMPlan = async (tasks: string, goals: string): Promise<RPMPlan> => {
  const apiKey = process.env.API_KEY;
  if (!apiKey) {
    throw new Error("API Key is missing.");
  }

  const ai = new GoogleGenAI({ apiKey });

  const schema: Schema = {
    type: Type.OBJECT,
    properties: {
      categories: {
        type: Type.ARRAY,
        items: {
          type: Type.OBJECT,
          properties: {
            id: { type: Type.STRING },
            name: { type: Type.STRING, description: "Category name (e.g., Cosmic Health, Quantum Wealth)" },
            outcome: { type: Type.STRING, description: "The specific result/goal for this category" },
            purpose: { type: Type.STRING, description: "One compelling sentence on WHY this is important" },
            reasons: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  id: { type: Type.STRING },
                  description: { type: Type.STRING, description: "The powerful reason why." },
                  framework: { 
                    type: Type.STRING, 
                    enum: ['human_needs', 'jungian_libido', 'quantum_economics', 'relativity', 'cosmic_identity', 'taoist_reincarnation'],
                    description: "The philosophical framework this reason is based on."
                  },
                  isBrainstormed: { type: Type.BOOLEAN }
                },
                required: ["id", "description", "framework", "isBrainstormed"]
              }
            }
          },
          required: ["id", "name", "outcome", "purpose", "reasons"]
        }
      },
      dailyTop5Ids: {
        type: Type.ARRAY,
        items: { type: Type.STRING },
        description: "A list of exactly 5 Reason IDs that are the most mind-blowing and urgent to meditate on."
      }
    },
    required: ["categories", "dailyTop5Ids"]
  };

  const prompt = `
    You are an AI with the combined wisdom of Tony Robbins, Carl Jung, Einstein, and an Ancient Taoist Sage.

    User's Input (Brain Dump): "${tasks}"
    User's Goals: "${goals}"

    The user DOES NOT want a standard to-do list. 
    Instead, they want a "Massive Reason Matrix" containing 100 reasons why achieving these outcomes is critical.

    Task:
    1. Organize the input into logical Life Categories.
    2. Define a powerful Outcome for each.
    3. GENERATE A MASSIVE LIST OF REASONS (Aim for 15-25 reasons PER category to approach 100 total) based on these 6 specific lenses:
       
       A) Tony Robbins' 6 Human Needs: Explain how this meets Certainty, Variety, Significance, Connection, Growth, or Contribution.
       B) Carl Jung's Libido & Sublimation: Explain how this channel's sexual energy, solves problems through primal drive, or integrates the Anima/Animus.
       C) Scholder's Quantum Mathematical Economic Principle: Use pseudo-scientific quantum economic jargon. Explain how a small shift here creates infinite value or collapses probability waves into wealth.
       D) Einstein's Relativity: Explain why this is important relative to the speed of light, time dilation, or mass-energy equivalence (E=mc^2).
       E) Cosmic Identity: Frame the reason as if the user is the "Lord of the Universe" or a Divine Being.
       F) Taoist Reincarnation: Explain how this action ripples through 10 future lifetimes or is the culmination of 999,999 past lives.

    4. Prioritize: Select the top 5 most mind-bending reasons for the "Daily Top 5".

    Make the reasons intense, slightly hyperbolic, and extremely motivating.
  `;

  try {
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: schema,
      },
    });

    const text = response.text;
    if (!text) throw new Error("No response from AI");

    return JSON.parse(text) as RPMPlan;
  } catch (error) {
    console.error("Gemini API Error:", error);
    throw error;
  }
};