# Stage 1: Build
FROM node:20-alpine AS builder

WORKDIR /app

# Copy package.json and lock files
COPY package*.json ./

# Install dependencies (including dev dependencies for TypeScript)
RUN npm install

# Copy source code
COPY . .

# Build the TypeScript code
RUN npm run build

# Stage 2: Production
FROM node:20-alpine

WORKDIR /app

# Copy package files
COPY package*.json ./

# Install only production dependencies
RUN npm install --omit=dev

# Copy compiled code from builder
COPY --from=builder /app/dist ./dist

# Expose port
EXPOSE 5000

# Start the server
CMD ["node", "dist/server.js"]
