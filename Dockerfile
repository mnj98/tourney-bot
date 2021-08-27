FROM node:16.8.0

RUN mkdir -p /usr/src/bot/
WORKDIR /usr/src/bot/

COPY package*.json /usr/src/bot/

RUN npm install

COPY . /usr/src/bot/

CMD ["node", "."]
