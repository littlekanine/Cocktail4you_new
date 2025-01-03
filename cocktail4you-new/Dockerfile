FROM node:23-alpine3.20

RUN mkdir -p /home/node/app/node_modules && chown -R node:node /home/node/app
WORKDIR /home/node/app
# Switch to root temporarily for copying files and setting permissions
USER root
COPY . .
RUN chown -R node:node /home/node/app

# Switch back to the node user
USER node

RUN npm install
RUN npm run build

EXPOSE 3000

CMD [ "npm", "run", "dev" ]