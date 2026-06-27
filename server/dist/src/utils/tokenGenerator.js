"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.generateToken = void 0;
const models_1 = require("../models");
const generateToken = async () => {
    let token;
    let isUnique = false;
    while (!isUnique) {
        // Generate a random token (format: TKN-XXXXXX)
        const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
        let random = "";
        for (let i = 0; i < 6; i++) {
            random += chars.charAt(Math.floor(Math.random() * chars.length));
        }
        token = `TKN-${random}`;
        // Check if token already exists
        const existing = await models_1.Visitor.findOne({
            where: { check_in_token: token },
        });
        if (!existing) {
            isUnique = true;
            return token;
        }
    }
    return "TKN-" + Date.now().toString(36).toUpperCase();
};
exports.generateToken = generateToken;
