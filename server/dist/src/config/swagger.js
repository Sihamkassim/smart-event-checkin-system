"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.swaggerSpec = void 0;
const swagger_jsdoc_1 = __importDefault(require("swagger-jsdoc"));
const options = {
    definition: {
        openapi: '3.0.0',
        info: {
            title: 'Smart Event Check-in System API',
            version: '1.0.0',
            description: 'API documentation for the Smart Event Check-in System. Manage events, visitors, and check-ins with JWT authentication.',
            contact: {
                name: 'API Support',
                email: 'support@lahn.test',
            },
        },
        servers: [
            {
                url: 'http://localhost:5000',
                description: 'Development server',
            },
        ],
        components: {
            securitySchemes: {
                bearerAuth: {
                    type: 'http',
                    scheme: 'bearer',
                    bearerFormat: 'JWT',
                    description: 'JWT authentication token. Login via /api/auth/login to get the token.',
                },
            },
            schemas: {
                User: {
                    type: 'object',
                    properties: {
                        id: { type: 'number' },
                        name: { type: 'string' },
                        email: { type: 'string', format: 'email' },
                        role: { type: 'string', enum: ['admin', 'staff'] },
                        created_at: { type: 'string', format: 'date-time' },
                    },
                },
                Event: {
                    type: 'object',
                    properties: {
                        id: { type: 'number' },
                        name: { type: 'string' },
                        date: { type: 'string', format: 'date-time' },
                        location: { type: 'string' },
                        status: { type: 'string', enum: ['draft', 'active', 'completed'] },
                        created_at: { type: 'string', format: 'date-time' },
                        updated_at: { type: 'string', format: 'date-time' },
                    },
                },
                Visitor: {
                    type: 'object',
                    properties: {
                        id: { type: 'number' },
                        event_id: { type: 'number' },
                        full_name: { type: 'string' },
                        phone: { type: 'string' },
                        email: { type: 'string', format: 'email' },
                        company: { type: 'string' },
                        check_in_token: { type: 'string' },
                        checked_in: { type: 'boolean' },
                        checked_in_at: { type: 'string', format: 'date-time', nullable: true },
                        created_at: { type: 'string', format: 'date-time' },
                    },
                },
                CheckInLog: {
                    type: 'object',
                    properties: {
                        id: { type: 'number' },
                        event_id: { type: 'number' },
                        visitor_id: { type: 'number' },
                        token: { type: 'string' },
                        status: { type: 'string', enum: ['success', 'duplicate', 'invalid'] },
                        message: { type: 'string' },
                        checked_in_at: { type: 'string', format: 'date-time' },
                        created_at: { type: 'string', format: 'date-time' },
                    },
                },
                Error: {
                    type: 'object',
                    properties: {
                        success: { type: 'boolean', example: false },
                        message: { type: 'string' },
                        errors: {
                            type: 'array',
                            items: { type: 'string' },
                        },
                    },
                },
            },
        },
        security: [
            {
                bearerAuth: [],
            },
        ],
    },
    apis: ['./src/routes/*.ts'],
};
exports.swaggerSpec = (0, swagger_jsdoc_1.default)(options);
