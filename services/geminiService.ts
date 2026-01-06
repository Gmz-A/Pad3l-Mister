
import { GoogleGenAI, Type, GenerateContentResponse } from "@google/genai";
import { ShotType, AnalysisResult } from "../types";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export const analyzePadelVideo = async (
  videoBase64: string,
  mimeType: string,
  shotType: ShotType
): Promise<AnalysisResult> => {
  const model = "gemini-3-flash-preview";
  
  const prompt = `Actúa como un entrenador profesional de pádel de nivel World Padel Tour. 
  Analiza este vídeo de un jugador realizando un/a "${shotType}". 
  Debes evaluar específicamente:
  1. Posición del cuerpo y juego de pies (split step, ajuste).
  2. Preparación de la pala (armado).
  3. Punto de impacto (altura, delante del cuerpo).
  4. Terminación y recuperación.

  Proporciona una respuesta en formato JSON estructurado con:
  - pros: lista de puntos fuertes.
  - cons: lista de fallos técnicos encontrados.
  - drills: 3 ejercicios específicos para mejorar este golpe.
  - overallScore: una nota del 1 al 10.
  - coachFeedback: un resumen motivador y técnico.`;

  // Fix: Adjusted contents structure to be a single Content object as per guidelines
  const response = await ai.models.generateContent({
    model,
    contents: {
      parts: [
        { inlineData: { data: videoBase64, mimeType } },
        { text: prompt }
      ]
    },
    config: {
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          pros: { type: Type.ARRAY, items: { type: Type.STRING } },
          cons: { type: Type.ARRAY, items: { type: Type.STRING } },
          drills: { type: Type.ARRAY, items: { type: Type.STRING } },
          overallScore: { type: Type.NUMBER },
          coachFeedback: { type: Type.STRING }
        },
        required: ["pros", "cons", "drills", "overallScore", "coachFeedback"]
      }
    }
  });

  if (!response.text) {
    throw new Error("No se pudo obtener el análisis del vídeo.");
  }

  return JSON.parse(response.text) as AnalysisResult;
};

export const getDailyAdvice = async (history: any[]): Promise<string> => {
  const model = "gemini-3-flash-preview";
  const prompt = `Basado en este historial de entrenamiento: ${JSON.stringify(history)}. 
  Dame un consejo corto (máximo 2 frases) para el entrenamiento de hoy de un jugador de pádel que quiere mejorar.`;
  
  const response = await ai.models.generateContent({
    model,
    contents: prompt
  });
  
  return response.text || "¡Hoy es un gran día para entrenar tu bandeja!";
};
