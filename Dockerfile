# syntax=docker/dockerfile:1
FROM node:14
WORKDIR /apoloniaweb
COPY . .
RUN npm install yarn
RUN yarn install
RUN yarn --version
CMD [ "yarn", "start" ]
EXPOSE 4200
#CMD ["node", "src/index.js"]