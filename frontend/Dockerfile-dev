# Dockerfile-frontend
FROM node:18-alpine

WORKDIR /frontend-app

COPY . /frontend-app

RUN npm install
RUN npm run build

EXPOSE 3000