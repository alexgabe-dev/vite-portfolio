# Vizitor CMS (Payload + Next.js standalone). Built and run on the VPS via docker compose.
FROM node:22.23.5-alpine AS deps
WORKDIR /app
COPY package.json package-lock.json .npmrc ./
# Optional build secret "extra_ca" for builds behind a TLS-intercepting proxy; absent on a normal server.
RUN --mount=type=secret,id=extra_ca,required=false \
    if [ -f /run/secrets/extra_ca ]; then export NODE_EXTRA_CA_CERTS=/run/secrets/extra_ca; fi; \
    npm ci --no-audit --no-fund

FROM node:22.23.5-alpine AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .
# Build-time placeholders only; real values come from the runtime environment (.env on the server).
ENV NEXT_TELEMETRY_DISABLED=1 NODE_ENV=production DEPLOY_WORKER=off \
    DATABASE_URL=postgres://build:build@127.0.0.1:5432/build PAYLOAD_SECRET=build-time-placeholder
RUN npm run build

FROM node:22.23.5-alpine AS runner
WORKDIR /app
ENV NODE_ENV=production NEXT_TELEMETRY_DISABLED=1 PORT=3000 HOSTNAME=0.0.0.0 MEDIA_DIR=/data/media
RUN addgroup -S -g 1001 nodejs && adduser -S -u 1001 -G nodejs cms && mkdir -p /data/media && chown -R cms:nodejs /data
COPY --from=builder --chown=cms:nodejs /app/.next/standalone ./
COPY --from=builder --chown=cms:nodejs /app/.next/static ./.next/static
USER cms
EXPOSE 3000
HEALTHCHECK --interval=30s --timeout=5s --start-period=60s --retries=3 CMD wget -qO- http://127.0.0.1:3000/api/health || exit 1
# Pending migrations (src/migrations) run automatically on start via `prodMigrations`.
CMD ["node", "server.js"]
