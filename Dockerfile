FROM node:lts-alpine

RUN mkdir -p /home/node/api/node_modules && chown -R node:node /home/node/api

WORKDIR /home/node/api

COPY --chown=node:node . .

USER node

RUN yarn build

EXPOSE 3333

CMD ["yarn", "start"]
