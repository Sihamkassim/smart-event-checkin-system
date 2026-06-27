import { Router } from 'express';
import { getGlobalStats, snapshotStats, searchStats, askAi } from '../controllers/statsController';
import { authenticate, authorize } from '../middleware/auth';

const router = Router();

// Require authentication for all stats routes
router.use(authenticate);

// Standard dashboard stats
router.get('/global', getGlobalStats);

// Manual trigger for RAG snapshot (admin only)
router.post('/snapshot', authorize('admin'), snapshotStats);

// Vector search test endpoint (admin only)
router.post('/search', authorize('admin'), searchStats);

// AI Assistant endpoint
router.post('/ask', askAi);

export default router;
