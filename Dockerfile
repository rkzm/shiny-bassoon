FROM node:argon

MAINTAINER reptileinx

ENV NODE_ENV=production 
ENV PORT=3000

COPY      . /var/www
WORKDIR   /var/www

COPY . /usr/src/app/
RUN npm install

EXPOSE $PORT

CMD [ "npm", "start" ]
