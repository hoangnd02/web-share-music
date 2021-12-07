# syntax=docker/dockerfile:1.0.0-experimental

FROM node:14.17.4-alpine3.14

WORKDIR /app

COPY package.json ./

RUN yarn install

COPY . .

RUN yarn run build

EXPOSE 3000

CMD yarn run start
