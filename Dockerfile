# syntax=docker/dockerfile:1

# ---------- Build aşaması ----------
FROM node:22-alpine AS builder
WORKDIR /app

# Bağımlılıkları lockfile ile kur (katman cache dostu)
COPY package.json package-lock.json ./
RUN npm ci

# Kaynak kodu kopyala ve build al
COPY . .
RUN npm run build

# ---------- Bağımlılık aşaması (sadece production) ----------
FROM node:22-alpine AS deps
WORKDIR /app
COPY package.json package-lock.json ./
RUN npm ci --omit=dev

# ---------- Çalıştırma aşaması ----------
FROM node:22-alpine AS runner
WORKDIR /app

ENV NODE_ENV=production
ENV PORT=3000
ENV HOST=0.0.0.0

# Bu TanStack Start sürümü bağımlılıkları bundle etmez; runtime'da
# production node_modules gerekir (React, TanStack, srvx vb.).
COPY --from=deps /app/node_modules ./node_modules
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/server.mjs ./server.mjs
COPY --from=builder /app/package.json ./package.json

# root olmayan kullanıcı ile çalıştır
USER node

EXPOSE 3000

CMD ["node", "server.mjs"]
