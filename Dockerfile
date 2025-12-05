FROM node:22-alpine AS base

# Установка pnpm
RUN corepack enable && corepack prepare pnpm@9.0.6 --activate

# Установка зависимостей только если нужно
FROM base AS deps
WORKDIR /app

# Увеличиваем лимит памяти для установки зависимостей (уменьшено для сервера с 3.8GB RAM)
ENV NODE_OPTIONS="--max-old-space-size=2048"

# Копируем файлы для установки зависимостей
COPY package.json pnpm-lock.yaml ./
RUN pnpm install --frozen-lockfile --prefer-offline --no-optional

# Сборка приложения
FROM base AS builder
WORKDIR /app

# Увеличиваем лимит памяти для Node.js и оптимизируем сборку (уменьшено для сервера с 3.8GB RAM)
ENV NODE_OPTIONS="--max-old-space-size=2048"
ENV NEXT_TELEMETRY_DISABLED=1
ENV SKIP_ENV_VALIDATION=1

COPY --from=deps /app/node_modules ./node_modules
COPY . .

# Собираем приложение
RUN pnpm build

# Production образ
FROM base AS runner
WORKDIR /app

ENV NODE_ENV=production

# Создаем пользователя без root прав
RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs

# Копируем необходимые файлы из standalone сборки
COPY --from=builder --chown=nextjs:nodejs /app/public ./public
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static

USER nextjs

EXPOSE 3001

ENV PORT=3001
ENV HOSTNAME="0.0.0.0"

CMD ["node", "server.js"]
