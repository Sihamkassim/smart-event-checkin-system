"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.checkInVisitor = void 0;
const checkinService_1 = require("../service/checkinService");
const checkInVisitor = async (req, res) => {
    try {
        const { token } = req.body;
        if (!token) {
            return res.status(400).json({
                success: false,
                message: 'Token is required',
            });
        }
        const result = await checkinService_1.CheckInService.checkIn(token, req.user.id);
        if (!result.success) {
            return res.status(400).json(result);
        }
        res.json(result);
    }
    catch (error) {
        console.error('Check-in error:', error);
        res.status(500).json({
            success: false,
            message: 'Server error',
        });
    }
};
exports.checkInVisitor = checkInVisitor;
