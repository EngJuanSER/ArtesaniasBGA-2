FROM node:18-alpine

RUN npm install -g pnpm

WORKDIR /app

ENV NODE_PATH=/app/node_modules

COPY package.json ./
COPY pnpm-lock.yaml ./

RUN pnpm install

COPY . .

# Agregar variables de entorno
ENV NEXT_PUBLIC_BACKEND_URL=http://localhost:1337
ENV NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=
ENV NEXT_PUBLIC_JWT_SECRET=G58zMBt9C7uPJuzyswzBzg

EXPOSE 3000

CMD ["pnpm", "run", "dev"]