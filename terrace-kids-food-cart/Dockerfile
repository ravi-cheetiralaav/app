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

# Only install production dependencies
COPY package.json package-lock.json ./
RUN npm ci --production

# Copy built files from builder
COPY --from=builder /app/.next .next
COPY --from=builder /app/public ./public
COPY --from=builder /app/next.config.js ./next.config.js
COPY --from=builder /app/package.json ./package.json

ENV NODE_ENV=production
ENV PORT=3000

EXPOSE 3000

CMD ["npx", "next", "start", "-p", "3000"]
