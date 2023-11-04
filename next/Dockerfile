FROM node:20.8-alpine3.18

ENV LANG=C.UTF-8

WORKDIR /web

COPY package.json yarn.lock ./
RUN yarn install
COPY next.config.js ./next.config.js
COPY app ./app
COPY components ./components
COPY public ./public
CMD ["npm", "run", "dev"]
