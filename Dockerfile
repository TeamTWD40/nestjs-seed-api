FROM node:carbon-alpine as dist
WORKDIR /tmp/
COPY package.json package-lock.json tsconfig.json ./
COPY src/ src/
RUN npm install
RUN npm run build

FROM node:carbon-alpine as node_modules
WORKDIR /tmp/
COPY package.json package-lock.json ./
RUN npm install --production

FROM node:carbon-alpine
WORKDIR /usr/local/nub-api
COPY --from=node_modules /tmp/node_modules ./node_modules
COPY --from=dist /tmp/dist ./dist
ENV DB_USERNAME='twddemo' \
    DB_PASSWORD='mypassword' \
    DB_URL='mongo.twdaws.net' \
    DB_PORT=27017
EXPOSE 8081
CMD ["node", "dist/main.js"]
