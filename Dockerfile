# Next.js production image (used by the preview app — see fly.preview.toml).
FROM node:22-slim AS base
WORKDIR /app
ENV NEXT_TELEMETRY_DISABLED=1

FROM base AS deps
COPY package.json package-lock.json ./
RUN npm ci

FROM base AS build
COPY --from=deps /app/node_modules ./node_modules
COPY . .
# Baked in at build time: the site's own URL (metadata, sitemap) and the no-index switch.
ARG NEXT_PUBLIC_SITE_URL
ARG NOINDEX
ENV NEXT_PUBLIC_SITE_URL=$NEXT_PUBLIC_SITE_URL NOINDEX=$NOINDEX
RUN npm run build && npm prune --omit=dev

FROM base AS run
ENV NODE_ENV=production PORT=3000
COPY --from=build /app ./
EXPOSE 3000
CMD ["npm", "start"]
