# Build stage
FROM oven/bun:1.2.12-alpine AS builder

WORKDIR /app

RUN apk update && apk add --no-cache openssl git

COPY package.json bun.lock ./

RUN bun install --frozen-lockfile

COPY . .

RUN bun prisma generate

RUN bun run build


# Deploy stage
FROM oven/bun:1.2.12-alpine

ARG PORT=3000
ARG DATABASE_URL

WORKDIR /app

COPY --from=builder /app ./

EXPOSE ${PORT}

CMD ["bun", "run", "./.output/server/index.mjs"]