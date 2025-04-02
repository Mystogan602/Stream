# Stage 1: Base
FROM node:20.17.0-alpine AS base
RUN apk add --no-cache libc6-compat
WORKDIR /app
COPY package.json yarn.lock ./
RUN yarn install --frozen-lockfile

# Stage 2: Build
FROM base AS build
COPY . .
RUN yarn prisma generate
RUN yarn build

# Stage 3: Production
FROM base AS production
WORKDIR /app
COPY --from=build /app/package.json /app/yarn.lock ./
RUN yarn install --production --frozen-lockfile
COPY --from=build /app/dist ./dist
COPY --from=build /app/prisma/generated ./prisma/generated
CMD ["node", "dist/main"]