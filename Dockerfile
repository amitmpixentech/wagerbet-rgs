FROM node:16-alpine

RUN apk update

# Create app directory
WORKDIR /app

# Install app dependencies
# A wildcard is used to ensure both package.json AND package-lock.json are copied
# where available (npm@5+)
COPY package*.json ./
COPY tsconfig.json ./
# Bundle app source
COPY src /app/src
COPY scripts /app/scripts
ENV NODE_ENV development

RUN npm install
RUN npm run build

# Installing PM2 and pm2 watchdog
RUN npm i -g pm2

EXPOSE 8080

CMD ["pm2-runtime", "dist/rgs-service.js", "--name", "wagerbet-rgs"]