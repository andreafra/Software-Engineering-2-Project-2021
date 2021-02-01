FROM node:12-alpine

WORKDIR /usr/src/app

COPY package.json ./
COPY yarn.lock ./

RUN yarn install

COPY . ./

EXPOSE 3000

ENTRYPOINT ["yarn"]
