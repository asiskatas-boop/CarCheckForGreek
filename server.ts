import express, { Request, Response } from 'express';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import { GoogleGenAI } from '@google/genai';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT ? parseInt(process.env.PORT, 10) : 3000;

app.use(express.json());

// Initialize Gemini SDK with User-Agent header as required by guidelines
const ai = process.env.GEMINI_API_KEY
  ? new GoogleGenAI({
      apiKey: process.env.GEMINI_API_KEY,
      httpOptions: {
        headers: {
          'User-Agent': 'aistudio-build'
        }
      }
    })
  : null;

// API: Conversational Preference Refiner
app.post('/api/chat-refine', async (req: Request, res: Response) => {
  try {
    const { userMessage, currentPreferences } = req.body;

    if (!userMessage) {
      res.status(400).json({ error: 'userMessage is required' });
      return;
    }

    if (ai) {
      try {
        const prompt = `You are CarCheck's senior automotive discovery advisor.
A user is refining their car preferences.
Current User Preferences:
- Budget Range: ${currentPreferences?.budgetId || 'flexible'}
- Primary Usages: ${currentPreferences?.usages?.join(', ') || 'everyday'}
- Priorities: ${currentPreferences?.priorities?.join(', ') || 'reliability, value'}
- Lifestyle: ${currentPreferences?.lifestyle?.join(', ') || 'general'}

The user just requested: "${userMessage}"

Analyze their statement and return a JSON object with:
1. "advisorResponse": A concise, friendly, 2-3 sentence automotive advisor response explaining what you did and why it makes sense. Do not sound like a pushy salesman; be an honest car friend.
2. "action": "update_filters" | "adjust_budget" | "general_advice"
3. "filterOverrides":
   - "bodyStyle": optional string or array of strings (e.g. "Compact SUV", "Hatchback", "Estate / Wagon")
   - "fuelType": optional string or array of strings (e.g. "Electric", "Hybrid", "Petrol", "Diesel")
   - "excludeFuelType": optional string (e.g. "Diesel")
   - "maxPriceEUR": optional number if they asked for cheaper or a specific number
   - "addPriority": optional priority like "performance" | "low-running-costs" | "reliability" | "comfort" | "practicality" | "luxury"
   - "sportyFocus": boolean

Return strictly valid JSON.`;

        const geminiPromise = ai.models.generateContent({
          model: 'gemini-3.8-flash',
          contents: prompt,
          config: {
            responseMimeType: 'application/json'
          }
        });

        const timeoutPromise = new Promise<never>((_, reject) =>
          setTimeout(() => reject(new Error('Gemini timeout')), 4000)
        );

        const response = (await Promise.race([geminiPromise, timeoutPromise])) as any;
        const responseText = response.text || '{}';
        const parsed = JSON.parse(responseText);
        res.json({ success: true, ...parsed });
        return;
      } catch (geminiErr) {
        console.warn('Gemini chat-refine timed out or failed, using heuristic advisor');
      }
    }

    // Heuristic Fallback
    const lower = userMessage.toLowerCase();
    let advisorResponse = "I've updated your recommendations based on your request.";
    const filterOverrides: Record<string, any> = {};

    if (lower.includes('cheaper') || lower.includes('under 15') || lower.includes('less money')) {
      advisorResponse = "Understood. I've narrowed the focus to options with lower purchase prices and rock-bottom running costs.";
      filterOverrides.maxPriceEUR = 18000;
      filterOverrides.addPriority = 'low-running-costs';
    } else if (lower.includes('sport') || lower.includes('faster') || lower.includes('fun')) {
      advisorResponse = "Dialed up the excitement! Prioritizing cars with sharp chassis dynamics, higher horsepower, and lively steering.";
      filterOverrides.addPriority = 'performance';
      filterOverrides.sportyFocus = true;
    } else if (lower.includes('suv')) {
      advisorResponse = "Filtered specifically for SUVs and crossovers with higher ground clearance, commanding visibility, and flexible cargo space.";
      filterOverrides.bodyStyle = ['Compact SUV', 'Mid-size SUV', 'Large SUV', 'Crossover'];
    } else if (lower.includes('diesel') && (lower.includes("don't") || lower.includes('no'))) {
      advisorResponse = "Excluded all diesel powertrains. Highlighting clean petrol, self-charging hybrids, and electric alternatives.";
      filterOverrides.excludeFuelType = 'Diesel';
    } else if (lower.includes('electric') || lower.includes('ev')) {
      advisorResponse = "Switched to pure electric and plug-in vehicles to eliminate fuel station visits and slash per-kilometer running costs.";
      filterOverrides.fuelType = ['Electric', 'Plug-in Hybrid'];
    } else if (lower.includes('luggage') || lower.includes('boot') || lower.includes('space') || lower.includes('practical')) {
      advisorResponse = "Emphasizing vehicles with 500+ liter cargo bays, split-folding rear benches, and family-proof practicality.";
      filterOverrides.addPriority = 'practicality';
      filterOverrides.bodyStyle = ['Estate / Wagon', 'Mid-size SUV', 'Large SUV'];
    } else if (lower.includes('premium') || lower.includes('luxury')) {
      advisorResponse = "Elevated the focus to premium marques featuring acoustic soundproofing, refined suspension, and upscale craftsmanship.";
      filterOverrides.addPriority = 'luxury';
    }

    res.json({
      success: true,
      advisorResponse,
      action: 'update_filters',
      filterOverrides
    });
  } catch (error) {
    console.error('Error in /api/chat-refine:', error);
    res.status(500).json({ error: 'Failed to refine preferences' });
  }
});

