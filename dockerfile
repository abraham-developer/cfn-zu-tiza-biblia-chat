FROM node:18-alpine@sha256:7e2e2e7c2e2f3e2e2e2e2e2e2e2e2e2e2e2e2e2e2e2e2e2e2e2e2e2e2e2e2e2e2e2e2e2e2e2e2e2e2 AS builder
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build

FROM nginx:alpine

# BORRAR configuración default
RUN rm -f /etc/nginx/conf.d/default.conf

# CONFIGURACIÓN SPA CORRECTA
RUN echo 'server { \
    listen 80; \
    server_name localhost; \
    root /usr/share/nginx/html; \
    index index.html; \
    \
    # ESTA ES LA LÍNEA CLAVE PARA SPAs \
    location / { \
        try_files $uri $uri/ /index.html; \
    } \
    \
    # Cache para assets \
    location ~* \.(js|css|png|jpg|jpeg|gif|ico|svg)$ { \
        expires 1y; \
        add_header Cache-Control "public, immutable"; \
    } \
}' > /etc/nginx/conf.d/default.conf

COPY --from=builder /app/dist /usr/share/nginx/html

EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]