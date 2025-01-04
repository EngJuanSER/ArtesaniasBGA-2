FROM node:18-alpine

RUN npm install -g pnpm

WORKDIR /app

ENV NODE_PATH=/app/node_modules

COPY package.json ./
COPY pnpm-lock.yaml ./

ENV NODE_ENV=development
RUN pnpm install

COPY . .

# Importar configuración de Strapi
RUN pnpm run strapi import --file /app/strappi-export.tar.gz

ENV NODE_ENV=production
# Server
ENV HOST=0.0.0.0
ENV PORT=1337

# Secrets
ENV APP_KEYS=qTo3mjncauIzaF5dpeIynQ==,VrXE0prEk2nyAGNoj2neEA==,JeUxmGZzKQanfSpt+LycHA==,UiLk5atr8YUFM2veq7tjxw==
ENV API_TOKEN_SALT=uVD09MPnAVmOkYefKCoD9g==
ENV ADMIN_JWT_SECRET=fCVHsDK4SZ4vQ4EDw2Q/Rg==
ENV TRANSFER_TOKEN_SALT=x0pV4ktdFbygNwKMVAACSg==
ENV JWT_SECRET=G58zMBt9C7uPJuzyswzBzg==

# Database
ENV DATABASE_CLIENT=postgres
ENV DATABASE_HOST=postgres
ENV DATABASE_PORT=5432
ENV DATABASE_NAME=artesanias
ENV DATABASE_USERNAME=postgres
ENV DATABASE_PASSWORD=123456
ENV DATABASE_SSL=false
ENV DATABASE_FILENAME=

RUN pnpm run build

ENV NODE_ENV=development

EXPOSE 1337

CMD ["pnpm", "run", "develop"]