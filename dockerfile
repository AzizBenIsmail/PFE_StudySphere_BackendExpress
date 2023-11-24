# Utiliser une image de Node.js en tant qu'image de base
FROM node:17

# Définir le répertoire de travail dans le conteneur
WORKDIR /usr/src/app

# Copier les fichiers nécessaires (package.json et package-lock.json) dans le conteneur
COPY package*.json ./

# Installer les dépendances
RUN npm install

# Rebuild bcrypt inside the Docker container
RUN npm uninstall bcrypt
RUN npm install bcrypt

# Copier le reste des fichiers de l'application dans le conteneur
COPY . .

# Exposer le port sur lequel ton application Express s'exécute (par défaut, c'est le port 3000)
EXPOSE 5000

# Commande pour démarrer ton serveur Express
CMD ["node", "app.js"]
