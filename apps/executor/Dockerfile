FROM node:latest
#RUN npm install express
#RUN apt-get update && apt-get install vim -y
#RUN npm install request
#FROM node:10.15.3-alpine
WORKDIR /usr/src/app
COPY package*.json ./
RUN npm install
COPY . .
EXPOSE 80
CMD [ "npm", "run", "dev" ]
