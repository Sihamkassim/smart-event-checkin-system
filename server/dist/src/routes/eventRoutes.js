"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const eventController_1 = require("../controllers/eventController");
const auth_1 = require("../middleware/auth");
const router = (0, express_1.Router)();
// All routes require authentication
router.use(auth_1.authenticate);
// GET /api/events - Get all events
router.get('/', eventController_1.getEvents);
// GET /api/events/:id - Get event by ID
router.get('/:id', eventController_1.getEventById);
// POST /api/events - Create a new event (admin only)
router.post('/', (0, auth_1.authorize)('admin'), eventController_1.createEvent);
// PUT /api/events/:id - Update an event (admin only)
router.put('/:id', (0, auth_1.authorize)('admin'), eventController_1.updateEvent);
// DELETE /api/events/:id - Delete an event (admin only)
router.delete('/:id', (0, auth_1.authorize)('admin'), eventController_1.deleteEvent);
// GET /api/events/:id/stats - Get event statistics
router.get('/:id/stats', eventController_1.getEventStats);
exports.default = router;
