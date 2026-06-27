"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getEventStats = exports.deleteEvent = exports.updateEvent = exports.createEvent = exports.getEventById = exports.getEvents = void 0;
const eventService_1 = require("../service/eventService");
const getEvents = async (req, res) => {
    try {
        const result = await eventService_1.EventService.getAllEvents();
        if (!result.success) {
            return res.status(400).json(result);
        }
        res.json(result);
    }
    catch (error) {
        console.error('Get events error:', error);
        res.status(500).json({ success: false, message: 'Server error' });
    }
};
exports.getEvents = getEvents;
const getEventById = async (req, res) => {
    try {
        const { id } = req.params;
        if (!id) {
            return res.status(400).json({ success: false, message: 'Event ID is required' });
        }
        const result = await eventService_1.EventService.getEventById(parseInt(id));
        if (!result.success) {
            return res.status(404).json(result);
        }
        res.json(result);
    }
    catch (error) {
        console.error('Get event by ID error:', error);
        res.status(500).json({ success: false, message: 'Server error' });
    }
};
exports.getEventById = getEventById;
const createEvent = async (req, res) => {
    try {
        const { name, date, location, status } = req.body;
        if (!name || !date || !location) {
            return res.status(400).json({
                success: false,
                message: 'Name, date, and location are required',
            });
        }
        const result = await eventService_1.EventService.createEvent({ name, date, location, status });
        if (!result.success) {
            return res.status(400).json(result);
        }
        res.status(201).json(result);
    }
    catch (error) {
        console.error('Create event error:', error);
        res.status(500).json({ success: false, message: 'Server error' });
    }
};
exports.createEvent = createEvent;
const updateEvent = async (req, res) => {
    try {
        const { id } = req.params;
        const { name, date, location, status } = req.body;
        if (!id) {
            return res.status(400).json({ success: false, message: 'Event ID is required' });
        }
        const result = await eventService_1.EventService.updateEvent(parseInt(id), { name, date, location, status });
        if (!result.success) {
            return res.status(404).json(result);
        }
        res.json(result);
    }
    catch (error) {
        console.error('Update event error:', error);
        res.status(500).json({ success: false, message: 'Server error' });
    }
};
exports.updateEvent = updateEvent;
const deleteEvent = async (req, res) => {
    try {
        const { id } = req.params;
        if (!id) {
            return res.status(400).json({ success: false, message: 'Event ID is required' });
        }
        const result = await eventService_1.EventService.deleteEvent(parseInt(id));
        if (!result.success) {
            return res.status(404).json(result);
        }
        res.json(result);
    }
    catch (error) {
        console.error('Delete event error:', error);
        res.status(500).json({ success: false, message: 'Server error' });
    }
};
exports.deleteEvent = deleteEvent;
const getEventStats = async (req, res) => {
    try {
        const { id } = req.params;
        if (!id) {
            return res.status(400).json({ success: false, message: 'Event ID is required' });
        }
        const result = await eventService_1.EventService.getEventStats(parseInt(id));
        if (!result.success) {
            return res.status(404).json(result);
        }
        res.json(result);
    }
    catch (error) {
        console.error('Get event stats error:', error);
        res.status(500).json({ success: false, message: 'Server error' });
    }
};
exports.getEventStats = getEventStats;
