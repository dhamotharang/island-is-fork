FROM node:12-alpine3.12 as runner

RUN apk add postgresql-client bash

FROM node:12-alpine3.12 as build

ADD infra/package.json infra/yarn.lock /app/infra/
WORKDIR /app/infra
RUN yarn install --frozen-lockfile

ADD infra/ /app/infra/
ADD apps /app/apps/
ADD libs /app/libs/

RUN ./node_modules/.bin/ncc build src/feature-env.ts -o /app/dist/feature-env
RUN ./node_modules/.bin/ncc build src/secrets.ts -o /app/dist/secrets

FROM runner

COPY --from=build /app/dist/ /app
COPY infra/scripts/container-scripts/* ./app/
WORKDIR /app

ENTRYPOINT [ "node", "feature-env" ]