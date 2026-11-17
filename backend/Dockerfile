# backend/Dockerfile
FROM node:22-alpine
WORKDIR /app

# Copiar manifiestos e instalar dependencias
COPY package*.json ./
RUN npm install

# Copiar el resto del código
COPY . .

# Exponer el puerto por defecto de NestJS
EXPOSE 3000

# Arrancar en modo desarrollo con hot-reload
CMD ["npm", "run", "start:dev"]