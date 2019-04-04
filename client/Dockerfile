FROM node:8

WORKDIR /usr/scr/app

COPY . .
RUN yarn cache clean
RUN yarn install

EXPOSE 5112
CMD ["npm", "run", "client-start"]