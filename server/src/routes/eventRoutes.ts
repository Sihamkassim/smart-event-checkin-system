import { Router } from 'express';
import {
  getEvents,
  getEventById,
  createEvent,
  updateEvent,
  deleteEvent,
  getEventStats,
} from '../controllers/eventController';
import { authenticate, authorize } from '../middleware/auth';
import { upload } from '../middleware/upload';

const router = Router();

// All routes require authentication
router.use(authenticate);

// GET /api/events - Get all events
router.get('/', getEvents);

// GET /api/events/:id - Get event by ID
router.get('/:id', getEventById);

// POST /api/events - Create a new event (admin only)
router.post('/', authorize('admin'), upload.single('image'), createEvent);

// PUT /api/events/:id - Update an event (admin only)
router.put('/:id', authorize('admin'), upload.single('image'), updateEvent);

// DELETE /api/events/:id - Delete an event (admin only)
router.delete('/:id', authorize('admin'), deleteEvent);

// GET /api/events/:id/stats - Get event statistics
router.get('/:id/stats', getEventStats);

export default router;
