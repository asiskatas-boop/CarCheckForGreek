# CarCheck 🏎️ — Intelligent Car Discovery & Advisor

> **"What car should I buy?"** Answer 3 to 4 simple questions in 60 seconds. CarCheck automatically filters through thousands of automotive possibilities to deliver tailored recommendations with transparent reasoning, market price benchmarks, and pre-purchase inspection checklists.

---

## 🌐 Live Application Access

- **Development App URL:** [https://ais-dev-j4mgmqhhii46st7zjfuuyt-457406202495.europe-west3.run.app](https://ais-dev-j4mgmqhhii46st7zjfuuyt-457406202495.europe-west3.run.app)
- **Local Dev Port:** Port 3000 (`http://localhost:3000/`)

---

## 🇬🇷 Greek Market Edition (Ελληνική Αγορά) & Budget from €1,500

CarCheck is specialized for both the broader European market and the **Greek Automotive Market**:
- **Budget Starting from €1,500 (από 1.500€):**
  - Includes Greek reliability legends like the **Toyota Yaris Mk1 (XP10)**, **Fiat Punto / Panda 1.2 FIRE**, **Nissan Micra K12**, and **Hyundai Getz 1.1**.
  - Supports custom budget targets starting at **1.500€** with an interactive range selector.
- **Greek Tax & Regulatory Intelligence:**
  - **Τέλη Κυκλοφορίας:** Shows 0€ annual tax for modern hybrid/EVs (< 122g CO2) vs. displacement-based annual tax for older vehicles (120€–135€).
  - **Ελεύθερος Δακτύλιος Αθηνών:** Highlights green hybrid and electric exemptions from odd/even central Athens restrictions.
  - **Τεκμήρια Διαβίωσης:** Identifies cars under 1,000cc and 1,200cc that protect buyers from aggressive tax presumptions.
  - **ΚΤΕΟ & Mediterranean Climate:** Inspection checklists verified for Greek heatwaves (ice-cold A/C checks, non-interference FIRE engines, radiator fan switches, coastal salt protection).
- **Marketplace Listings with Car.gr Parity:**
  - Verified dealer and private listings across Athens (Marousi, Glyfada, Kifisia, Peristeri), Thessaloniki (Kalamaria), Patras, Heraklion Crete, and Larissa.

---

## 🚀 Key Features

1. **The 60-Second 4-Question Flow:**
   - **Step 1:** Budget range (from €1,500 to €60,000+, custom sliders, cash vs financing).
   - **Step 2:** Usages (Daily commuting, city driving, family, long trips, business, outdoors, performance, first car).
   - **Step 3:** Priorities (Reliability, running costs, fuel economy, comfort, performance, safety, technology, resale value, 0€ road tax).
   - **Step 4:** Dynamic Lifestyle Tailoring (Dynamic questions based on prior answers: family size, easy parking, acceleration vs handling, terrain/snow/luggage).
2. **Intelligent Scoring & Categorization:**
   - Automatically awards badges: **Best Overall**, **Best Value**, **Most Reliable**, and **Alternative Choice**.
   - Generates personalized match scores and plain-language fit explanations.
3. **Pre-Purchase Inspection Checklists:**
   - Every car includes common known issues, model years to avoid, recommended vs avoided powertrains, and a 3-step mechanic inspection checklist.
4. **Side-by-Side Comparison:**
   - Compare up to 3 cars with detailed metrics (0-100 km/h, cargo volume, reliability, running cost, fuel consumption).
5. **Conversational AI Refinement:**
   - Natural language prompt refinement powered by server-side Gemini API (e.g. *"something sportier"*, *"cheaper alternative"*, *"only automatics"*).
6. **Garage Shortlist:**
   - Bookmark favorite models and listings, record personal notes, and track your selection.

---

## 🛠️ Tech Stack & Architecture

- **Frontend:** React 19, Tailwind CSS v4, Lucide React, Motion.
- **Design Archetype:** Cinematic automotive design inspired by luxury Italian editorial styling (Rosso Corsa `#da291c`, near-black `#181818`, and subtle `#303030` hairlines).
- **Backend:** Full-stack Express server (`server.ts`) running Vite middlewares on port 3000.
- **AI Engine:** `@google/genai` TypeScript SDK with `gemini-2.5-flash` for conversational refinement and advisory verdicts.

---

## 📖 Product Specification

See [`CARCHECK_SPEC.md`](./CARCHECK_SPEC.md) for the complete design specification, calculation matrices, and product requirements.
