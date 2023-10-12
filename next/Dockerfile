FROM node:20.8-alpine3.18 AS base

ENV LANG=C.UTF-8

USER 0

WORKDIR /web

COPY --link package.json package-lock.json ./

RUN : \
&& npm install \
&& chown -R 0 /web \
&& apk add curl \
&& :

COPY --link next.config.js ./next.config.js

COPY --link app ./app

COPY --link components ./components

COPY --link public ./public

EXPOSE 3000

CMD ["npm", "run", "dev"]
