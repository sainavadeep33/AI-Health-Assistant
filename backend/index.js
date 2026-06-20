import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { GoogleGenerativeAI } from '@google/generative-ai';

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

const port = process.env.PORT || 5000;

// Initialize Gemini API
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || 'dummy_key');

// System prompt for health assistant
const SYSTEM_PROMPT = `You are an AI Health Assistant.
Rules:
1. Never diagnose diseases.
2. Never claim certainty.
3. Ask follow-up questions before giving suggestions.
4. Discuss only possible causes.
5. Recommend professional medical care when needed.
6. Encourage emergency care for dangerous symptoms.
7. Use simple language.
8. Be supportive and empathetic.
9. Keep responses concise and readable.
10. Always include this disclaimer:
"This is not a substitute for professional medical advice."

Response Structure:
Possible Causes:
- Cause 1
- Cause 2
Recommended Actions:
- Action 1
- Action 2
When to See a Doctor:
- Guidance
Disclaimer`;

// Emergency keywords detection
const EMERGENCY_KEYWORDS = [
  'chest pain', 'severe bleeding', 'stroke', 'suicidal', 'self harm',
  'overdose', 'cannot breathe', 'breathing difficulty', 'unconscious', 'seizure', 'heart attack'
];

function checkEmergency(text) {
  const lowerText = text.toLowerCase();
  return EMERGENCY_KEYWORDS.some(keyword => lowerText.includes(keyword));
}

app.post('/api/chat', async (req, res) => {
  try {
    const { message, history } = req.body;

    if (!message) {
      return res.status(400).json({ error: "Message is required." });
    }

    // Pre-check for emergencies
    if (checkEmergency(message)) {
      return res.json({
        response: "⚠️ **EMERGENCY ALERT** ⚠️\n\nYour symptoms may indicate a medical emergency. Please contact emergency services (e.g., 911) or seek immediate medical attention.\n\nThis application cannot provide assistance for emergencies."
      });
    }

    // Call Gemini API
    const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash", systemInstruction: SYSTEM_PROMPT });
    
    const formattedHistory = history ? history.map(msg => ({
      role: msg.role === 'user' ? 'user' : 'model',
      parts: [{ text: msg.text }]
    })) : [];

    const chat = model.startChat({
      history: formattedHistory,
    });

    const result = await chat.sendMessage(message);
    const response = await result.response;
    const text = response.text();

    res.json({ response: text });

  } catch (error) {
    console.error("Gemini API Error:", error);
    res.status(500).json({ error: "Failed to generate response. Please try again." });
  }
});

app.post('/api/symptom-check', async (req, res) => {
    try {
      const { symptoms, duration, severity, age, notes } = req.body;
      
      const prompt = `User reports the following symptoms: ${symptoms.join(', ')}.
      Duration: ${duration}.
      Severity: ${severity}.
      Age: ${age}.
      Additional Notes: ${notes}.
      Provide possible explanations, questions to discuss with a doctor, and self-care suggestions based on your instructions.`;

      if (checkEmergency(symptoms.join(' ')) || checkEmergency(notes)) {
        return res.json({
          response: "⚠️ **EMERGENCY ALERT** ⚠️\n\nYour symptoms may indicate a medical emergency. Please contact emergency services or seek immediate medical attention."
        });
      }
      
      const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash", systemInstruction: SYSTEM_PROMPT });
      const result = await model.generateContent(prompt);
      const text = await result.response.text();

      res.json({ response: text });
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: "Analysis failed." });
    }
});

app.post('/api/health-tips', async (req, res) => {
    try {
        const { water, sleep, steps } = req.body;
        const prompt = `Generate one short wellness tip based on:
        Water Intake: ${water}ml
        Sleep: ${sleep} hours
        Steps: ${steps}

        Response format: One concise practical tip.`;

        const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });
        const result = await model.generateContent(prompt);
        const text = await result.response.text();
        res.json({ tip: text });
    } catch (error) {
        console.error(error);
        res.json({ tip: "Drink water regularly throughout the day and get at least 7 hours of sleep." }); // Fallback
    }
})

app.get('/', (req, res) => {
  res.send('AI Health Assistant Backend API is running');
});

if (process.env.NODE_ENV !== 'production') {
  app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
  });
}

export default app;
