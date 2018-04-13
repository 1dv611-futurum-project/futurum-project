FROM node:8.10.0-alpine

ENV PATH_APP=/app/

COPY package*.json $PATH_APP
WORKDIR $PATH_APP
RUN npm install

COPY . $PATH_APP/

RUN npm build

ENTRYPOINT ["npm", "run"]
CMD ["server"]
