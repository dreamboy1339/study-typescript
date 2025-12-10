# syntax=docker/dockerfile:1

FROM node:20-alpine AS frontend-builder
WORKDIR /app/frontend
RUN corepack enable
COPY frontend/package.json frontend/pnpm-lock.yaml ./
RUN pnpm install --frozen-lockfile
COPY frontend .
RUN pnpm run build

FROM node:20-alpine AS backend-builder
WORKDIR /app/backend
RUN corepack enable
COPY backend/package.json backend/pnpm-lock.yaml ./
RUN pnpm install --frozen-lockfile
COPY backend .
COPY --from=frontend-builder /app/frontend/build /app/frontend/build
RUN pnpm run build && pnpm prune --prod

FROM node:20-alpine AS runner
WORKDIR /app/backend
RUN corepack enable
ENV NODE_ENV=production
ENV PORT=8080
ENV HOST=0.0.0.0
COPY --from=backend-builder /app/backend/node_modules ./node_modules
COPY --from=backend-builder /app/backend/dist ./dist
COPY --from=backend-builder /app/backend/package.json ./package.json
COPY --from=backend-builder /app/frontend /app/frontend
EXPOSE 8080
CMD ["node", "dist/main.js"]
