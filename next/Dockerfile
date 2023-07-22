FROM node:18-alpine

WORKDIR /web

COPY package.json yarn.lock ./
RUN yarn install

COPY next.config.js ./next.config.js

COPY app ./app
COPY components ./components
COPY public ./public

CMD ["npm", "run", "dev"]