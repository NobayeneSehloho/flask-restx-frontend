
# Multi-stage build for production

# Stage 1: Build
FROM node:20-alpine AS builder

WORKDIR /app

COPY package*.json ./
RUN npm ci

COPY . .
RUN npm run build

# Stage 2: Production
# FROM nginx:alpine
# RUN apk update && apk upgrade --no-cache
# Note: nginx:alpine carries 11 CVEs (2H, 9M) due to curl, freetype, libxml2, busybox

# Slim variant: removes 10 CVEs, only 1M remains (busybox - no fix available upstream)
FROM nginx:1-alpine-slim

# Copy built files
COPY --from=builder /app/dist /usr/share/nginx/html

# Copy nginx config
COPY nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80

HEALTHCHECK --interval=30s --timeout=3s --start-period=10s --retries=3 \
  CMD wget --no-verbose --tries=1 --spider http://localhost/ || exit 1

CMD ["nginx", "-g", "daemon off;"]