# Utilisez une image de base Node.js
FROM node:14

# Définissez le répertoire de travail dans le conteneur
WORKDIR /app

# Copiez le fichier package.json du client dans le conteneur
COPY ./client/package.json ./client/package-lock.json ./client/

# Installez les dépendances du client
RUN cd ./client && npm install

# Copiez le fichier package.json du serveur dans le conteneur
COPY ./server/package.json ./server/package-lock.json ./server/

# Installez les dépendances du serveur
RUN cd ./server && npm install

# Copiez le contenu du répertoire client/build dans le répertoire client/build du conteneur
COPY ./client/build ./client/build

# Copiez le contenu du répertoire server/dist dans le répertoire client/dist du conteneur
COPY ./server/dist ./client/dist

# Exécutez npm run build dans le répertoire client
RUN cd ./client && npm run build

# Exécutez npm run build dans le répertoire serveur
RUN cd ./server && npm run build

# Commande par défaut à exécuter lorsque le conteneur démarre
CMD ["npm", "start"]
