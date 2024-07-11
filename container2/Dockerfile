FROM node:latest

WORKDIR /app

COPY package.json /app

RUN npm install

COPY . .

EXPOSE 8081

CMD [ "node", "index.js" ]