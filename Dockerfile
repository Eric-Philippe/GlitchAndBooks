# Build stage
FROM node:20-alpine AS builder

# Set the working directory
WORKDIR /app

# Copy package files and install dependencies
COPY client/package*.json ./client/
COPY server/package*.json ./server/

# Install dependencies (including devDependencies for build)
WORKDIR /app/client
RUN npm ci --silent

WORKDIR /app/server
RUN npm ci --silent

# Copy source code
WORKDIR /app
COPY client/ ./client/
COPY server/ ./server/

# Build applications
WORKDIR /app/client
RUN npm run build

WORKDIR /app/server
RUN npm run build

# Production stage
FROM node:20-alpine AS production

# Create non-root user for security
RUN addgroup -g 1001 -S nodejs && adduser -S nodejs -u 1001

# Set working directory
WORKDIR /app

# Copy package files for production dependencies only
COPY server/package*.json ./
RUN npm ci --only=production --silent && npm cache clean --force

# Copy built applications from builder stage
COPY --from=builder /app/server/dist ./dist
COPY --from=builder /app/client/build ./public

# Change ownership to nodejs user
RUN chown -R nodejs:nodejs /app

# Switch to non-root user
USER nodejs

# Expose port
EXPOSE 80

# Start the server
CMD ["node", "dist/server.js"]
