# Stage 1: Install deps and build SSR app
FROM node:22-alpine AS builder

WORKDIR /app

# Copy root files for Nx + lockfile for dependency integrity
COPY ../../package.json ../../nx.json ../../tsconfig.base.json ./
COPY ../../package-lock.json ./

# Install root deps
RUN npm ci

# Copy full monorepo (assumes Nx needs context from all apps/libs)
COPY ../../ .

# Build SSR target
RUN npm run build:ssr

# Stage 2: Run SSR app
FROM node:22-alpine

WORKDIR /app

# Copy build artifacts and runtime files
COPY --from=builder /app/dist/apps/frontend /app/dist/apps/frontend
COPY --from=builder /app/node_modules /app/node_modules
COPY --from=builder /app/package.json /app/package.json

EXPOSE 4000

CMD ["node", "dist/apps/frontend/server/server.mjs"]
