FROM node:alpine

WORKDIR /mailServer

COPY package*.json /mailServer/

RUN npm install

COPY . .

CMD [ "npm", "run", "server" ]