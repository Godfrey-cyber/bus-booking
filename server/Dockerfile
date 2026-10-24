# ── Stage 1: Install dependencies ──────
FROM node:20-alpine AS deps

WORKDIR /app

COPY package*.json ./

RUN npm ci --omit=dev


# ── Stage 2: Production image ────────────
FROM node:20-alpine AS runner

WORKDIR /app

# ARG UID=1000
# ARG GID=1000

# RUN addgroup -g ${GID} appgroup \
    # && adduser -D -u ${UID} -G appgroup appuser


COPY --from=deps /app/node_modules ./node_modules
COPY . .

# RUN chown -R appuser:appgroup /app

# USER appuser

EXPOSE 8000

CMD ["npm", "run", "dev"]