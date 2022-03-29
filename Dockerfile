# syntax=docker/dockerfile:1

FROM node:14 as node
#FROM node:14 as build-step
WORKDIR /apoloniaweb
COPY . .
#RUN npm i
#RUN npm run build --prod
RUN npm install yarn
RUN yarn install
RUN yarn --version
CMD [ "yarn", "start" ]
EXPOSE 4200
#CMD ["node", "src/index.js"]

#Primera Etapa
#RUN npm run build --prod
#Segunda Etapa
#FROM nginx:alpine
#COPY --from=node /app/dist /usr/share/nginx/html
#Si estas utilizando otra aplicacion cambia PokeApp por el nombre de tu app
