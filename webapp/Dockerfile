# Build Stage
FROM oven/bun:1 AS builder

WORKDIR /app
COPY package.json bun.lock ./

RUN bun install

COPY . .
RUN bun run build

# Run Stage
FROM oven/bun:1-alpine
WORKDIR /app

# Install dependencies for building native modules (better-sqlite3)
RUN apk add --no-cache python3 make g++

COPY --from=builder /app/build ./build
COPY --from=builder /app/package.json ./package.json

COPY --from=builder /app/bun.lock ./
RUN bun install --production

# Expose port
EXPOSE 3000

# Set Env variables
ENV PORT=3000
ENV NODE_ENV=production

ENV ORIGIN=http://localhost:3000 

COPY --from=builder /app/src/lib/utils/auth.ts ./src/lib/utils/auth.ts

# Ensure the database file exists or is writable if mounted
CMD ["sh", "-c", "bun run db:migrate && bun run build/index.js"]
