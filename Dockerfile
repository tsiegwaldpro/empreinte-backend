# Utilise une image Node.js légère
FROM node:18-slim

# Dépendances requises pour Puppeteer/Chromium
RUN apt-get update && apt-get install -y \
    wget \
    ca-certificates \
    fonts-liberation \
    libappindicator3-1 \
    libasound2 \
    libatk-bridge2.0-0 \
    libatk1.0-0 \
    libcups2 \
    libdbus-1-3 \
    libgdk-pixbuf2.0-0 \
    libnspr4 \
    libnss3 \
    libx11-xcb1 \
    libxcomposite1 \
    libxdamage1 \
    libxrandr2 \
    xdg-utils \
    libgbm1 \
    --no-install-recommends && \
    apt-get clean && rm -rf /var/lib/apt/lists/*

# Répertoire de travail
WORKDIR /app

# Copie des fichiers
COPY package*.json ./
RUN npm install
COPY . .

# Démarrage de l'application
CMD ["node", "index.js"]
