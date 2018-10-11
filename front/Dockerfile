FROM node:9.11.2-alpine AS build

EXPOSE 80
WORKDIR /svetym-build

COPY package.json package-lock.json ./
RUN npm install

COPY . .
RUN npm run build

FROM nginx:1.15-alpine

COPY --from=build /svetym-build/build /usr/share/nginx/html
COPY default.conf /etc/nginx/conf.d/
