FROM node:latest

RUN mkdir -p /usr/src/bot/
WORKDIR /usr/src/bot/

COPY package*.json /usr/src/bot/

RUN npm install

COPY . /usr/src/bot/

RUN cp CommandHandler.js ./node_modules/wokcommands/dist/CommandHandler.js

CMD ["node", "bot.js"]
