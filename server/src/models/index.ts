import User from './User';
import Event from './Event';
import Visitor from './Visitor';
import CheckInLog from './CheckInLog';
import SystemStat from './SystemStat';

// User - Event (no direct relation needed)

// Event - Visitor (One-to-Many)
Event.hasMany(Visitor, {
  foreignKey: 'event_id',
  as: 'visitors',
});
Visitor.belongsTo(Event, {
  foreignKey: 'event_id',
  as: 'event',
});

// Event - CheckInLog (One-to-Many)
Event.hasMany(CheckInLog, {
  foreignKey: 'event_id',
  as: 'checkInLogs',
});
CheckInLog.belongsTo(Event, {
  foreignKey: 'event_id',
  as: 'event',
});

// Visitor - CheckInLog (One-to-Many)
Visitor.hasMany(CheckInLog, {
  foreignKey: 'visitor_id',
  as: 'checkInLogs',
});
CheckInLog.belongsTo(Visitor, {
  foreignKey: 'visitor_id',
  as: 'visitor',
});

export { User, Event, Visitor, CheckInLog, SystemStat };