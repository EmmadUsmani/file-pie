FROM node:14.21.1-bullseye-slim

WORKDIR /app

COPY . .

ENV NODE_ENV=production
ENV PORT=3000

EXPOSE 3000

RUN npm install pm2 -g
RUN yarn
RUN yarn build

CMD ["pm2-runtime", "./server/build/index.js"]