// API: Comparison Advisory Synthesis
app.post('/api/compare-advisory', async (req: Request, res: Response) => {
  try {
    const { vehicles, userPreferences } = req.body;

    if (!vehicles || !Array.isArray(vehicles) || vehicles.length === 0) {
      res.status(400).json({ error: 'Vehicles array is required' });
      return;
    }

    if (ai) {
      try {
        const summaryList = vehicles
          .map(
            (v: any) =>
              `- ${v.make} ${v.model} (${v.generation}): ${v.horsepower}hp, ${v.fuelEconomy}, ${v.cargoCapacityLiters}L trunk, Typical price €${v.typicalPriceMin}-€${v.typicalPriceMax}, Reliability ${v.reliabilityRating}/5`
          )
          .join('\n');

        const prompt = `You are CarCheck's automotive advisor. The user is comparing these vehicles:
${summaryList}

The user's stated background:
- Budget: ${userPreferences?.budgetId || 'general'}
- Usages: ${userPreferences?.usages?.join(', ') || 'daily driving'}
- Priorities: ${userPreferences?.priorities?.join(', ') || 'overall balance'}

Provide a personalized comparison conclusion answering:
"Which one should you choose?"
Format your response with:
1. "headline": A 1-sentence bottom-line takeaway.
2. "tradeOffs": 2-3 bullet point summaries comparing their key compromises.
3. "verdict": An honest tailored recommendation for which car fits this specific user best, without pretending one is universally superior in all scenarios.

Return JSON.`;

        const geminiPromise = ai.models.generateContent({
          model: 'gemini-3.8-flash',
          contents: prompt,
          config: {
            responseMimeType: 'application/json'
          }
        });

        const timeoutPromise = new Promise<never>((_, reject) =>
          setTimeout(() => reject(new Error('Gemini timeout')), 4000)
        );

        const response = (await Promise.race([geminiPromise, timeoutPromise])) as any;
        const responseText = response.text || '{}';
        const parsed = JSON.parse(responseText);
        res.json({ success: true, ...parsed });
        return;
      } catch (geminiCompareErr) {
        console.warn('Gemini compare-advisory timed out or failed, using heuristic advisor');
      }
    }

    // Heuristic fallback
    const v1 = vehicles[0];
    const v2 = vehicles[1] || v1;
    res.json({
      success: true,
      headline: `Between the ${v1.make} ${v1.model} and ${v2.make} ${v2.model}, your decision hinges on ${userPreferences?.priorities?.[0] || 'running costs'} versus practicality.`,
      tradeOffs: [
        `The ${v1.make} offers ${v1.reliabilityRating >= 4 ? 'exceptional reliability' : 'nimble performance'} and ${v1.fuelEconomy} efficiency.`,
        `The ${v2.make} counters with ${v2.cargoCapacityLiters}L cargo capacity and strong long-distance composure.`
      ],
      verdict: `If your primary daily usage is ${userPreferences?.usages?.[0] || 'commuting'}, choose the ${v1.make} ${v1.model}. If you frequently carry heavy gear or family passengers, opt for the ${v2.make}.`
    });
  } catch (error) {
    console.error('Error in /api/compare-advisory:', error);
    res.status(500).json({ error: 'Failed to synthesize comparison' });
  }
});

// Serve frontend with Vite middlewares in development
async function startServer() {
  if (process.env.NODE_ENV !== 'production') {
    const { createServer: createViteServer } = await import('vite');
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa'
    });
    app.use(vite.middlewares);
  } else {
    // Production static serving
    app.use(express.static(path.join(__dirname, 'dist')));
    app.get('*', (_req, res) => {
      res.sendFile(path.join(__dirname, 'dist', 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`CarCheck server running on http://0.0.0.0:${PORT}`);
  });
}

startServer();
