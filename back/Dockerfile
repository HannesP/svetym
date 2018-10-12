FROM node:8-alpine

EXPOSE 8989
WORKDIR /svetym-back

COPY package.json package-lock.json ./
RUN npm install

COPY index.js svetym.json ./
CMD ["node", "."]
