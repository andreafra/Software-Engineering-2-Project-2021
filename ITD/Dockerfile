FROM node:12-alpine

WORKDIR /usr/src/app

COPY . .

RUN yarn install

EXPOSE 3000

ENTRYPOINT ["yarn"]
