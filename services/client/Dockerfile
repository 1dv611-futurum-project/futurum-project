FROM node:8.10.0-alpine

# Set up chromium browser for testing
RUN echo @edge http://nl.alpinelinux.org/alpine/edge/community >> /etc/apk/repositories \
    && apk add --no-cache \
    python \
    build-base \
    git \
    bash \
    openjdk8-jre-base \
    # chromium dependencies
    nss@edge \
    chromium-chromedriver@edge \
    chromium@edge

ENV CHROME_BIN /usr/bin/chromium-browser
ENV PATH_APP=/app/

COPY package*.json $PATH_APP
WORKDIR $PATH_APP
RUN npm install

COPY . $PATH_APP/

RUN npm build

ENTRYPOINT ["npm", "run"]
CMD ["start"]
