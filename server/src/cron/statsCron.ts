import cron from 'node-cron';
import { StatsService } from '../service/statsService';

export const startStatsCron = () => {
  // Run every hour at minute 0
  cron.schedule('0 * * * *', async () => {
    console.log('[CRON] Starting hourly stats snapshot...');
    try {
      const result = await StatsService.snapshotStats();
      if (result.success) {
        console.log(`[CRON] Snapshot created successfully (ID: ${result.snapshot?.id})`);
      } else {
        console.error('[CRON] Snapshot failed:', result.message);
      }
    } catch (error) {
      console.error('[CRON] Error during snapshot execution:', error);
    }
  });

  console.log('[CRON] Hourly stats snapshot job scheduled.');
};
