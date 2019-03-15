FROM node:8

WORKDIR /usr/scr/app

COPY . .
RUN yarn cache clean
RUN yarn install

EXPOSE 3060
CMD ["npm", "run", "ticket-start"]
