import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI } from "@google/genai";
import dotenv from "dotenv";

dotenv.config();

const app = express();
const PORT = 3000;

app.use(express.json());

// Lazy-initialize Gemini client
let aiClient: GoogleGenAI | null = null;
function getGeminiClient(): GoogleGenAI {
  if (!aiClient) {
    const key = process.env.GEMINI_API_KEY;
    if (!key) {
      console.warn("GEMINI_API_KEY environment variable is not defined. Translations will fall back to original text.");
    }
    aiClient = new GoogleGenAI({
      apiKey: key || "MOCK_KEY",
      httpOptions: {
        headers: {
          'User-Agent': 'aistudio-build',
        }
      }
    });
  }
  return aiClient;
}

interface TranslationJob {
  text: string;
  targetLanguage: string;
  resolve: (translated: string) => void;
  reject: (err: Error) => void;
}

// Active batches organized by target language
const translationBatches: Record<string, TranslationJob[]> = {};
const batchTimeoutHandles: Record<string, NodeJS.Timeout> = {};
let apiSuspensionTime = 0;

// Processes batched translations as a single structured Gemini API request to minimize quota footprint
async function processBatch(targetLanguage: string) {
  const jobs = translationBatches[targetLanguage] || [];
  delete translationBatches[targetLanguage];
  if (batchTimeoutHandles[targetLanguage]) {
    clearTimeout(batchTimeoutHandles[targetLanguage]);
    delete batchTimeoutHandles[targetLanguage];
  }

  if (jobs.length === 0) return;

  if (Date.now() < apiSuspensionTime) {
    // API is suspended to respect quota limits. Fall back to original text immediately (and let client translate offline).
    for (const job of jobs) {
      job.resolve(job.text);
    }
    return;
  }

  console.log(`[Translate Batcher] Processing batch of ${jobs.length} strings -> language: ${targetLanguage}`);

  try {
    const key = process.env.GEMINI_API_KEY;
    if (!key) {
      console.warn("[Translate Batcher] WARNING: GEMINI_API_KEY is not defined. Falling back to original text for all jobs.");
      for (const job of jobs) {
        job.resolve(job.text);
      }
      return;
    }

    const ai = getGeminiClient();

    // Map job texts to a JSON payload structure to ensure low token usage and single-query efficiency
    const payload: Record<string, string> = {};
    jobs.forEach((job, idx) => {
      payload[String(idx)] = job.text;
    });

    console.log(`[Translate Batcher] Dispatching 1 batched API request for ${jobs.length} items to Gemini 3.5-flash...`);
    const prompt = `Translate the string values in the following JSON object from English to "${targetLanguage}".

Rules:
1. Translate only the values. Keep keys ("0", "1", "2" etc.) exactly identical.
2. Keep friendly, professional tones and South African casual workspace localisms where appropriate.
3. Output ONLY a valid JSON object. Do NOT wrap the JSON block in markdown backticks or any other markdown text (no \`\`\`json, no preamble, or suffix). Just raw JSON.

INPUT OBJECT:
${JSON.stringify(payload, null, 2)}`;

    const response = await ai.models.generateContent({
      model: "gemini-3.5-flash",
      contents: prompt,
    });

    const responseText = response.text?.trim() || "";
    let cleanJSON = responseText;
    if (cleanJSON.startsWith("```")) {
      cleanJSON = cleanJSON.replace(/^```(json)?/, "").replace(/```$/, "").trim();
    }

    let parsedResult: Record<string, string> = {};
    try {
      parsedResult = JSON.parse(cleanJSON);
      console.log(`[Translate Batcher] Successfully parsed translated JSON batch payload!`);
    } catch (parseError) {
      console.warn("[Translate Batcher] Warning: Failed to parse Gemini response JSON.", parseError);
    }

    // Resolve each individual job with either the translation or the fallback original text
    jobs.forEach((job, idx) => {
      const translatedVal = parsedResult[String(idx)];
      if (translatedVal && typeof translatedVal === "string") {
        job.resolve(translatedVal);
      } else {
        job.resolve(job.text);
      }
    });

  } catch (error: any) {
    const errorStr = String(error?.message || error);
    const isRateLimit = errorStr.includes("429") || errorStr.includes("RESOURCE_EXHAUSTED") || errorStr.includes("quota");

    if (isRateLimit) {
      // Suspend Translate requests to Gemini for 30 minutes to reduce quota pressure and prevent console spam
      apiSuspensionTime = Date.now() + 30 * 60 * 1000;
      console.warn(`[Translate Batcher] 429 Quota Exceeded (Daily/Limit). Suspending Gemini translation API calls for 30 minutes to prevent rate limit noise. Original text will fall back to offline dictionary translations.`);
    } else {
      // Suspend for 1 minute for general transient API errors
      apiSuspensionTime = Date.now() + 60 * 1000;
      console.error("[Translate Batcher] API error caught:", errorStr);
    }

    // Graceful fallback to original text for all jobs so UI stays fully functional
    for (const job of jobs) {
      job.resolve(job.text);
    }
  }
}

// Enqueue individual translation request into the current batch
function enqueueTranslation(text: string, targetLanguage: string): Promise<string> {
  return new Promise((resolve, reject) => {
    if (!translationBatches[targetLanguage]) {
      translationBatches[targetLanguage] = [];
    }

    const existingMatch = translationBatches[targetLanguage].find(j => j.text === text);
    if (existingMatch) {
      const originalResolve = existingMatch.resolve;
      existingMatch.resolve = (val) => {
        originalResolve(val);
        resolve(val);
      };
      return;
    }

    translationBatches[targetLanguage].push({ text, targetLanguage, resolve, reject });

    if (batchTimeoutHandles[targetLanguage]) {
      clearTimeout(batchTimeoutHandles[targetLanguage]);
    }

    // Wait 250ms to bundle multiple parallel React component translation calls
    batchTimeoutHandles[targetLanguage] = setTimeout(() => {
      processBatch(targetLanguage);
    }, 250);
  });
}

// API endpoint for dynamic translations
app.post("/api/translate", async (req: express.Request, res: express.Response) => {
  const { text, targetLanguage } = req.body;

  try {
    if (!text || !targetLanguage) {
      return res.status(400).json({ error: "Missing text or targetLanguage" });
    }

    if (targetLanguage.toLowerCase() === 'english') {
      return res.json({ translatedText: text });
    }

    // Enqueue dynamic translations to avoid concurrent requests exceeding quota
    const translatedText = await enqueueTranslation(text, targetLanguage);
    res.json({ translatedText });
  } catch (error: any) {
    console.warn("[Translate Server] Gracefully handling translation route error:", error);
    // Fallback directly to original text so that standard runtime operations are never broken
    res.json({ translatedText: text });
  }
});

// Vite middleware for development vs static build for production
async function startServer() {
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req: express.Request, res: express.Response) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://0.0.0.0:${PORT}`);
  });
}

startServer();
