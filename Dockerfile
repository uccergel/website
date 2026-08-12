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

# ---------- Çalıştırma aşaması ----------
FROM node:22-alpine AS runner
WORKDIR /app

ENV NODE_ENV=production
ENV PORT=3000
ENV HOST=0.0.0.0

# TanStack Start (Nitro) tüm bağımlılıkları .output içine bundle eder,
# bu yüzden runner katmanında node_modules'a gerek yok.
COPY --from=builder /app/.output ./.output

# root olmayan kullanıcı ile çalıştır
USER node

EXPOSE 3000

CMD ["node", ".output/server/index.mjs"]
