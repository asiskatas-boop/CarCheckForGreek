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
    const { userMessage, currentPreferences, marketRegion } = req.body;
    const isGreek = marketRegion === 'greece' || currentPreferences?.marketRegion === 'greece';

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

${isGreek ? 'Reply in natural modern Greek. Keep car model names and technical units unchanged.' : 'Reply in English.'}

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
    let advisorResponse = isGreek ? 'Ενημέρωσα τις προτάσεις με βάση το αίτημά σου.' : "I've updated your recommendations based on your request.";
    const filterOverrides: Record<string, any> = {};

    if (lower.includes('cheaper') || lower.includes('under 15') || lower.includes('less money') || lower.includes('φθην') || lower.includes('κάτω από')) {
      advisorResponse = isGreek ? 'Περιορίζω τις επιλογές σε χαμηλότερη τιμή αγοράς και μικρότερο κόστος χρήσης.' : "Understood. I've narrowed the focus to options with lower purchase prices and low running costs.";
      filterOverrides.maxPriceEUR = 18000;
      filterOverrides.addPriority = 'low-running-costs';
    } else if (lower.includes('sport') || lower.includes('faster') || lower.includes('fun') || lower.includes('σπορ') || lower.includes('γρήγορ')) {
      advisorResponse = isGreek ? 'Δίνω περισσότερο βάρος σε επιδόσεις, απόκριση και οδηγική αίσθηση.' : 'Prioritizing sharper chassis dynamics, higher performance, and lively steering.';
      filterOverrides.addPriority = 'performance';
      filterOverrides.sportyFocus = true;
    } else if (lower.includes('suv')) {
      advisorResponse = isGreek ? 'Φιλτράρω για SUV και crossover με ψηλότερη θέση οδήγησης και πρακτικούς χώρους.' : 'Filtered for SUVs and crossovers with higher seating positions and flexible cargo space.';
      filterOverrides.bodyStyle = ['Compact SUV', 'Mid-size SUV', 'Large SUV', 'Crossover'];
    } else if ((lower.includes('diesel') || lower.includes('ντίζελ')) && (lower.includes("don't") || lower.includes('no') || lower.includes('δεν') || lower.includes('όχι'))) {
      advisorResponse = isGreek ? 'Αφαιρώ τα diesel και κρατώ βενζίνη, υβριδικά και ηλεκτρικά.' : 'Excluded diesel powertrains and kept petrol, hybrid, and electric alternatives.';
      filterOverrides.excludeFuelType = 'Diesel';
    } else if (lower.includes('electric') || lower.includes('ev') || lower.includes('ηλεκτρ')) {
      advisorResponse = isGreek ? 'Εστιάζω σε αμιγώς ηλεκτρικά και plug-in hybrid, με προσοχή σε φόρτιση και πραγματική χρήση.' : 'Switched the focus to electric and plug-in hybrid vehicles, with charging and daily use in mind.';
      filterOverrides.fuelType = ['Electric', 'Plug-in Hybrid'];
    } else if (lower.includes('luggage') || lower.includes('boot') || lower.includes('space') || lower.includes('practical') || lower.includes('πορτ') || lower.includes('χώρ') || lower.includes('πρακτικ')) {
      advisorResponse = isGreek ? 'Δίνω προτεραιότητα σε μεγαλύτερο χώρο αποσκευών και πιο πρακτικές οικογενειακές επιλογές.' : 'Emphasizing larger cargo areas and more practical family-friendly options.';
      filterOverrides.addPriority = 'practicality';
      filterOverrides.bodyStyle = ['Estate / Wagon', 'Mid-size SUV', 'Large SUV'];
    } else if (lower.includes('premium') || lower.includes('luxury') || lower.includes('πολυτελ')) {
      advisorResponse = isGreek ? 'Μεταφέρω το βάρος σε ποιότητα κύλισης, ηχομόνωση και πιο premium καμπίνα.' : 'Shifting the focus toward refinement, sound insulation, and a more premium cabin.';
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
    const { vehicles, userPreferences, marketRegion } = req.body;
    const isGreek = marketRegion === 'greece' || userPreferences?.marketRegion === 'greece';

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

${isGreek ? 'Write all prose fields in natural modern Greek; keep model names and technical units unchanged.' : 'Write all prose fields in English.'}

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
      headline: isGreek
        ? `Η επιλογή ανάμεσα σε ${v1.make} ${v1.model} και ${v2.make} ${v2.model} εξαρτάται κυρίως από το κόστος χρήσης και την πρακτικότητα.`
        : `Between the ${v1.make} ${v1.model} and ${v2.make} ${v2.model}, the decision mainly comes down to running costs versus practicality.`,
      tradeOffs: isGreek ? [
        `Το ${v1.make} ${v1.model} προσφέρει αξιοπιστία ${v1.reliabilityRating}/5 και κατανάλωση ${v1.fuelEconomy}.`,
        `Το ${v2.make} ${v2.model} προσφέρει ${v2.cargoCapacityLiters} L χώρο αποσκευών και διαφορετικό συμβιβασμό σε άνεση και κόστος.`
      ] : [
        `The ${v1.make} ${v1.model} offers ${v1.reliabilityRating}/5 reliability and ${v1.fuelEconomy} efficiency.`,
        `The ${v2.make} ${v2.model} offers ${v2.cargoCapacityLiters} L cargo capacity with a different comfort/cost trade-off.`
      ],
      verdict: isGreek
        ? `Για την καθημερινή επιλογή προτίμησε το μοντέλο που ταιριάζει καλύτερα στις δηλωμένες προτεραιότητές σου και έλεγξε πάντα το συγκεκριμένο μεταχειρισμένο πριν την αγορά.`
        : `For the daily-use choice, prefer the model that best matches your stated priorities and always inspect the specific used car before purchase.`
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
