# AI Implementation Guide

Complete documentation of AI features in the Smart Event Check-in System.

## Overview

The system integrates AI capabilities through two main services:
1. **Google Gemini API** - For natural language generation and question answering
2. **Voyage AI API** - For vector embeddings and semantic search

The AI system uses RAG (Retrieval Augmented Generation) to provide context-aware responses based on real system data.

---

## Architecture

### AI Components

```
User Question
    ↓
Stats Service (context retrieval)
    ↓
Voyage AI (embedding generation)
    ↓
Vector Search (similarity matching)
    ↓
Gemini AI (response generation)
    ↓
Formatted Answer
```

### Key Files

- `server/src/service/aiService.ts` - AI logic and Gemini integration
- `server/src/service/voyageService.ts` - Embedding generation and similarity calculation
- `server/src/service/statsService.ts` - Stats snapshots and search
- `server/src/controllers/statsController.ts` - API endpoints for AI
- `server/src/cron/statsCron.ts` - Automated snapshot generation
- `server/src/models/SystemStat.ts` - Database model for storing snapshots

---

## AI Features

### 1. Global AI Assistant

**Endpoint:** `POST /api/stats/ask`

**Purpose:** Answer questions about historical system statistics using RAG.

**Workflow:**
1. User submits a question
2. System generates embedding for the question using Voyage AI
3. System searches historical stats snapshots using vector similarity
4. Top 2 most relevant snapshots are retrieved
5. Context is formatted and passed to Gemini AI
6. Gemini generates a response based on the context
7. Response is returned to the user

**Example Questions:**
- "What was the total attendance last week?"
- "How many events were active in June?"
- "Show me the check-in trends"

**Context Provided:**
- Snapshot timestamp
- Summary text
- Raw metrics (total events, visitors, check-ins, etc.)

---

### 2. Event-Specific AI Assistant

**Endpoint:** `POST /api/events/:id/assistant`

**Purpose:** Answer questions about a specific event's current statistics.

**Workflow:**
1. User submits a question for a specific event
2. System fetches current event statistics
3. Context is formatted with real-time data
4. Context is passed to Gemini AI
5. Gemini generates a response
6. Response is returned to the user

**Example Questions:**
- "How many visitors checked in?"
- "What's the check-in percentage?"
- "Who hasn't checked in yet?"
- "Tell me about this event"

**Context Provided:**
- Total visitors
- Checked-in count
- Not checked-in count
- Check-in percentage
- Recent check-ins count

---

## Implementation Details

### Voyage AI Integration

**File:** `server/src/service/voyageService.ts`

**Purpose:** Generate vector embeddings for semantic search.

**API Configuration:**
- Endpoint: `https://api.voyageai.com/v1/embeddings`
- Model: `voyage-3-large`
- Embedding dimension: 1024
- Authorization: Bearer token

**Methods:**

```typescript
generateEmbedding(text: string): Promise<number[]>
```
- Takes text input
- Returns 1024-dimensional vector
- Used for both query embedding and snapshot embedding

```typescript
cosineSimilarity(vecA: number[], vecB: number[]): number
```
- Calculates cosine similarity between two vectors
- Range: -1 to 1 (1 = identical)
- Used for ranking search results

**Environment Variable:**
```env
VOYAGE_API_KEY=your-voyage-api-key
```

---

### Google Gemini Integration

**File:** `server/src/service/aiService.ts`

**Purpose:** Generate natural language responses using LLM.

**API Configuration:**
- Model: `gemini-2.5-flash`
- Library: `@google/generative-ai`
- Authorization: API key

**Methods:**

```typescript
askAI(question: string): Promise<{success, answer, contextUsed}>
```
- Global AI assistant
- Uses historical stats snapshots
- Implements RAG pattern

```typescript
askEventAI(eventId: number, question: string): Promise<{success, answer}>
```
- Event-specific AI assistant
- Uses real-time event statistics
- No vector search needed

**Prompt Engineering:**

The system uses carefully crafted prompts to ensure accurate, context-aware responses:

