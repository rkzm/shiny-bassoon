FROM node:6.1.0

MAINTAINER reptileinx

RUN mkdir -p /usr/src/app

COPY . /usr/src/app/

RUN npm install

CMD [ "node", "server.js" ]
