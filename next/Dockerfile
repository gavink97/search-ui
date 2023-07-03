FROM node:latest
WORKDIR /web
COPY package.json .
RUN npm install

ARG NODE_ENV
RUN if [ "$NODE_ENV" = "development" ]; \
        then npm install; \
        else npm install --only=production; \
        fi

COPY . ./
ENV PORT 8800
EXPOSE $PORT
CMD ["npm", "run", "dev"]