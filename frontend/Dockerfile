# frontend/Dockerfile
FROM node:20-alpine
WORKDIR /app

# Instalar dependencias
COPY package*.json ./
RUN npm install

# Copiar código fuente
COPY . .

# Exponer el puerto de Vite
EXPOSE 5173

# Arrancar Vite exponiéndolo a la red de Docker (0.0.0.0)
CMD ["npm", "run", "dev", "--", "--host", "0.0.0.0"]