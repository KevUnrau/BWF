# Stage 1: Build the React frontend
FROM node:24-alpine AS frontend-build

WORKDIR /app

COPY package*.json .
RUN npm ci

COPY . .
RUN npm run build

# Stage 2: Serve the frontend with Caddy 
FROM caddy:2-alpine

COPY --from=frontend-build /app/dist /srv