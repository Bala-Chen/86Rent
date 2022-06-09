FROM alpine:3.15
ENV NODE_VERSION 16.14.2
COPY package.json app.js package-lock.json swagger.json /app/ 
COPY controllers /app/controllers
COPY public /app/public
COPY models /app/models
COPY views /app/views
COPY config /app/config
COPY . .
WORKDIR /app 
RUN apk add --update npm
EXPOSE 3500
CMD node app.js 