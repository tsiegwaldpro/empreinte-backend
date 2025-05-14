# Étape 1 : Image de base légère avec Node.js
FROM node:20-slim

# Étape 2 : Installation des dépendances système nécessaires pour Chromium
RUN apt-get update && apt-get install -y \
    wget \
    ca-certificates \
    fonts-liberation \
    libappindicator3-1 \
    libasound2 \
    libatk-bridge2.0-0 \
    libatk1.0-0 \
    libc6 \
    libcairo2 \
    libcups2 \
    libdbus-1-3 \
    libexpat1 \
    libfontconfig1 \
    libgbm1 \
    libgcc1 \
    libglib2.0-0 \
    libgtk-3-0 \
    libnspr4 \
    libnss3 \
    libpango-1.0-0 \
    libx11-6 \
    libx11-xcb1 \
    libxcb1 \
    libxcomposite1 \
    libxcursor1 \
    libxdamage1 \
    libxext6 \
    libxfixes3 \
    libxi6 \
    libxrandr2 \
    libxrender1 \
    libxss1 \
    libxtst6 \
    xdg-utils \
    --no-install-recommends && \
    apt-get clean && rm -rf /var/lib/apt/lists/*

# Étape 3 : Définir le répertoire de travail
WORKDIR /app

# Étape 4 : Copier les fichiers package.json / package-lock.json d’abord pour le cache Docker
COPY package*.json ./

# Étape 5 : Installer les dépendances du projet (y compris puppeteer)
RUN npm install

# Étape 6 : Copier le reste du code source
COPY . .

# Étape 7 : Exposer le port (si tu as un backend Express qui écoute sur 3000 par ex)
EXPOSE 3000

# Étape 8 : Commande de lancement
CMD ["node", "index.js"]
