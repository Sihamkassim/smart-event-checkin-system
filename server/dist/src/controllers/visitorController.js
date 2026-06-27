"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteVisitor = exports.updateVisitor = exports.createVisitor = exports.searchVisitors = exports.getVisitors = void 0;
const visitorService_1 = require("../service/visitorService");
const getVisitors = async (req, res) => {
    try {
        const { eventId } = req.params;
        if (!eventId) {
            return res.status(400).json({
                success: false,
                message: 'Event ID is required',
            });
        }
        const result = await visitorService_1.VisitorService.getVisitorsByEvent(parseInt(eventId));
        if (!result.success) {
            return res.status(400).json(result);
        }
        res.json(result);
    }
    catch (error) {
        console.error('Get visitors error:', error);
        res.status(500).json({
            success: false,
            message: 'Server error',
        });
    }
};
exports.getVisitors = getVisitors;
const searchVisitors = async (req, res) => {
    try {
        const { eventId } = req.params;
        const { q } = req.query;
        if (!eventId) {
            return res.status(400).json({
                success: false,
                message: 'Event ID is required',
            });
        }
        if (!q) {
            return res.status(400).json({
                success: false,
                message: 'Search query is required',
            });
        }
        const result = await visitorService_1.VisitorService.searchVisitors(parseInt(eventId), q);
        if (!result.success) {
            return res.status(400).json(result);
        }
        res.json(result);
    }
    catch (error) {
        console.error('Search visitors error:', error);
        res.status(500).json({
            success: false,
            message: 'Server error',
        });
    }
};
exports.searchVisitors = searchVisitors;
const createVisitor = async (req, res) => {
    try {
        const { eventId } = req.params;
        const { full_name, phone, email, company } = req.body;
        if (!eventId) {
            return res.status(400).json({
                success: false,
                message: 'Event ID is required',
            });
        }
        if (!full_name || !phone) {
            return res.status(400).json({
                success: false,
                message: 'Full name and phone are required',
            });
        }
        const result = await visitorService_1.VisitorService.createVisitor({
            event_id: parseInt(eventId),
            full_name,
            phone,
            email,
            company,
        });
        if (!result.success) {
            return res.status(400).json(result);
        }
        res.status(201).json(result);
    }
    catch (error) {
        console.error('Create visitor error:', error);
        res.status(500).json({
            success: false,
            message: 'Server error',
        });
    }
};
exports.createVisitor = createVisitor;
const updateVisitor = async (req, res) => {
    try {
        const { id } = req.params;
        const { full_name, phone, email, company } = req.body;
        if (!id) {
            return res.status(400).json({
                success: false,
                message: 'Visitor ID is required',
            });
        }
        const result = await visitorService_1.VisitorService.updateVisitor(parseInt(id), {
            full_name,
            phone,
            email,
            company,
        });
        if (!result.success) {
            return res.status(404).json(result);
        }
        res.json(result);
    }
    catch (error) {
        console.error('Update visitor error:', error);
        res.status(500).json({
            success: false,
            message: 'Server error',
        });
    }
};
exports.updateVisitor = updateVisitor;
const deleteVisitor = async (req, res) => {
    try {
        const { id } = req.params;
        if (!id) {
            return res.status(400).json({
                success: false,
                message: 'Visitor ID is required',
            });
        }
        const result = await visitorService_1.VisitorService.deleteVisitor(parseInt(id));
        if (!result.success) {
            return res.status(404).json(result);
        }
        res.json(result);
    }
    catch (error) {
        console.error('Delete visitor error:', error);
        res.status(500).json({
            success: false,
            message: 'Server error',
        });
    }
};
exports.deleteVisitor = deleteVisitor;
