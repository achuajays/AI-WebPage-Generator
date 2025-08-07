# --- Stage 1: Build Vite app ---
FROM node:lts-alpine AS build

ENV NPM_CONFIG_UPDATE_NOTIFIER=false
ENV NPM_CONFIG_FUND=false

WORKDIR /app

# Install dependencies
COPY package*.json ./
RUN npm install  # or `npm ci` if lock file exists

# Copy source and build
COPY . .
RUN npm run build

# --- Stage 2: Serve with Caddy ---
FROM caddy:alpine

WORKDIR /app

# Copy and format Caddyfile
COPY Caddyfile .
RUN caddy fmt Caddyfile --overwrite

# Copy built files only
COPY --from=build /app/dist ./dist

# Serve using Caddy (no npm needed)
CMD ["caddy", "run", "--config", "Caddyfile", "--adapter", "caddyfile"]
