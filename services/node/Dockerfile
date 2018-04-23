FROM node:8.10.0-alpine

ENV PATH_APP=/app/

COPY package*.json $PATH_APP
WORKDIR $PATH_APP
RUN npm install && npm install --only=dev

COPY . $PATH_APP/

ENTRYPOINT ["npm", "run"]
CMD ["start"]