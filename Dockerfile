FROM node:14.21.1-bullseye-slim

WORKDIR /app

COPY . .

ENV NODE_ENV=production
ENV PORT=3000

RUN yarn

EXPOSE 3000

CMD ["yarn", "start"]
