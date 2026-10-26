# ==============================================================================
# SkoolFinder Ghana - Production Docker Container
# Multi-stage / Lean Production Node 20 Alpine Image
# ==============================================================================

FROM node:20-alpine AS base

# Install curl for container healthcheck and tzdata for Ghana time (UTC/GMT)
RUN apk add --no-cache curl tzdata

# Set Ghana/Accra timezone (UTC / GMT standard)
ENV TZ=Africa/Accra

WORKDIR /app

# Set production environment
ENV NODE_ENV=production
ENV PORT=3000

# Copy package files first to leverage Docker layer caching
COPY package*.json ./

# Install only production dependencies
RUN npm ci --omit=dev --ignore-scripts

# Copy application source code
COPY server.js ./
COPY data/ ./data/
COPY public/ ./public/
COPY scripts/ ./scripts/

# Create backups and data directories and grant permissions to node user
RUN mkdir -p /app/backups /app/data && chown -R node:node /app

# Switch to non-root node user for container security
USER node

# Expose HTTP port
EXPOSE 3000

# Container healthcheck targeting the /health endpoint
HEALTHCHECK --interval=30s --timeout=5s --start-period=10s --retries=3 \
  CMD curl -f http://localhost:3000/health || exit 1

# Start SkoolFinder Enterprise Server
CMD ["node", "server.js"]