**Global AI Prompt:**
```
You are an AI assistant for the Smart Event Check-in System. 
You help users understand historical event statistics and attendance patterns.

Context from historical snapshots:
[Snapshot 1]
[Snapshot 2]

User Question: {question}

Instructions:
- Answer based ONLY on the provided context
- If the context doesn't contain enough information, say "I don't have enough data to answer that question"
- Keep responses professional and helpful
- Be concise but informative
```

**Event AI Prompt:**
```
You are an AI assistant for the Smart Event Check-in System.
You help users understand current event statistics and attendance.

Current Event Statistics:
- Total Visitors: {count}
- Checked In: {count}
- Not Checked In: {count}
- Check-in Percentage: {percentage}
- Recent Check-ins: {count}

User Question: {question}

Instructions:
- Answer based ONLY on the provided event statistics
- If the statistics don't contain enough information, say "I don't have enough data to answer that question"
- Keep responses professional and helpful
- Be concise but informative
```

**Environment Variable:**
```env
GEMINI_API_KEY=your-gemini-api-key
```

---

### Stats Snapshots

**File:** `server/src/service/statsService.ts`

**Purpose:** Create and search historical statistics snapshots.

**Snapshot Generation:**

```typescript
snapshotStats(): Promise<{success, snapshot}>
```

**Process:**
1. Calculate current global statistics
2. Format timestamp with dayjs
3. Create human-readable summary text
4. Generate embedding via Voyage AI
5. Store in database with:
   - `summary_text`: Human-readable summary
   - `raw_metrics`: JSON of stats
   - `embedding`: Vector array
   - `timestamp`: Snapshot time

**Example Summary:**
```
As of July 15, 2024 at 10:00 AM, the system has 5 active events, 
500 total visitors, 350 checked in, and 150 not checked in. 
The check-in rate is 70%. Latest check-ins: John Doe at 10:30 AM, 
Jane Smith at 10:25 AM.
```

**Vector Search:**

```typescript
searchStats(query: string, topK: number = 3): Promise<{success, matches}>
```

**Process:**
1. Generate embedding for query
2. Fetch all snapshots from database
3. Calculate cosine similarity for each
4. Sort by similarity descending
5. Return top K matches with similarity scores

---

### Cron Job Automation

**File:** `server/src/cron/statsCron.ts`

**Purpose:** Automatically generate stats snapshots every hour.

**Schedule:**
```typescript
cron.schedule('0 * * * *', callback)
```
- Runs every hour at minute 0
- Cron expression: `0 * * * *`

**Execution:**
1. Logs start of snapshot
2. Calls `StatsService.snapshotStats()`
3. Logs success or failure
4. Logs snapshot ID on success

**Startup:**
```typescript
startStatsCron()
```
- Called in `server.ts`
- Initializes cron job on server start

---

## Database Schema

### SystemStat Model

**Table:** `system_stats`

**Fields:**
- `id`: INTEGER PRIMARY KEY
- `timestamp`: DATETIME - When the snapshot was taken
- `summary_text`: TEXT - Human-readable summary
- `raw_metrics`: JSON - Raw statistics data
- `embedding`: JSON - Vector array (1024 dimensions)
- `created_at`: DATETIME
- `updated_at`: DATETIME

**Purpose:**
- Store historical statistics
- Enable semantic search
- Provide context for AI queries

---

## Frontend Integration

### AI Assistant Widget

**File:** `client/src/components/dashboard/AiAssistantWidget.vue`

**Features:**
- Floating chat interface
- Quick question buttons
- Markdown rendering for responses
- Loading indicators
- Auto-scroll to latest message

**Quick Questions:**
- **Global AI:**
  - "What's the total attendance?"
  - "Show me recent check-ins"
  - "How many events are active?"

- **Event AI:**
  - "What's the total attendance for this event?"
  - "Show me recent check-ins for this event"
  - "Tell me about this event?"

**State Management:**
```javascript
const messages = ref([
  { role: 'ai', content: 'Hello! I am your AI assistant...' }
]);
const inputQuery = ref('');
const isAiLoading = computed(() => statsStore.isAiLoading);
```

**API Calls:**
```javascript
const response = await statsStore.askAiAssistant(query, props.eventId);
```

---

### AI Assistant Card

**File:** `client/src/components/ai/AIAssistant.vue`

**Features:**
- Card-based interface
- Quick question buttons
- Chat history
- Loading states

