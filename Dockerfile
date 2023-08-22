# Utilisez une image de base Node.js
FROM node:14

# Définissez le répertoire de travail dans le conteneur
WORKDIR /app

# Copiez le fichier package.json du client dans le conteneur client/
COPY client/package*.json client/

# Copiez le fichier package.json du serveur dans le conteneur server/
COPY server/package*.json server/

# Installez les dépendances du client
RUN cd client && npm install

# Installez les dépendances du serveur
RUN cd server && npm install

# On se retrouve ici avec app/client/node_modules et app/server/node_modules

# build client
RUN cd client && npm run build

# build server
RUN cd server && npm run build

CMD ["node", "server/dist/index.js"]
```
