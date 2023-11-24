FROM node:lts-slim as builder

WORKDIR /app

COPY package.json package.json
COPY package-lock.json package-lock.json

RUN npm ci

COPY public/ public
COPY src/ src
COPY . .

RUN npm run build

FROM node:alpine as server
WORKDIR /build
COPY --from=builder /app/dist .
RUN npm i -g serve
CMD ["serve", "-s"]