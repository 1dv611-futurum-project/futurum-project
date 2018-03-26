FROM node:carbon

# Create app directory for the client
WORKDIR /usr/src/app
COPY client/package*.json ./
RUN npm install

# Create app directory for the server
WORKDIR /usr/src/app
COPY server/package*.json ./
RUN npm install

COPY . .

EXPOSE 8080
CMD [ "npm", "start" ]