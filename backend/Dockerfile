FROM node:20
RUN mkdir -p /app/backend/node_modules && chown -R node:node /app/backend
WORKDIR /app/backend
COPY package*.json ./
USER node
RUN npm install
COPY --chown=node:node . .
EXPOSE 5555
CMD [ "npm", "run", "start" ]
