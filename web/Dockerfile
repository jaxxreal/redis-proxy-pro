FROM mhart/alpine-node:10

COPY ./package*.json ./
COPY ./tsconfig.json .
RUN npm install
RUN npm i -g pm2

COPY ./web/. ./web/
COPY ./config/. ./config/

RUN npm run build

EXPOSE 8081

CMD [ "pm2-runtime", "start", "./web/ecosystem.config.js", "--only=app" ]
