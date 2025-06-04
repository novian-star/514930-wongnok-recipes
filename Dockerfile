# Note: This Dockerfile work better with docker-compose
# as this runs migrations on every deploy

# Build stage
FROM oven/bun:1.2.12-alpine AS builder

WORKDIR /app

RUN apk update && apk add --no-cache openssl git

COPY package.json bun.lock ./

RUN bun install --frozen-lockfile

COPY .prisma ./.prisma

RUN bun prisma generate

COPY . .

RUN bun run build


# Deploy stage
FROM oven/bun:1.2.12-alpine

ARG PORT=3000
ARG DATABASE_URL

WORKDIR /app

COPY --from=builder /app ./

EXPOSE ${PORT}

# Start the server
CMD ["sh", "-c", "bun prisma migrate deploy && bun run ./.output/server/index.mjs"]