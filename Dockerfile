FROM node:lts-alpine

RUN mkdir -p /home/node/api/node_modules && chown -R node:node /home/node/api
WORKDIR /home/node/api

USER node

# Install dependencies
COPY package.json yarn.* ./
RUN yarn

# Copy app source
COPY --chown=node:node . .

# Transpile code
RUN yarn build


CMD ["yarn", "start"]
EXPOSE 3333
