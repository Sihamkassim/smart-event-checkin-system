"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.VisitorService = void 0;
const models_1 = require("../models");
const sequelize_1 = require("sequelize");
const tokenGenerator_1 = require("../utils/tokenGenerator");
class VisitorService {
    static async getVisitorsByEvent(eventId) {
        try {
            const visitors = await models_1.Visitor.findAll({
                where: { event_id: eventId },
                order: [["created_at", "DESC"]],
            });
            return {
                success: true,
                visitors,
            };
        }
        catch (error) {
            console.error("Get visitors service error:", error);
            return {
                success: false,
                message: "Failed to get visitors",
            };
        }
    }
    static async searchVisitors(eventId, query) {
        try {
            const visitors = await models_1.Visitor.findAll({
                where: {
                    event_id: eventId,
                    [sequelize_1.Op.or]: [
                        { full_name: { [sequelize_1.Op.like]: `%${query}%` } },
                        { phone: { [sequelize_1.Op.like]: `%${query}%` } },
                        { email: { [sequelize_1.Op.like]: `%${query}%` } },
                    ],
                },
                order: [["created_at", "DESC"]],
            });
            return {
                success: true,
                visitors,
            };
        }
        catch (error) {
            console.error("Search visitors service error:", error);
            return {
                success: false,
                message: "Failed to search visitors",
            };
        }
    }
    static async createVisitor(data) {
        try {
            // Check if event exists
            const event = await models_1.Event.findByPk(data.event_id);
            if (!event) {
                return {
                    success: false,
                    message: "Event not found",
                };
            }
            // Generate unique token
            const token = await (0, tokenGenerator_1.generateToken)();
            const visitor = await models_1.Visitor.create({
                ...data,
                check_in_token: token,
                checked_in: false,
            });
            return {
                success: true,
                visitor,
            };
        }
        catch (error) {
            console.error("Create visitor service error:", error);
            return {
                success: false,
                message: "Failed to create visitor",
            };
        }
    }
    static async updateVisitor(id, data) {
        try {
            const visitor = await models_1.Visitor.findByPk(id);
            if (!visitor) {
                return {
                    success: false,
                    message: "Visitor not found",
                };
            }
            await visitor.update({
                ...data,
                updated_at: new Date(),
            });
            return {
                success: true,
                visitor,
            };
        }
        catch (error) {
            console.error("Update visitor service error:", error);
            return {
                success: false,
                message: "Failed to update visitor",
            };
        }
    }
    static async deleteVisitor(id) {
        try {
            const visitor = await models_1.Visitor.findByPk(id);
            if (!visitor) {
                return {
                    success: false,
                    message: "Visitor not found",
                };
            }
            await visitor.destroy();
            return {
                success: true,
                message: "Visitor deleted successfully",
            };
        }
        catch (error) {
            console.error("Delete visitor service error:", error);
            return {
                success: false,
                message: "Failed to delete visitor",
            };
        }
    }
}
exports.VisitorService = VisitorService;
