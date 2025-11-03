import { GoogleGenAI, Modality } from "@google/genai";
import pLimit from "p-limit";
import pRetry from "p-retry";

// This is using Replit's AI Integrations service (blueprint:javascript_gemini_ai_integrations)
// which provides Gemini-compatible API access without requiring your own Gemini API key.
const ai = new GoogleGenAI({
  apiKey: process.env.AI_INTEGRATIONS_GEMINI_API_KEY!,
  httpOptions: {
    apiVersion: "",
    baseUrl: process.env.AI_INTEGRATIONS_GEMINI_BASE_URL!,
  },
});

// Helper function to check if error is rate limit or quota violation
function isRateLimitError(error: any): boolean {
  const errorMsg = error?.message || String(error);
  return (
    errorMsg.includes("429") ||
    errorMsg.includes("RATELIMIT_EXCEEDED") ||
    errorMsg.toLowerCase().includes("quota") ||
    errorMsg.toLowerCase().includes("rate limit")
  );
}

// Generate a single tarot card image
export async function generateTarotCardImage(cardName: string, customPrompt?: string): Promise<string> {
  const prompt = customPrompt || `Cat tarot card illustrations for ${cardName}, ornate border, mystical atmosphere, 2:3 aspect ratio`;

  return await pRetry(
    async () => {
      try {
        const response = await ai.models.generateContent({
          model: "gemini-2.5-flash-image",
          contents: [{ role: "user", parts: [{ text: prompt }] }],
          config: {
            responseModalities: [Modality.TEXT, Modality.IMAGE],
          },
        });

        const candidate = response.candidates?.[0];
        const imagePart = candidate?.content?.parts?.find((part: any) => part.inlineData);

        if (!imagePart?.inlineData?.data) {
          throw new Error("No image data in response");
        }

        const mimeType = imagePart.inlineData.mimeType || "image/png";
        return `data:${mimeType};base64,${imagePart.inlineData.data}`;
      } catch (error: any) {
        if (isRateLimitError(error)) {
          throw error; // Rethrow to trigger p-retry
        }
        // For non-rate-limit errors, abort retrying
        const abortError = new Error(error.message || String(error));
        (abortError as any).name = 'AbortError';
        throw abortError;
      }
    },
    {
      retries: 7,
      minTimeout: 2000,
      maxTimeout: 128000,
      factor: 2,
    }
  );
}

// Generate multiple tarot cards concurrently with rate limiting and retries
export async function batchGenerateTarotCards(
  cardNames: string[]
): Promise<Map<string, string>> {
  const limit = pLimit(2); // Process up to 2 requests concurrently
  const results = new Map<string, string>();

  const processingPromises = cardNames.map((cardName) =>
    limit(async () => {
      try {
        const imageData = await generateTarotCardImage(cardName);
        results.set(cardName, imageData);
        return { cardName, imageData, success: true };
      } catch (error: any) {
        console.error(`Failed to generate ${cardName}:`, error);
        return { cardName, error: error.message, success: false };
      }
    })
  );

  await Promise.all(processingPromises);
  return results;
}
