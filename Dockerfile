FROM node:18.3

WORKDIR /usr/src/app

COPY package*.json ./
COPY pnpm-lock.yaml ./

RUN pnpm i

COPY . ./

ENV NEXT_TELEMETRY_DISABLED 1

RUN pnpm build:client

EXPOSE 3000

CMD ["pnpm", "start:client"]