"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.CheckInService = void 0;
const models_1 = require("../models");
const database_1 = __importDefault(require("../config/database"));
class CheckInService {
    static async checkIn(token, userId) {
        const transaction = await database_1.default.transaction();
        try {
            // Find visitor by token
            const visitor = await models_1.Visitor.findOne({
                where: { check_in_token: token },
                transaction,
            });
            if (!visitor) {
                await models_1.CheckInLog.create({
                    event_id: 0,
                    visitor_id: 0,
                    token,
                    status: "invalid",
                    message: "Invalid token: Visitor not found",
                    checked_in_at: new Date(),
                }, { transaction });
                await transaction.commit();
                return {
                    success: false,
                    message: "Invalid token: Visitor not found",
                };
            }
            // Check if already checked in
            if (visitor.checked_in) {
                await models_1.CheckInLog.create({
                    event_id: visitor.event_id,
                    visitor_id: visitor.id,
                    token,
                    status: "duplicate",
                    message: `${visitor.full_name} is already checked in at ${visitor.checked_in_at}`,
                    checked_in_at: new Date(),
                }, { transaction });
                await transaction.commit();
                return {
                    success: false,
                    message: `${visitor.full_name} is already checked in at ${visitor.checked_in_at}`,
                    visitor,
                };
            }
            // Check in visitor
            const now = new Date();
            visitor.checked_in = true;
            visitor.checked_in_at = now;
            await visitor.save({ transaction });
            // Log check-in
            await models_1.CheckInLog.create({
                event_id: visitor.event_id,
                visitor_id: visitor.id,
                token,
                status: "success",
                message: `${visitor.full_name} checked in successfully`,
                checked_in_at: now,
            }, { transaction });
            await transaction.commit();
            return {
                success: true,
                message: `${visitor.full_name} checked in successfully`,
                visitor: {
                    id: visitor.id,
                    full_name: visitor.full_name,
                    phone: visitor.phone,
                    checked_in: visitor.checked_in,
                    checked_in_at: visitor.checked_in_at,
                },
            };
        }
        catch (error) {
            await transaction.rollback();
            console.error("Check-in service error:", error);
            return {
                success: false,
                message: "Failed to check in visitor",
            };
        }
    }
}
exports.CheckInService = CheckInService;
