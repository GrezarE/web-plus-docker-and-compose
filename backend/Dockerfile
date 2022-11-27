FROM node:16-alpine AS build
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build

FROM node:16-alpine AS production
ENV NODE_ENV=production
WORKDIR /app
RUN npm i -g pm2
COPY package*.json ./
RUN npm ci --omit=dev
COPY . .
COPY --from=build /app/dist ./dist
EXPOSE 3000
CMD ["pm2-runtime", "ecosystem.config.js"]



