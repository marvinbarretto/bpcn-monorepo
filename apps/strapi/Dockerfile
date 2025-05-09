# Stage 1: Build the admin panel
FROM node:18-alpine AS builder

WORKDIR /app

COPY . .

# Install deps
RUN npm ci

# Build admin UI
RUN npm run build


# Stage 2: Run Strapi app
FROM node:18-alpine

WORKDIR /app

# Copy everything except node_modules
COPY . .

# Copy over the built admin UI
COPY --from=builder /app/.cache /app/.cache
COPY --from=builder /app/build /app/build

# Install only production deps
RUN npm ci --omit=dev

# Expose Strapi port
EXPOSE 1337

# Healthcheck (optional, can remove if not needed)
HEALTHCHECK --interval=10s --timeout=3s \
  CMD wget --no-verbose --tries=1 --spider http://localhost:1337 || exit 1

CMD ["npm", "start"]
