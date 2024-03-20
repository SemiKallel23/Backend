# Utiliser l'image officielle Node.js 16
FROM node:20

# Créer le répertoire de travail
WORKDIR /app

# Copier les fichiers package.json et package-lock.json pour installer les dépendances
COPY package*.json ./

RUN npm install -g npm@latest

# Installer les dépendances

RUN npm install --legacy-peer-deps


# Copier le reste des fichiers de l'application
COPY . .

# Exposer le port sur lequel l'application écoute
EXPOSE 4000

# Commande pour démarrer l'application
CMD ["npm", "start"]
