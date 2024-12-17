FROM node:18-alpine as build-stage
WORKDIR /frontend-app
COPY frontend/package*.json /frontend-app/
RUN npm install
COPY frontend/ /frontend-app/
RUN npm run build

FROM nginx:1.19-alpine
COPY nginx/nginx.conf /etc/nginx/templates/nginx.conf.template
COPY --from=build-stage /frontend-app/build /usr/share/nginx/html
