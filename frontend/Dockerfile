FROM mhart/alpine-node:16 as build
WORKDIR /app
COPY package*.json ./
RUN npm ci 
COPY . /app
RUN npm run build
FROM nginx:1.23.1-alpine
COPY --from=build /app/build /usr/share/nginx/html
EXPOSE 81
CMD ["nginx", "-g", "daemon off;"]