# CarCheck — Intelligent Car Discovery Specification

> **“What car should I buy?”**  
> CarCheck replaces tedious multi-page filters and technical jargon with an intelligent, conversational advisor. In under 60 seconds, users answer 3 to 4 simple questions, and CarCheck delivers 3 to 5 tailored recommendations with transparent reasoning, market pricing intelligence, and pre-purchase inspection checklists.

---

## 1. Executive Summary & Core Philosophy

Traditional automotive marketplaces (such as Mobile.de, AutoScout24, Autotrader, or Car.gr) confront buyers with dozens of dropdown filters—engine displacement in cubic centimeters, kilowatts, curb weight, trim designations, and thousands of unstructured listings. 

**CarCheck** is built on the opposite premise:
- **Act like a knowledgeable automotive advisor:** It understands everyday life, budget constraints, and ownership priorities.
- **Fast and frictionless:** Initial discovery takes less than a minute.
- **Explain "Why":** Every vehicle comes with clear, plain-language reasoning why it fits—or why a buyer might want to pass.
- **Budget inclusivity:** Fully supports realistic entry-level budgets starting from **€1,500** up to **€60,000+** flagships.
- **Localized market intelligence:** Specialized features for the **Greek Automotive Market (Ελλάδα)**, including Annual Road Tax (*Τέλη Κυκλοφορίας*), Athens Clean Air Ring (*Ελεύθερος Δακτύλιος*), income presumptions (*Τεκμήρια*), and local marketplace data (*Car.gr*).

---

## 2. The 60-Second 4-Question Discovery Flow

CarCheck does not overwhelm the user with filter forms upfront. It guides the user through four high-yield questions:

### Question 1 — Budget & Financial Structure
- **Budget Ranges:**
  - **€1,500 – €5,000:** Essential, reliable economy runabouts (Toyota Yaris Mk1, Fiat Punto/Panda 1.2 FIRE, Nissan Micra K12, Hyundai Getz) with rock-bottom running costs.
  - **€5,000 – €10,000:** Proven everyday hatchbacks and superminis (Toyota Yaris Mk2/3, Ford Fiesta, VW Polo).
  - **€10,000 – €20,000:** Modern hatchbacks and efficient self-charging hybrids (Toyota Auris/Corolla, Dacia Sandero Stepway LPG).
  - **€20,000 – €30,000:** The sweet spot—compact SUVs, estates, and proven EVs (Corolla Hybrid E210, Skoda Octavia Combi, Yaris Cross, Mazda CX-5).
  - **€30,000 – €40,000:** Long-range electric vehicles and executive wagons (Tesla Model 3/Y, BMW 3 Series Touring, Hyundai Ioniq 5).
  - **€40,000 – €60,000:** Executive luxury SUVs and performance wagons (Volvo XC60 Recharge, Porsche Macan).
  - **€60,000+:** Flagship engineering and performance.
  - **Custom Amount:** Direct input slider/field starting from **€1,500**.
  - **"Not Sure":** The system infers a sensible budget from subsequent answers (e.g., student/first car defaults to €2,000–€10,000; family travel defaults to €18,000–€35,000).
- **Payment Structure (Non-mandatory):**
  - Cash purchase
  - Financing / Loan
  - Optional target monthly payment (e.g. €250/month)

### Question 2 — Primary Usages (Multi-select)
- Daily commuting
- City driving & tight parking
- Family use & children
- Long road trips / Motorway touring
- Weekend leisure & getaways
- Business & executive travel
- Carrying bulky equipment & tools
- Outdoor sports & mountain adventures
- Performance driving & weekend fun
- First car / New driver
- Luxury, quiet comfort & prestige

