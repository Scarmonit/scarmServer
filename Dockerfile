# syntax=docker/dockerfile:1.7

# ---- Base image ----
FROM node:22-alpine AS base
ENV NODE_ENV=production
WORKDIR /app

# Install only production deps first (layer caching); will copy dev deps later for tests if needed
COPY package.json package-lock.json* ./
RUN npm ci --omit=dev || npm install --omit=dev

# Copy source
COPY . .

# Expose port
ENV PORT=3000 HOST=0.0.0.0
EXPOSE 3000

# HEALTHCHECK: ensure /health responds with status ok
HEALTHCHECK --interval=30s --timeout=5s --start-period=10s --retries=3 \
  CMD wget -qO- http://localhost:$PORT/health | grep '"status":"ok"' || exit 1

# Run the app
CMD ["node", "src/index.js"]
