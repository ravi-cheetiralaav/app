## Stage 1: Install dependencies and build
FROM node:18-alpine AS builder
WORKDIR /app

# Install deps (use package-lock)
COPY package.json package-lock.json ./
RUN npm ci --production=false

# Copy source and build
COPY . .
RUN npm run build

## Stage 2: Production image
FROM node:18-alpine AS runner
WORKDIR /app

# Copy package metadata (not strictly required but keeps image metadata consistent)
COPY package.json package-lock.json ./

# Copy node_modules from the builder stage. This avoids re-running `npm ci` in the
# runner where native modules (e.g. better-sqlite3) would attempt to rebuild and
# fail due to missing build tools in the slim runtime image.
COPY --from=builder /app/node_modules ./node_modules

# Copy built files from builder
COPY --from=builder /app/.next .next
COPY --from=builder /app/public ./public
COPY --from=builder /app/next.config.js ./next.config.js
COPY --from=builder /app/package.json ./package.json

ENV NODE_ENV=production
ENV PORT=3000

EXPOSE 3000

CMD ["npx", "next", "start", "-p", "3000"]
