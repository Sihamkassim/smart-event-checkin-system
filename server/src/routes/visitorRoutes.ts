import { Router } from 'express';
import {
  getVisitors,
  createVisitor,
  bulkCreateVisitors,
  updateVisitor,
  deleteVisitor,
  searchVisitors,
  exportVisitors,
} from '../controllers/visitorController';
import { authenticate, authorize } from '../middleware/auth';

const router = Router();

// All routes require authentication
router.use(authenticate);

/**
 * @swagger
 * /api/visitors/{eventId}/visitors:
 *   get:
 *     summary: Get all visitors for a specific event
 *     tags: [Visitors]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: eventId
 *         required: true
 *         schema:
 *           type: integer
 *         description: Event ID
 *         example: 1
 *     responses:
 *       200:
 *         description: Visitors retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 visitors:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Visitor'
 *       400:
 *         description: Invalid event ID
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       401:
 *         description: Unauthorized
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       500:
 *         description: Server error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
router.get('/:eventId/visitors', getVisitors);

/**
 * @swagger
 * /api/visitors/{eventId}/export:
 *   get:
 *     summary: Export all visitors for a specific event as CSV
 *     tags: [Visitors]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: eventId
 *         required: true
 *         schema:
 *           type: integer
 *         description: Event ID
 *     responses:
 *       200:
 *         description: CSV file download
 *         content:
 *           text/csv:
 *             schema:
 *               type: string
 *               format: binary
 */
router.get('/:eventId/export', exportVisitors);
/**
 * @swagger
 * /api/visitors/{eventId}/visitors/search:
 *   get:
 *     summary: Search visitors by name, email, or phone
 *     tags: [Visitors]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: eventId
 *         required: true
 *         schema:
 *           type: integer
 *         description: Event ID
 *         example: 1
 *       - in: query
 *         name: q
 *         required: true
 *         schema:
 *           type: string
 *         description: Search query (name, email, or phone)
 *         example: John
 *     responses:
 *       200:
 *         description: Search results
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 visitors:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Visitor'
 *       400:
 *         description: Missing parameters
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       401:
 *         description: Unauthorized
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       500:
 *         description: Server error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
router.get('/:eventId/visitors/search', searchVisitors);

/**
 * @swagger
 * /api/visitors/{eventId}/visitors:
 *   post:
 *     summary: Create a new visitor for an event
 *     tags: [Visitors]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: eventId
 *         required: true
 *         schema:
 *           type: integer
 *         description: Event ID
 *         example: 1
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - full_name
 *               - phone
 *             properties:
 *               full_name:
 *                 type: string
 *                 example: Sarah Connor
 *               phone:
 *                 type: string
 *                 example: +1555666777
 *               email:
 *                 type: string
 *                 format: email
 *                 example: sarah@example.com
 *               company:
 *                 type: string
 *                 example: Cyberdyne Systems
 *     responses:
 *       201:
 *         description: Visitor created successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 visitor:
 *                   $ref: '#/components/schemas/Visitor'
 *       400:
 *         description: Validation error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       401:
 *         description: Unauthorized
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       500:
 *         description: Server error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
router.post('/:eventId/visitors', createVisitor);

/**
 * @swagger
 * /api/visitors/{eventId}/visitors/bulk:
 *   post:
 *     summary: Bulk create visitors for an event
 *     tags: [Visitors]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: eventId
 *         required: true
 *         schema:
 *           type: integer
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               visitors:
 *                 type: array
 *                 items:
 *                   $ref: '#/components/schemas/Visitor'
 *     responses:
 *       201:
 *         description: Visitors imported successfully
 */
router.post('/:eventId/visitors/bulk', bulkCreateVisitors);

/**
 * @swagger
 * /api/visitors/{id}:
 *   put:
 *     summary: Update a visitor
 *     tags: [Visitors]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: Visitor ID
 *         example: 1
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               full_name:
 *                 type: string
 *                 example: Johnathan Doe
 *               phone:
 *                 type: string
 *                 example: +1234567890
 *               email:
 *                 type: string
 *                 format: email
 *                 example: john.doe@example.com
 *               company:
 *                 type: string
 *                 example: Tech Corp Inc
 *     responses:
 *       200:
 *         description: Visitor updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 visitor:
 *                   $ref: '#/components/schemas/Visitor'
 *       400:
 *         description: Invalid visitor ID
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       401:
 *         description: Unauthorized
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       404:
 *         description: Visitor not found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       500:
 *         description: Server error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
router.put('/:id', updateVisitor);

/**
 * @swagger
 * /api/visitors/{id}:
 *   delete:
 *     summary: Delete a visitor (admin only)
 *     tags: [Visitors]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: Visitor ID
 *         example: 1
 *     responses:
 *       200:
 *         description: Visitor deleted successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 message:
 *                   type: string
 *                   example: Visitor deleted successfully
 *       400:
 *         description: Invalid visitor ID
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       401:
 *         description: Unauthorized or insufficient permissions
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       403:
 *         description: Forbidden - Admin access required
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       404:
 *         description: Visitor not found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       500:
 *         description: Server error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
router.delete('/:id', authorize('admin'), deleteVisitor);

export default router;