### Question 3 — What Matters Most? (Select up to 3)
Priorities are **heavily weighted** by the ranking algorithm:
- **Bulletproof Reliability:** Ranked above excitement when chosen.
- **Low Running Costs:** Cheap spare parts, affordable insurance, low servicing overhead.
- **Fuel / Energy Economy:** Minimum L/100 km or kWh consumption.
- **Sporty Performance:** Sharp handling, quick 0–100 km/h acceleration, chassis balance.
- **Quiet Cabin & Composure:** Acoustic insulation, supple suspension, relaxed motorway cruising.
- **Maximum Practicality:** High boot capacity (liters), versatile seating.
- **Top Crash Safety & ADAS:** 5-star Euro NCAP ratings, active collision avoidance.
- **Modern Infotainment & Tech:** Wireless Apple CarPlay / Android Auto, digital cockpit.
- **High Resale Value:** Low depreciation curve over 3–5 years.
- **Environmental Impact / 0€ Road Tax:** Zero tailpipe emissions or hybrid efficiency with green city access.
- **Premium Brand Prestige:** High-grade materials and premium badge.
- **Standout Exterior Design:** Head-turning aesthetic and presence.

### Question 4 — Dynamic Lifestyle Tailoring
Rather than static questions, Question 4 dynamically adapts to prior answers:
- **If Family Use was chosen:** *"How many people will usually be in the car?"* (Small family, family of 4 with stroller, large 6–7 seat family, or family with a dog crate).
- **If City Driving was chosen:** *"Is easy parking or a compact footprint your top priority?"* (Sub-4.2m length for parallel parking, underground garage maneuverability, high crossover driving position, or balanced city/highway).
- **If Performance was chosen:** *"Do you care more about acceleration or handling?"* (Instant electric torque, go-kart chassis agility, 50:50 rear-wheel drive purity, or all-weather AWD traction).
- **If Outdoor/Equipment was chosen:** *"What kind of terrain or gear do you tackle?"* (Snow/ski AWD, bikes/camping roof racks, or rough gravel clearance).
- **General baseline:** Lifestyle presets (Drive alone, couple, cargo space, mountain driving, motorway driving).

---

## 3. Greek Automotive Market Edition (Ελληνική Αγορά)

The Greek car market features unique economic, regulatory, and climatic realities:

### A. The €1,500 – €5,000 Budget Reality
Cars in Greece retain value differently than in northern Europe. In the **€1,500 to €3,500 bracket**, mechanical simplicity and parts availability are critical:
1. **Toyota Yaris Mk1 (XP10, 1999–2005) 1.0L / 1.3L VVT-i:**
   - *Why it dominates:* Timing chain (no timing belt failure risk), sub-1,000cc displacement means the lowest income presumption (*τεκμήριο*) and low road tax (120€). Routinely exceeds 350,000 km in Greek taxi and urban duties.
2. **Fiat Punto Classic / Panda (169) 1.2 FIRE:**
   - *Why it dominates:* The legendary 1.2 FIRE 8-valve engine is a **non-interference design**. Even if the timing belt snaps, pistons never collide with valves. Dualdrive "City" button makes steering finger-light in narrow island and Athenian streets.
3. **Nissan Micra (K12, 2003–2010) 1.2L:**
   - *Why it dominates:* Tiny 4.4-meter turning radius, timing chain, punchy 80 hp handles highway bypasses with ease.
4. **Hyundai Getz (2002–2009) 1.1L / 1.4L:**
   - *Why it dominates:* Famous for an ultra-powerful air conditioning system that effortlessly handles 42°C Greek summer heatwaves, robust suspension over potholes, and low annual road tax.

### B. Regulatory & Tax Parameters
- **Τέλη Κυκλοφορίας (Annual Road Tax):**
  - **0€ Road Tax:** Modern hybrid and electric vehicles emitting under 122 g/km of CO2 (WLTP) pay **0€ annual tax** in Greece (e.g., Toyota Corolla Hybrid, Yaris Cross, Tesla Model 3).
  - **Displacement-based Tax:** Older vehicles (registered before Nov 2010) are taxed by engine displacement cc (e.g., up to 1,000cc is ~120€; 1,001–1,200cc is ~135€; 1,201–1,400cc is ~135€).
- **Πράσινος / Ελεύθερος Δακτύλιος Αθηνών (Athens Clean Air Ring):**
  - Electric, hybrid (under 120 g CO2), and factory gas vehicles are exempt from odd/even plate restrictions (*Μονά-Ζυγά*) and enter central Athens freely 365 days a year.
