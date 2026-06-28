import cron from 'node-cron';
import { Event } from '../models';
import { Op } from 'sequelize';

export const startEventCron = () => {
  // Run daily at midnight (00:00)
  cron.schedule('0 0 * * *', async () => {
    try {
      console.log('🔄 [CRON] Running daily event auto-completion check...');
      
      const now = new Date();
      
      const [updatedCount] = await Event.update(
        { status: 'completed' },
        {
          where: {
            status: {
              [Op.ne]: 'completed' // only update active or draft
            },
            date: {
              [Op.lt]: now // date is strictly in the past
            }
          }
        }
      );

      if (updatedCount > 0) {
        console.log(`✅ [CRON] Auto-completed ${updatedCount} past events.`);
      } else {
        console.log(`✅ [CRON] No past events to auto-complete.`);
      }
    } catch (error) {
      console.error('❌ [CRON] Failed to run event auto-completion:', error);
    }
  });

  console.log('✅ Event cron job scheduled (Runs daily at midnight).');
};
