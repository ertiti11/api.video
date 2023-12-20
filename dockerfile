# Utilizar la imagen base de Node.js
FROM node:latest

# Instalar ffmpeg sobre la imagen base
RUN apt-get update \
    && apt-get install -y ffmpeg \
    && rm -rf /var/lib/apt/lists/*

# Definir el directorio de trabajo en la imagen
WORKDIR /usr/src/app

# Copiar los archivos del proyecto
COPY package*.json ./
RUN npm install
COPY . .

# Exponer el puerto 3000 (si tu aplicación lo usa)
EXPOSE 3000
RUN ffmpeg -version
# Comando por defecto para ejecutar tu aplicación
CMD ["npm", "run", "dev"]
