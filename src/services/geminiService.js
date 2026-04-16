// MoveSmart — Gemini AI Service
import { GoogleGenerativeAI } from '@google/generative-ai';

const API_KEY = import.meta.env.VITE_GEMINI_API_KEY;

let genAI = null;
let model = null;

function initGemini() {
  if (!API_KEY) return false;
  try {
    genAI = new GoogleGenerativeAI(API_KEY);
    model = genAI.getGenerativeModel({ model: 'gemini-2.0-flash' });
    return true;
  } catch {
    return false;
  }
}

const SYSTEM_PROMPT = `You are MoveSmart AI — a helpful, concise urban mobility assistant. 
You help users with:
- Route suggestions and travel planning
- Safety tips for traveling (especially night travel, women's safety)
- Traffic updates and alternative routes
- General transportation advice for Indian cities

Rules:
- Keep responses short (2-4 sentences max)
- Be friendly and professional
- If asked about routes, suggest practical advice
- Prioritize safety in all recommendations
- Use emojis sparingly for better readability
- If the question is not related to mobility/travel, politely redirect`;

/**
 * Chat with Gemini AI
 */
export async function chatWithAI(userMessage) {
  if (!model && !initGemini()) {
    return getFallbackResponse(userMessage);
  }

  try {
    const prompt = `${SYSTEM_PROMPT}\n\nUser: ${userMessage}\nAssistant:`;
    const result = await model.generateContent(prompt);
    const response = result.response;
    return response.text();
  } catch (error) {
    console.error('Gemini API error:', error);
    return getFallbackResponse(userMessage);
  }
}

/**
 * Get AI route analysis
 */
export async function analyzeRoute(source, destination) {
  if (!model && !initGemini()) {
    return getRouteAnalysisFallback(source, destination);
  }

  try {
    const prompt = `${SYSTEM_PROMPT}

Analyze this route and provide a brief safety & efficiency analysis:
From: ${source}
To: ${destination}

Provide in this exact format:
🛣️ Route Overview: (1 line)
⏱️ Best Time to Travel: (1 line)
🛡️ Safety Tip: (1 line)
💡 Pro Tip: (1 line)`;

    const result = await model.generateContent(prompt);
    return result.response.text();
  } catch (error) {
    console.error('Route analysis error:', error);
    return getRouteAnalysisFallback(source, destination);
  }
}

/**
 * Get daily AI tip
 */
export async function getDailyTip() {
  if (!model && !initGemini()) {
    const tips = [
      "🚦 Peak traffic hours are 8-10 AM and 5-7 PM. Plan your commute accordingly!",
      "🌙 For night travel, always share your live location with a trusted contact.",
      "🧭 AI suggests: Ring Road is 15% faster during evening rush hour.",
      "⚡ Your safety score is excellent! Keep sharing rides with verified contacts.",
      "🎯 Today's tip: Pre-book your routes during off-peak hours for the best experience.",
    ];
    return tips[Math.floor(Math.random() * tips.length)];
  }

  try {
    const prompt = `${SYSTEM_PROMPT}\n\nGenerate one short, practical daily travel/mobility tip for someone in an Indian city. Include an emoji. Keep it under 20 words.`;
    const result = await model.generateContent(prompt);
    return result.response.text();
  } catch {
    return "🧭 Plan your route ahead of time for a smoother, safer commute!";
  }
}

// ---- Fallback responses when API key is not available ----

function getFallbackResponse(message) {
  const msg = message.toLowerCase();

  if (msg.includes('route') || msg.includes('direction') || msg.includes('way')) {
    return "🧭 I'd recommend checking the Routes tab for AI-optimized paths! For the best experience, try traveling during off-peak hours (10 AM - 4 PM).";
  }
  if (msg.includes('safe') || msg.includes('sos') || msg.includes('emergency')) {
    return "🛡️ Your safety matters most! Use the SOS button for emergencies. Always share your live location with trusted contacts, especially during night travel.";
  }
  if (msg.includes('traffic') || msg.includes('delay') || msg.includes('congestion')) {
    return "🚦 Traffic conditions vary throughout the day. I recommend avoiding SG Highway during 9-10 AM and using Ring Road as an alternative during peak hours.";
  }
  if (msg.includes('night') || msg.includes('late') || msg.includes('dark')) {
    return "🌙 For night travel: share your live location, keep emergency contacts ready, and prefer well-lit main roads. Stay safe!";
  }
  if (msg.includes('hello') || msg.includes('hi') || msg.includes('hey')) {
    return "👋 Hello! I'm MoveSmart AI, your mobility assistant. I can help with routes, safety tips, and travel planning. What do you need?";
  }

  return "🚀 I'm MoveSmart AI! I can help with route planning, safety tips, and traffic updates. Try asking me about the best route to your destination!";
}

function getRouteAnalysisFallback(source, destination) {
  return `🛣️ Route Overview: ${source} → ${destination} — Multiple routes available with varying traffic conditions.
⏱️ Best Time to Travel: Off-peak hours (10 AM - 4 PM) for minimal congestion.
🛡️ Safety Tip: Well-lit main roads are recommended, especially for evening travel.
💡 Pro Tip: Save this route for quick access and real-time traffic updates!`;
}

export function isAIAvailable() {
  return !!API_KEY;
}
