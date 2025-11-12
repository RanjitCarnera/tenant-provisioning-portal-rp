FROM node:22.12-alpine

RUN npm i -g pnpm@10.18.0

WORKDIR /app

EXPOSE 3000
