FROM node:12 AS builder

WORKDIR /app
COPY ./package.json ./yarn.lock /app/
RUN yarn install
COPY . /app
RUN yarn clean:build
CMD ["node", "/app/dist/main.js"]
EXPOSE 5000
