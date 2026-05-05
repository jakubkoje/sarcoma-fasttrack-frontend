FROM node:24-alpine AS verify

WORKDIR /app
COPY package.json ./
COPY src/ src/
COPY public/ public/
COPY scripts/ scripts/
COPY test/ test/
RUN npm test
RUN npm run build

FROM ghcr.io/polyfea/spa-base

COPY --from=verify /app/dist /spa/public

ENV SPA_BASE_PORT=8080
EXPOSE 8080
