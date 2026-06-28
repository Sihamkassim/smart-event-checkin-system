import { Router } from 'express';
import { getGlobalStats, snapshotStats, searchStats, askAi } from '../controllers/statsController';
import { authenticate, authorize } from '../middleware/auth';

const router = Router();

// Require authentication for all stats routes
router.use(authenticate);

/**
 * @swagger
 * /api/stats/global:
 *   get:
 *     summary: Get global statistics
 *     description: Retrieve high-level statistics aggregating data across all events
 *     tags: [Stats]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Global statistics payload
 *       500:
 *         description: Server error
 */
router.get('/global', getGlobalStats);

/**
 * @swagger
 * /api/stats/snapshot:
 *   post:
 *     summary: Trigger manual stats snapshot
 *     description: Generate and store a text-embedding snapshot of current system statistics (admin only)
 *     tags: [Stats]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       201:
 *         description: Snapshot created successfully
 *       403:
 *         description: Unauthorized
 */
router.post('/snapshot', authorize('admin'), snapshotStats);

/**
 * @swagger
 * /api/stats/search:
 *   post:
 *     summary: Search historical stat snapshots
 *     description: Perform a semantic vector search across previous statistic snapshots using an embedding model (admin only)
 *     tags: [Stats]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               query:
 *                 type: string
 *     responses:
 *       200:
 *         description: Matching snapshots
 *       403:
 *         description: Unauthorized
 */
router.post('/search', authorize('admin'), searchStats);

/**
 * @swagger
 * /api/stats/ask:
 *   post:
 *     summary: Ask AI Assistant
 *     description: Process natural language queries against system data using RAG and Gemini LLM
 *     tags: [Stats]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               question:
 *                 type: string
 *     responses:
 *       200:
 *         description: AI-generated answer
 *       400:
 *         description: Missing question
 */
router.post('/ask', askAi);

export default router;
