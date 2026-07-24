# ─────────────────────────────────────────────
# Stage 1: Build del frontend con Node.js
# ─────────────────────────────────────────────
FROM node:20-alpine AS builder

WORKDIR /app

COPY package*.json ./
RUN npm ci

COPY . .
RUN npm run build

# ─────────────────────────────────────────────
# Stage 2: Nginx + API Node.js + SQLite
# ─────────────────────────────────────────────
FROM node:20-alpine

RUN apk add --no-cache nginx

WORKDIR /app

COPY server/package*.json ./server/
RUN cd server && npm ci --omit=dev

COPY server ./server
COPY database ./database
COPY --from=builder /app/dist /usr/share/nginx/html
COPY nginx.conf /etc/nginx/http.d/default.conf
COPY start.sh /start.sh

RUN chmod +x /start.sh && mkdir -p /data

ENV DATABASE_PATH=/data/leads.db


EXPOSE 80

CMD ["/start.sh"]
