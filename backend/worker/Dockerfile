FROM node:16-alpine

# Install git
RUN apk update
RUN apk add git
RUN apk add vim

# Create app directory
WORKDIR /usr/src/app

COPY package*.json ./
RUN apk add --update python3 make g++ && rm -rf /var/cache/apk/*
RUN npm install

COPY . .

EXPOSE 8999
RUN chmod +x startup.sh
CMD ["./startup.sh"]