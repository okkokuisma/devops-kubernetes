FROM node:16.15.0-alpine

WORKDIR /usr/src/app

COPY . .

EXPOSE ${PORT}

RUN npm install

CMD [ "npm", "start" ]