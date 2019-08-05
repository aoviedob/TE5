FROM node:8

WORKDIR /usr/scr/app
RUN rm -R ./
COPY . .
RUN yarn cache clean
RUN yarn install

EXPOSE 3065
CMD ["npm", "run", "comm-start"]
