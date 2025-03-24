FROM node:18-alpine

WORKDIR /app

# Instalar dependencias
COPY package*.json ./
RUN npm install

# Copiar el código fuente
COPY . .

# Compilar TypeScript
RUN npm run build

EXPOSE 3000

# Usar ts-node-dev para desarrollo
CMD ["npm", "run", "dev"] 