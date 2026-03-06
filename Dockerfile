# ── ARTWAVE Backend Dockerfile ──
FROM node:20-alpine

# Set working directory
WORKDIR /app

# Copy package files first (layer cache)
COPY package*.json ./

# Install dependencies
RUN npm install --omit=dev

# Copy source
COPY . .

# Create uploads directory
RUN mkdir -p uploads

# Expose port
EXPOSE 5000

# Health check
HEALTHCHECK --interval=30s --timeout=10s --start-period=5s --retries=3 \
  CMD wget -qO- http://localhost:5000/api/health || exit 1

# Start
CMD ["node", "server.js"]
