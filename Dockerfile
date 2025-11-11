# Stage 1: Build de Vite
FROM node:18-alpine as build

WORKDIR /app

# Copiar archivos de dependencias
COPY package*.json ./
RUN npm ci

# Copiar código fuente
COPY . .

# Build de la aplicación con Vite
RUN npm run build

# Stage 2: Servir con Nginx
FROM nginx:alpine

# Vite crea la carpeta 'dist', no 'build'
COPY --from=build /app/dist /usr/share/nginx/html

# Copiar configuración de Nginx
COPY nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]