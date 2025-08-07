# Stage 1: Build the Vite app using Node
FROM node:lts-alpine AS build

ENV NPM_CONFIG_UPDATE_NOTIFIER=false
ENV NPM_CONFIG_FUND=false

WORKDIR /app

COPY package*.json ./
RUN npm ci

COPY . ./
RUN npm run build

# Stage 2: Serve with Caddy
FROM caddy:alpine

WORKDIR /app

# Copy and format the Caddyfile
COPY Caddyfile .
RUN caddy fmt Caddyfile --overwrite

# Copy built static files
COPY --from=build /app/dist ./dist

# Run Caddy
CMD ["caddy", "run", "--config", "Caddyfile", "--adapter", "caddyfile"]
