FROM node:8

WORKDIR /usr/scr/app

COPY . .
RUN yarn cache clean
RUN yarn install

EXPOSE 4550
CMD ["npm", "run", "payment-start"]