
# https://chinwendu.medium.com/how-to-dockerize-your-typescript-application-with-multi-stage-build-a-step-by-step-guide-56e7c4274088

#Build stage
FROM node:18-alpine AS build

WORKDIR /usr/src/app

COPY package*.json .

RUN npm install

COPY . .

RUN npm run build

#Production stage
FROM node:18-alpine AS production

WORKDIR /app

COPY package*.json .

RUN npm ci --only=production

COPY --from=build /usr/src/app/dist ./dist

CMD ["node", "dist/index.js"]
