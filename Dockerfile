FROM node:lts-alpine

EXPOSE ${API_PORT} ${API_PORT}

RUN mkdir -p /home/ultra-api
COPY package.json /home/ultra-api
WORKDIR /home/ultra-api
RUN npm i

COPY . /home/ultra-api

CMD npm run start
