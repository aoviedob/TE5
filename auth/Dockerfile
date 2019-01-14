FROM node:8

WORKDIR /usr/scr/app

COPY . .

RUN yarn install

EXPOSE 3000
CMD ["npm", "run", "auth-start"]