**Quick Questions:**
- "How many visitors checked in?"
- "What's the check-in percentage?"

**Note:** This component uses a mock implementation for demo purposes.

---

## API Endpoints

### Global AI

**POST /api/stats/ask**

**Request:**
```json
{
  "question": "What's the total attendance?"
}
```

**Response:**
```json
{
  "success": true,
  "answer": "Based on the historical data, the total attendance across all events is 500 visitors.",
  "contextUsed": [...]
}
```

**Authentication:** Required

---

### Event AI

**POST /api/events/:id/assistant`

**Request:**
```json
{
  "question": "How many visitors checked in?"
}
```

**Response:**
```json
{
  "success": true,
  "answer": "75 out of 100 visitors have checked in, which is a 75% check-in rate."
}
```

**Authentication:** Required

---

## Configuration

### Environment Variables

```env
# Google Gemini API
GEMINI_API_KEY=your-gemini-api-key

# Voyage AI API
VOYAGE_API_KEY=your-voyage-api-key
```

### Getting API Keys

**Google Gemini:**
1. Go to https://makersuite.google.com/app/apikey
2. Create a new API key
3. Add to `.env` file

**Voyage AI:**
1. Go to https://voyageai.com/
2. Sign up for an account
3. Get API key from dashboard
4. Add to `.env` file

---

## Limitations

### Current Limitations

1. **No Hardcoded Answers**: All responses are generated dynamically based on data
2. **Context Dependency**: AI can only answer questions based on available context
3. **Snapshot Frequency**: Hourly snapshots may miss real-time changes
4. **Embedding Cost**: Each embedding generation uses API credits
5. **Response Time**: Depends on external API latency

### Future Improvements

1. **Streaming Responses**: Implement streaming for faster response times
2. **Caching**: Cache embeddings to reduce API calls
3. **More Context**: Include additional data sources (weather, venue capacity, etc.)
4. **Multilingual Support**: Support questions in multiple languages
5. **Voice Input**: Add voice-to-text for questions

---

## Troubleshooting

### AI Not Responding

**Check:**
- GEMINI_API_KEY is set in `.env`
- API key is valid and has credits
- Internet connectivity
- API endpoint is accessible

### Error: "VOYAGE_API_KEY is not defined"

**Solution:**
- Add VOYAGE_API_KEY to `.env` file
- Restart the server

### Error: "Failed to generate embedding"

**Check:**
- Voyage AI API key is valid
- API credits are available
- Network connection is stable

### Generic AI Errors

**Common Causes:**
- Invalid API keys
- Rate limiting
- Network issues
- API service downtime

**Solutions:**
- Verify API keys
- Check API status pages
- Implement retry logic
- Add error handling

---

## Security Considerations

### API Key Security

- Never commit API keys to version control
- Use environment variables
- Rotate keys regularly
- Monitor API usage

### Data Privacy

- Snapshots contain visitor data
- Ensure database access is restricted
- Implement data retention policies
- Consider anonymization for sensitive data

### Rate Limiting

- Implement rate limiting on AI endpoints
- Monitor API usage
- Set up alerts for unusual activity
- Consider caching for frequent queries

---

## Performance Optimization

### Embedding Caching

Consider caching embeddings for frequently asked questions to reduce API calls.

### Snapshot Pruning

Implement a retention policy to delete old snapshots and reduce database size.

### Batch Processing

Process multiple embeddings in batches when possible to reduce API overhead.

---

## Testing

### Manual Testing

Test the AI features with various questions:

**Global AI:**
- "How many events do we have?"
- "What's the average check-in rate?"
- "Show me attendance trends"

**Event AI:**
- "How many people are here?"
- "What percentage have checked in?"
- "Who hasn't arrived yet?"

### Automated Testing

Consider adding automated tests for:
- Embedding generation
- Similarity calculation
- API responses
- Error handling

---

## Conclusion

The AI implementation in the Smart Event Check-in System provides intelligent, context-aware assistance using modern LLM and vector search technologies. The RAG pattern ensures responses are based on real system data, making the AI both useful and reliable.

For more information, see:
- [API Documentation](API.md)
- [Setup Instructions](SETUP.md)
- [System Documentation](SYSTEM_DOCUMENTATION.md)
