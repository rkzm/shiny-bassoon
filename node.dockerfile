FROM node

MAINTAINER reptileinx

RUN mkdir -p /usr/src/app

COPY . /usr/src/app/

RUN npm install

CMD [ "node", "server.js" ]
