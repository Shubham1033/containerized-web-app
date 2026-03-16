# backend/Dockerfile

# --- Stage 1: Builder ---
FROM node:18-alpine AS builder
WORKDIR /app
COPY package*.json ./
RUN npm install 
COPY . .

# --- Stage 2: Runtime ---
FROM node:18-alpine
WORKDIR /app

# Set non-root user (built into the node image)
RUN chown -R node:node /app
USER node

# Copy only necessary files from builder
COPY --from=builder --chown=node:node /app/node_modules ./node_modules
COPY --from=builder --chown=node:node /app/server.js ./
COPY --from=builder --chown=node:node /app/package.json ./

EXPOSE 3000
CMD ["npm", "start"]