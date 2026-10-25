FROM node:24-alpine

WORKDIR /app

COPY package*.json .

COPY prisma.config.js .
COPY prisma ./prisma

RUN npm ci

RUN DATABASE_URL="postgresql://placeholder@localhost:5432/placeholder" npx prisma generate

COPY src ./src

ENV NODE_ENV=production

EXPOSE 3000

CMD ["npm", "start"]