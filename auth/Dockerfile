FROM node:16

WORKDIR /usr/app

COPY package.json ./

RUN npm install --legacy-peer-deps --omit=dev
COPY ./ ./

CMD ["npm", "start"]