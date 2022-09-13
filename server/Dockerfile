FROM node:lts
WORKDIR /usr/src/app
COPY package*.json ./
ENV NODE_ENV=production

# RUN npm config rm proxy
# RUN npm config rm https-proxy

# RUN npm config set proxy false
# RUN npm cache clean --force

RUN npm config set fetch-retry-mintimeout 20000
RUN npm config set fetch-retry-maxtimeout 1200000


RUN npm ci
COPY . .
EXPOSE 5000
CMD [ "npm", "start" ]