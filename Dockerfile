FROM node:12.1.0-alpine
WORKDIR /opt/app
COPY package.json package-lock.json tsconfig.json ./
COPY src/ src/
RUN npm install
RUN npm run build
ENV DB_USERNAME='twddemo' \
    DB_PASSWORD='mypassword' \
    DB_URL='mongo.twdaws.net' \
    DB_PORT=27017
EXPOSE 8081
CMD ["npm", "run", "start:prod"]
