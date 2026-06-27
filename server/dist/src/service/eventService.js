"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.EventService = void 0;
const models_1 = require("../models");
class EventService {
    static async getAllEvents() {
        try {
            const events = await models_1.Event.findAll({
                order: [['created_at', 'DESC']],
            });
            return {
                success: true,
                events,
            };
        }
        catch (error) {
            console.error('Get all events service error:', error);
            return {
                success: false,
                message: 'Failed to get events',
            };
        }
    }
    static async getEventById(id) {
        try {
            const event = await models_1.Event.findByPk(id);
            if (!event) {
                return {
                    success: false,
                    message: 'Event not found',
                };
            }
            return {
                success: true,
                event,
            };
        }
        catch (error) {
            console.error('Get event by ID service error:', error);
            return {
                success: false,
                message: 'Failed to get event',
            };
        }
    }
    static async createEvent(data) {
        try {
            const event = await models_1.Event.create({
                ...data,
                status: data.status || 'draft',
            });
            return {
                success: true,
                event,
            };
        }
        catch (error) {
            console.error('Create event service error:', error);
            return {
                success: false,
                message: 'Failed to create event',
            };
        }
    }
    static async updateEvent(id, data) {
        try {
            const event = await models_1.Event.findByPk(id);
            if (!event) {
                return {
                    success: false,
                    message: 'Event not found',
                };
            }
            await event.update({
                ...data,
                updated_at: new Date(),
            });
            return {
                success: true,
                event,
            };
        }
        catch (error) {
            console.error('Update event service error:', error);
            return {
                success: false,
                message: 'Failed to update event',
            };
        }
    }
    static async deleteEvent(id) {
        try {
            const event = await models_1.Event.findByPk(id);
            if (!event) {
                return {
                    success: false,
                    message: 'Event not found',
                };
            }
            await event.destroy();
            return {
                success: true,
                message: 'Event deleted successfully',
            };
        }
        catch (error) {
            console.error('Delete event service error:', error);
            return {
                success: false,
                message: 'Failed to delete event',
            };
        }
    }
    static async getEventStats(id) {
        try {
            const event = await models_1.Event.findByPk(id);
            if (!event) {
                return {
                    success: false,
                    message: 'Event not found',
                };
            }
            const totalVisitors = await models_1.Visitor.count({ where: { event_id: id } });
            const checkedIn = await models_1.Visitor.count({
                where: { event_id: id, checked_in: true },
            });
            const pending = totalVisitors - checkedIn;
            const recentCheckIns = await models_1.CheckInLog.findAll({
                where: { event_id: id, status: 'success' },
                order: [['checked_in_at', 'DESC']],
                limit: 10,
            });
            return {
                success: true,
                stats: {
                    total_visitors: totalVisitors,
                    checked_in: checkedIn,
                    not_checked_in: pending,
                    check_in_percentage: totalVisitors > 0
                        ? Math.round((checkedIn / totalVisitors) * 100)
                        : 0,
                    recentCheckIns,
                },
            };
        }
        catch (error) {
            console.error('Get event stats service error:', error);
            return {
                success: false,
                message: 'Failed to get event stats',
            };
        }
    }
}
exports.EventService = EventService;
