FROM node:22-alpine3.22 AS base
WORKDIR /app
RUN corepack enable pnpm && corepack install -g pnpm@10.15.0


FROM base AS build
COPY pnpm-lock.yaml ./
RUN pnpm fetch --prod

COPY . ./
RUN pnpm install -r --offline --prod
RUN pnpm build


FROM base
EXPOSE 3000

COPY --from=build /app/node_modules /app/node_modules

COPY --from=build /app/package.json /app/package.json
COPY --from=build /app/drizzle.config.ts /app/drizzle.config.ts
COPY --from=build /app/migrations /app/migrations

COPY --from=build /app/dist /app/dist
CMD ["node", "dist/main"]
