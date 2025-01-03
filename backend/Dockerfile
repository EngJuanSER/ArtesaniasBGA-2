FROM node:18-alpine

RUN npm install -g pnpm

WORKDIR /app

COPY package*.json ./

RUN pnpm install

COPY . .

RUN pnpm build

RUN pnpm run develop

EXPOSE 1337

CMD ["pnpm", "start"]