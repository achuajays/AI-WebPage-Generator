# Stage 1: Build the app
FROM node:20-alpine AS builder

WORKDIR /app

# Copy package.json and lock file first
COPY package.json package-lock.json* ./

# Install dependencies
RUN npm install

# Copy the rest of the app
COPY . .

# Build the Vite app
RUN npm run build

# Stage 2: Serve with serve
FROM node:20-alpine

WORKDIR /app

# Install serve globally
RUN npm install -g serve

# Copy the built app from the builder stage
COPY --from=builder /app/dist ./dist

# Expose the port Railway expects
EXPOSE 3000

# Serve the app
CMD ["serve", "-s", "dist", "-l", "3000"]
