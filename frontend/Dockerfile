FROM node:alpine

RUN npm install -g pnpm

WORKDIR /app

ENV NODE_PATH=/app/node_modules

COPY package.json ./
COPY pnpm-lock.yaml ./

RUN pnpm install

COPY . .

EXPOSE 3000

CMD ["pnpm", "run", "dev"]