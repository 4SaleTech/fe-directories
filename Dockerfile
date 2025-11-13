# Dependencies stage
FROM node:20-alpine AS deps

# Check https://github.com/nodejs/docker-node/tree/b4117f9333da4138b03a546ec926ef50a31506c3#nodealpine
RUN apk add --no-cache libc6-compat

WORKDIR /app

# Copy package files
COPY package.json package-lock.json ./

# Install dependencies
RUN npm ci --only=production

# Builder stage
FROM node:20-alpine AS builder

WORKDIR /app

# Copy dependencies from deps stage
COPY --from=deps /app/node_modules ./node_modules

# Copy source code
COPY . .

# Set build-time environment variables (will be replaced at runtime for NEXT_PUBLIC_ vars)
ARG NEXT_PUBLIC_API_BASE_URL
ARG NEXT_PUBLIC_DEVICE_ID
ARG NEXT_PUBLIC_DEVICE_TYPE
ARG NEXT_PUBLIC_VERSION_NUMBER
ARG NEXT_PUBLIC_APPLICATION_SOURCE

ENV NEXT_PUBLIC_API_BASE_URL=$NEXT_PUBLIC_API_BASE_URL
ENV NEXT_PUBLIC_DEVICE_ID=$NEXT_PUBLIC_DEVICE_ID
ENV NEXT_PUBLIC_DEVICE_TYPE=$NEXT_PUBLIC_DEVICE_TYPE
ENV NEXT_PUBLIC_VERSION_NUMBER=$NEXT_PUBLIC_VERSION_NUMBER
ENV NEXT_PUBLIC_APPLICATION_SOURCE=$NEXT_PUBLIC_APPLICATION_SOURCE

# Disable telemetry during build
ENV NEXT_TELEMETRY_DISABLED=1

# Build the application
RUN npm run build

# Runner stage
FROM node:20-alpine AS runner

WORKDIR /app

# Don't run production as root
RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs

# Copy built application
COPY --from=builder /app/public ./public
COPY --from=builder /app/.next/standalone ./
COPY --from=builder /app/.next/static ./.next/static

# Copy package.json for reference
COPY --from=builder /app/package.json ./package.json

# Set permissions
RUN chown -R nextjs:nodejs /app

USER nextjs

# Expose port
EXPOSE 3000

ENV PORT=3000
ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1

# Health check
HEALTHCHECK --interval=30s --timeout=3s --start-period=10s --retries=3 \
  CMD node -e "require('http').get('http://localhost:3000/api/health', (r) => {process.exit(r.statusCode === 200 ? 0 : 1)})"

# Start the application
CMD ["node", "server.js"]
