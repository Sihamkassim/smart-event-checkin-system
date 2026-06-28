import axios from 'axios';

export class VoyageService {
  static async generateEmbedding(text: string): Promise<number[]> {
    const apiKey = process.env.VOYAGE_API_KEY;
    if (!apiKey) {
      throw new Error('VOYAGE_API_KEY is not defined in environment variables');
    }

    try {
      const response = await axios.post(
        'https://api.voyageai.com/v1/embeddings',
        {
          input: [text],
          model: 'voyage-3-large',
        },
        {
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${apiKey}`,
          },
        }
      );

      if (
        response.data &&
        response.data.data &&
        response.data.data.length > 0 &&
        response.data.data[0].embedding
      ) {
        return response.data.data[0].embedding;
      }

      throw new Error('Invalid response from Voyage API');
    } catch (error) {
      console.error('Voyage API error:', error);
      throw new Error('Failed to generate embedding');
    }
  }

  /**
   * Calculates the cosine similarity between two vectors.
   * Both vectors must be of the same length (e.g., 1024).
   */
  static cosineSimilarity(vecA: number[], vecB: number[]): number {
    if (vecA.length !== vecB.length) {
      throw new Error('Vectors must be of same length to calculate cosine similarity');
    }

    let dotProduct = 0;
    let normA = 0;
    let normB = 0;

    for (let i = 0; i < vecA.length; i++) {
      dotProduct += vecA[i] * vecB[i];
      normA += vecA[i] * vecA[i];
      normB += vecB[i] * vecB[i];
    }

    if (normA === 0 || normB === 0) return 0;
    
    return dotProduct / (Math.sqrt(normA) * Math.sqrt(normB));
  }
}
