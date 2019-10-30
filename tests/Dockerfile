FROM mhart/alpine-node:10

# Install app dependencies
# A wildcard is used to ensure both package.json AND package-lock.json are copied
# where available (npm@5+)

COPY ./package*.json ./
COPY ./tsconfig.json .
RUN npm install

COPY ./tests/. ./tests/
COPY ./config/. ./config/

RUN npm run build

CMD npm test
