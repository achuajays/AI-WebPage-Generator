# Stage 1: Build the Vite app
FROM node:20-alpine AS builder

WORKDIR /app

COPY package.json package-lock.json* ./
RUN npm install

COPY . .
RUN npm run build

# Stage 2: Serve the build using 'serve'
FROM node:20-alpine

WORKDIR /app

# Install 'serve' globally
RUN npm install -g serve

# Copy the build output from builder
COPY --from=builder /app/dist ./dist

# App will run on port 3000
EXPOSE 3000

# Command to serve the Vite build
CMD ["serve", "-s", "dist", "-l", "3000"]
