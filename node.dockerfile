FROM node

MAINTAINER reptileinx

WORKDIR /app

COPY package.json package.json

RUN npm install && npm audit fix --force

COPY . .

CMD [ "node", "server.js" ]
