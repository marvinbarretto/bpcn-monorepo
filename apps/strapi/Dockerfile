# Stage 1: Build the Strapi admin panel
FROM node:18-alpine AS builder

WORKDIR /app

# Copy only the files needed for install and build
COPY ../../package.json ../../package-lock.json ./
COPY . .

# Install full deps
RUN npm ci

# Build Strapi admin UI
RUN npm run build

# Stage 2: Run Strapi with only production dependencies
FROM node:18-alpine

WORKDIR /app

# Copy the built app from builder
COPY --from=builder /app /app

# Clean dev deps to shrink image size
RUN npm ci --omit=dev

EXPOSE 1337

# Optional: Add a healthcheck (can remove if not needed)
HEALTHCHECK --interval=10s --timeout=3s \
  CMD wget --no-verbose --tries=1 --spider http://localhost:1337 || exit 1

CMD ["npm", "start"]
