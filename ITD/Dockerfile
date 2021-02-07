FROM node:12-alpine

WORKDIR /usr/src/app

COPY . .


ENV WAIT_VERSION 2.7.2
ADD https://github.com/ufoscout/docker-compose-wait/releases/download/$WAIT_VERSION/wait /wait
RUN chmod +x /wait


RUN yarn install

EXPOSE 3000