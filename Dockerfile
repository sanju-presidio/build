# Stage 1: Builder
FROM node:20.14.0 as builder

# Install build dependencies
RUN apt-get update && apt-get install -y \
    build-essential \
    libcairo2-dev \
    libpango1.0-dev \
    libjpeg-dev \
    libpng-dev \
    libgif-dev \
    librsvg2-dev \
    pkg-config \
    python3

# Set working directory in the builder stage
WORKDIR /app

# Copy package files for dependencies installation
COPY package*.json ./

RUN npm install

# Copy the rest of the app's code to the builder
COPY . .

# Build the application (use npm scripts to build if defined, or skip if unnecessary)
RUN npm run build
# Stage 2: Final app image
FROM mcr.microsoft.com/playwright:v1.39.0 as app

# Set working directory for the app
WORKDIR /app

# Copy package files and built dist
COPY --from=builder /app/package*.json ./
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/.env .env

RUN npx playwright install --with-deps
# Optionally expose a port (default port your app uses)
EXPOSE 3000

# Define the startup command
CMD ["node", "dist/main.js"]
