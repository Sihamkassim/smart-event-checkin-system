"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.CheckInLog = exports.Visitor = exports.Event = exports.User = void 0;
const User_1 = __importDefault(require("./User"));
exports.User = User_1.default;
const Event_1 = __importDefault(require("./Event"));
exports.Event = Event_1.default;
const Visitor_1 = __importDefault(require("./Visitor"));
exports.Visitor = Visitor_1.default;
const CheckInLog_1 = __importDefault(require("./CheckInLog"));
exports.CheckInLog = CheckInLog_1.default;
// User - Event (no direct relation needed)
// Event - Visitor (One-to-Many)
Event_1.default.hasMany(Visitor_1.default, {
    foreignKey: 'event_id',
    as: 'visitors',
});
Visitor_1.default.belongsTo(Event_1.default, {
    foreignKey: 'event_id',
    as: 'event',
});
// Event - CheckInLog (One-to-Many)
Event_1.default.hasMany(CheckInLog_1.default, {
    foreignKey: 'event_id',
    as: 'checkInLogs',
});
CheckInLog_1.default.belongsTo(Event_1.default, {
    foreignKey: 'event_id',
    as: 'event',
});
// Visitor - CheckInLog (One-to-Many)
Visitor_1.default.hasMany(CheckInLog_1.default, {
    foreignKey: 'visitor_id',
    as: 'checkInLogs',
});
CheckInLog_1.default.belongsTo(Visitor_1.default, {
    foreignKey: 'visitor_id',
    as: 'visitor',
});
