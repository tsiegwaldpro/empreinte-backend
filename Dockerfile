# Étape 1 : Image Node légère avec Debian
FROM node:18-slim

# Étape 2 : Installer les dépendances système nécessaires à Chromium
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
  --no-install-recommends && \
  apt-get clean && rm -rf /var/lib/apt/lists/*

# Étape 3 : Créer le répertoire de travail
WORKDIR /app

# Étape 4 : Copier les fichiers package.json + lockfile
COPY package*.json ./

# Étape 5 : Installer les dépendances Node
RUN npm install

# Étape 6 : Copier tout le reste du projet
COPY . .

# Étape 7 : Démarrer le serveur (modifie si ton point d’entrée n’est pas index.js)
CMD ["node", "index.js"]