- **Τεκμήρια Διαβίωσης (Imputed Income Presumption):**
  - Cars below 1,200 cc have minimum presumption impact, making them optimal for young drivers and freelancers in Greece.
- **ΚΤΕΟ (National Vehicle Inspection):**
  - Every CarCheck listing highlights Greek KTEO certificate validity and emissions card status (*ΚΕΚ*).

---

## 4. Curated Recommendation Output

CarCheck limits initial results to **3–5 high-confidence choices** and assigns intelligent editorial badges:
- **Best Overall:** The strongest mathematical balance between the user's budget, lifestyle, and priorities.
- **Best Value:** Maximum vehicle, equipment, and reliability for the money spent.
- **Most Reliable:** The lowest breakdown probability and minimal ownership risk over 5 years.
- **Alternative Choice:** A different flavor (e.g. stylish crossover or wagon) that fulfills the same practical mission.

### Each Vehicle Card Includes:
1. **Manufacturer, Model, Generation, and Recommended Years**
2. **Match Score Percentage** (computed from profile matrix)
3. **Engine Summary & Recommended Powertrain** (plus powertrains to avoid)
4. **Market Price Range & "Good Buy Target Price"**
5. **Key Indicators:** Reliability (out of 5), Running Cost Level, Real-world Fuel Economy, Boot Capacity (liters)
6. **Greek Market Highlights:** 0€ Road Tax badge, Athens Ring exemption badge, and displacement cc
7. **Transparent Pros & Cons**
8. **Why This Car Fits You:** Personalized plain-language explanation

---

## 5. In-Depth Vehicle Dossier & Pre-Purchase Checklist

Clicking any recommendation opens the full vehicle dossier:
- **Model Overview & Generations**
- **Powertrains to Seek vs. Powertrains to Avoid** (e.g. avoid Dualogic robotized gearboxes or early turbo variants)
- **Known Failure Points & Model Years to Avoid**
- **3-Point Pre-Purchase Inspection Checklist:**
  - Critical component check with importance tag (*Critical*, *Important*, *Advisory*)
  - Specific mechanic inspection instructions
  - Expert tip explaining what to look for and typical replacement cost

---

## 6. Real-Time Marketplace Integration (Car.gr Parity)

The **Available Cars** marketplace tab allows users to see real market vehicles:
- **Locations across Greece:** Athens (Marousi, Glyfada, Kifisia, Peristeri), Thessaloniki (Kalamaria), Patras, Heraklion Crete, Larissa.
- **Deal Rating System:** "Excellent Price", "Good Price", "Fair Price" based on market benchmark data.
- **Seller Verification:** Distinguishes verified dealer offerings from private second-owner vehicles.
- **Equipment & Maintenance Highlights:** Documents fresh KTEO pass, A/C recharge status, new tires, and service book history.

---

## 7. Interactive Tools & Conversational Refinement

- **Conversational AI Refiner:** Users can type or click quick adjustments:
  - *"Show me something cheaper"*
  - *"I want something sportier"*
  - *"Only show hybrids or electrics"*
  - *"More luggage space"*
- **Side-by-Side Comparison Modal:** Compare up to 3 vehicles simultaneously across price, 0–100 km/h, cargo volume, reliability, fuel economy, and running cost rating.
- **Personal Garage Shortlist:** Save vehicles and specific listings with custom personal notes.
- **Region & Currency Switcher:** Instant toggle between European Market (€ / $ / £) and Greek National Market (🇬🇷 Ελλάδα).

---

## 8. Technical Architecture

- **Frontend:** React 19 SPA, Tailwind CSS v4, Lucide icons.
- **Styling Archetype:** Apple-inspired warm-light interface (off-whites, ivory, beige, graphite text, and Apple blue `#0066cc` for primary interactions).
- **Backend Entry:** `server.ts` running Express with Vite middlewares on port 3000.
- **AI Integration:** `@google/genai` TypeScript SDK with `gemini-2.5-flash` for conversational preference refinement and vehicle comparison analysis, backed by deterministic fallback heuristics.
