FROM node:18-alpine as build-stage

ARG REACT_APP_WMS_BASE_URL
ARG REACT_APP_CATALOGUE_URL

WORKDIR /frontend-app
COPY package*.json /frontend-app/
RUN npm install
COPY . /frontend-app/
RUN npm run build

FROM nginx:1.19-alpine as production-stage
COPY --from=build-stage /frontend-app/build /usr/share/nginx/html

