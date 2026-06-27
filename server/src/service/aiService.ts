import { GoogleGenerativeAI } from '@google/generative-ai';
import { StatsService } from './statsService';

export class AiService {
  static async askAI(question: string) {
    try {
      const apiKey = process.env.GEMINI_API_KEY;
      if (!apiKey) {
        throw new Error('GEMINI_API_KEY is not defined in environment variables');
      }

      // 1. Vector Search for relevant stats
      const searchResult = await StatsService.searchStats(question, 2);
      
      let contextStr = 'No historical stats found.';
      if (searchResult.success && searchResult.matches && searchResult.matches.length > 0) {
        contextStr = searchResult.matches.map((m, i) => 
          `[Snapshot ${i + 1} from ${m.timestamp}]\nSummary: ${m.summary_text}\nRaw Metrics: ${JSON.stringify(m.raw_metrics)}`
        ).join('\n\n');
      }

      // 2. Generate response using Gemini
      const genAI = new GoogleGenerativeAI(apiKey);
      const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });

      const prompt = `You are a helpful AI assistant for an Event Management System.
You have access to the following historical system statistics snapshots retrieved via semantic search.

CONTEXT DATA:
${contextStr}

USER QUESTION:
${question}

Instructions:
1. Answer the user's question directly and concisely based ONLY on the provided context data.
2. If the context data doesn't contain the answer, say "I don't have enough data to answer that right now."
3. Keep the tone professional, helpful, and natural.
`;

      const result = await model.generateContent(prompt);
      const responseText = result.response.text();

      return {
        success: true,
        answer: responseText,
        contextUsed: searchResult.matches
      };

    } catch (error: any) {
      console.error('Ask AI error:', error);
      return { success: false, message: error.message || 'Failed to generate AI response' };
    }
  }

  static async askEventAI(eventId: number, question: string) {
    try {
      const apiKey = process.env.GEMINI_API_KEY;
      if (!apiKey) {
        throw new Error('GEMINI_API_KEY is not defined in environment variables');
      }

      // Fetch specific event stats
      const { EventService } = await import('./eventService');
      const eventStats = await EventService.getEventStats(eventId);
      
      let contextStr = 'No event statistics found.';
      if (eventStats.success && eventStats.stats) {
        contextStr = `Current Event Statistics:
- Total Visitors: ${eventStats.stats.total_visitors}
- Checked In: ${eventStats.stats.checked_in}
- Pending (Not Checked In): ${eventStats.stats.not_checked_in}
- Check-in Percentage: ${eventStats.stats.check_in_percentage}%
- Recent Check-ins count: ${eventStats.stats.recentCheckIns.length}`;
      }

      // Generate response using Gemini
      const genAI = new GoogleGenerativeAI(apiKey);
      const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });

      const prompt = `You are a helpful AI assistant for an Event Management System, currently focused on a single specific event.
You have access to the following real-time statistics for this event.

CONTEXT DATA:
${contextStr}

USER QUESTION:
${question}

Instructions:
1. Answer the user's question directly and concisely based ONLY on the provided event statistics.
2. If the context data doesn't contain the answer, say "I don't have enough data to answer that right now."
3. Keep the tone professional, helpful, and natural.
`;

      const result = await model.generateContent(prompt);
      const responseText = result.response.text();

      return {
        success: true,
        answer: responseText
      };

    } catch (error: any) {
      console.error('Ask Event AI error:', error);
      return { success: false, message: error.message || 'Failed to generate AI response' };
    }
  }
}
