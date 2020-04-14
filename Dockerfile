FROM node:12 AS builder
WORKDIR /app
COPY ./package.json ./yarn.lock /app/
RUN yarn install
COPY . /app
CMD ["yarn", "start"]
EXPOSE 5000