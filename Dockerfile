FROM node:alpine

# common
WORKDIR /usr/hoarder/common
COPY common/package*.json ./
RUN npm ci
COPY common/src/ ./src/
COPY common/tsconfig.json .
RUN npm run build

# client
WORKDIR /usr/hoarder/client
COPY client/package*.json ./
RUN npm ci
COPY client/src/ ./src/
COPY client/public/ ./public/
COPY client/tsconfig.json .
RUN npm run build

# server
WORKDIR /usr/hoarder/server
COPY server/package*.json ./
RUN npm ci
COPY server/src/ ./src/
COPY server/tsconfig.json .
COPY server/.env .
RUN npm run build

# final configs
EXPOSE 8080
CMD [ "npm", "run", "start" ]
