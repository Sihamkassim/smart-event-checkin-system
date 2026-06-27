"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const sequelize_1 = require("sequelize");
const database_1 = __importDefault(require("../config/database"));
class CheckInLog extends sequelize_1.Model {
}
CheckInLog.init({
    id: {
        type: sequelize_1.DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
    },
    event_id: {
        type: sequelize_1.DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: 'events',
            key: 'id',
        },
    },
    visitor_id: {
        type: sequelize_1.DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: 'visitors',
            key: 'id',
        },
    },
    token: {
        type: sequelize_1.DataTypes.STRING(50),
        allowNull: false,
    },
    status: {
        type: sequelize_1.DataTypes.ENUM('success', 'duplicate', 'invalid'),
        allowNull: false,
    },
    message: {
        type: sequelize_1.DataTypes.TEXT,
        allowNull: false,
    },
    checked_in_at: {
        type: sequelize_1.DataTypes.DATE,
        allowNull: false,
    },
    created_at: {
        type: sequelize_1.DataTypes.DATE,
        defaultValue: sequelize_1.DataTypes.NOW,
    },
}, {
    sequelize: database_1.default,
    tableName: 'check_in_logs',
    timestamps: false,
});
exports.default = CheckInLog;
