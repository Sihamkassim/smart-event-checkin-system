"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const app_1 = __importDefault(require("./src/app"));
const database_1 = __importDefault(require("./src/config/database"));
const PORT = process.env.PORT || 5000;
const startServer = async () => {
    try {
        // Test database connection
        await database_1.default.authenticate();
        console.log('✅ Database connection established successfully.');
        // Sync database (use { alter: true } for development)
        await database_1.default.sync({ alter: true });
        console.log('✅ Database synchronized');
        // Start server
        app_1.default.listen(PORT, () => {
            console.log(`🚀 Server running on http://localhost:${PORT}`);
            console.log(`📁 Environment: ${process.env.NODE_ENV || 'development'}`);
            console.log(`🔐 JWT Secret: ${process.env.JWT_SECRET ? '✅ Set' : '❌ Not set'}`);
        });
    }
    catch (error) {
        console.error('❌ Unable to start server:', error);
        process.exit(1);
    }
};
// Handle unhandled promise rejections
process.on('unhandledRejection', (error) => {
    console.error('Unhandled Rejection:', error);
    process.exit(1);
});
startServer();
exports.default = app_1.default;
