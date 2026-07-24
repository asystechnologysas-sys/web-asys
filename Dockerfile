# ─────────────────────────────────────────────
# Stage 1: Build con Node.js
# ─────────────────────────────────────────────
FROM node:20-alpine AS builder

WORKDIR /app

# Copiar archivos de dependencias
COPY package*.json ./

# Instalar dependencias
RUN npm ci

# Copiar el resto del código fuente
COPY . .

# Variables de entorno de Supabase para el build
# (estas se sobreescriben con las variables de EasyPanel)
ARG VITE_SUPABASE_URL
ARG VITE_SUPABASE_ANON_KEY

ENV VITE_SUPABASE_URL=$VITE_SUPABASE_URL
ENV VITE_SUPABASE_ANON_KEY=$VITE_SUPABASE_ANON_KEY

# Construir el proyecto
RUN npm run build

# ─────────────────────────────────────────────
# Stage 2: Servir con Nginx (ultra liviano)
# ─────────────────────────────────────────────
FROM nginx:alpine

# Copiar los archivos estáticos construidos
COPY --from=builder /app/dist /usr/share/nginx/html

# Copiar configuración personalizada de Nginx
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Puerto expuesto
EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
