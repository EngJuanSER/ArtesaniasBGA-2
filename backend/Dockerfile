FROM node:18-alpine

RUN apk add --no-cache python3 make g++ git

RUN npm install -g pnpm

WORKDIR /app

COPY package.json ./
COPY pnpm-lock.yaml ./

ENV NODE_ENV=development
RUN pnpm install

COPY . .

ENV NODE_ENV=production
ENV DATABASE_CLIENT=postgres
ENV DATABASE_HOST=postgres
ENV DATABASE_PORT=5432
ENV DATABASE_NAME=artesanias
ENV DATABASE_USERNAME=postgres
ENV DATABASE_PASSWORD=123456

RUN pnpm run build

ENV NODE_ENV=development

EXPOSE 1337

CMD ["pnpm", "run", "develop"]