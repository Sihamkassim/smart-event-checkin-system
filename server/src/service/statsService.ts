import { Event, Visitor, CheckInLog, SystemStat } from '../models';
import { VoyageService } from './voyageService';
import dayjs from 'dayjs';

export class StatsService {
  /**
   * Generates global stats dynamically
   */
  static async getGlobalStats() {
    try {
      const totalEvents = await Event.count();
      const totalVisitors = await Visitor.count();
      const checkedIn = await Visitor.count({ where: { checked_in: true } });
      const notCheckedIn = totalVisitors - checkedIn;
      const checkInPercentage = totalVisitors > 0 ? Math.round((checkedIn / totalVisitors) * 100) : 0;

      const latestCheckIns = await CheckInLog.findAll({
        where: { status: 'success' },
        order: [['checked_in_at', 'DESC']],
        limit: 5,
        include: [
          { model: Visitor, as: 'visitor', attributes: ['full_name', 'company'] },
          { model: Event, as: 'event', attributes: ['name'] }
        ]
      });

      return {
        success: true,
        stats: {
          total_events: totalEvents,
          total_visitors: totalVisitors,
          checked_in: checkedIn,
          not_checked_in: notCheckedIn,
          check_in_percentage: checkInPercentage,
          latest_check_ins: latestCheckIns,
        },
      };
    } catch (error) {
      console.error('Get global stats error:', error);
      return { success: false, message: 'Failed to get global stats' };
    }
  }

  /**
   * Takes a snapshot, generates an embedding, and saves to DB
   */
  static async snapshotStats() {
    try {
      const statsResult = await this.getGlobalStats();
      if (!statsResult.success || !statsResult.stats) {
        throw new Error('Failed to generate stats for snapshot');
      }

      const { stats } = statsResult;
      const now = dayjs();
      
      const latestCheckinNames = stats.latest_check_ins.map((c: any) => 
        `${c.visitor?.full_name || 'Unknown'} at ${dayjs(c.checked_in_at).format('HH:mm')}`
      ).join(', ');

      const summaryText = `As of ${now.format('MMMM D, YYYY [at] h:mm A')}, the system has ${stats.total_events} active events, ${stats.total_visitors} total visitors, ${stats.checked_in} checked in, and ${stats.not_checked_in} not checked in. The check-in rate is ${stats.check_in_percentage}%. Latest check-ins: ${latestCheckinNames || 'None yet'}.`;

      const embedding = await VoyageService.generateEmbedding(summaryText);

      const snapshot = await SystemStat.create({
        summary_text: summaryText,
        raw_metrics: stats,
        embedding: embedding,
        timestamp: now.toDate()
      });

      return { success: true, snapshot };
    } catch (error) {
      console.error('Snapshot generation error:', error);
      return { success: false, message: 'Failed to generate snapshot' };
    }
  }

  /**
   * Search for the best stats snapshot matching the query
   */
  static async searchStats(query: string, topK: number = 3) {
    try {
      const queryEmbedding = await VoyageService.generateEmbedding(query);
      const allSnapshots = await SystemStat.findAll();

      if (allSnapshots.length === 0) {
        return { success: true, matches: [] };
      }

      // Calculate cosine similarity for all
      const scoredSnapshots = allSnapshots.map(snapshot => {
        const similarity = VoyageService.cosineSimilarity(queryEmbedding, snapshot.embedding);
        return {
          snapshot,
          similarity
        };
      });

      // Sort by similarity descending
      scoredSnapshots.sort((a, b) => b.similarity - a.similarity);

      // Return top K
      const topMatches = scoredSnapshots.slice(0, topK);

      return {
        success: true,
        matches: topMatches.map(m => ({
          id: m.snapshot.id,
          timestamp: m.snapshot.timestamp,
          summary_text: m.snapshot.summary_text,
          raw_metrics: m.snapshot.raw_metrics,
          similarity: m.similarity
        }))
      };
    } catch (error) {
      console.error('Search stats error:', error);
      return { success: false, message: 'Failed to search stats' };
    }
  }
}
