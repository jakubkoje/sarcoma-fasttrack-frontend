FROM node:24-slim AS build

WORKDIR /app

COPY package.json package-lock.json ./
RUN npm ci

COPY . .
RUN npm run test
RUN npm run build:wc
RUN npm run test:smoke

FROM ghcr.io/polyfea/spa-base

LABEL org.opencontainers.image.title="Sarcom FastTrack Web Component"
LABEL org.opencontainers.image.description="Nuxt/Vue custom-element bundle for Sarcom FastTrack"

COPY --from=build /app/dist /spa/public

ENV OTEL_SERVICE_NAME=sarcoma-fasttrack-wc
ENV SPA_BASE_PORT=8080
EXPOSE 8080
