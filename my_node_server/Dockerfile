FROM node:boron

# create app directory
RUN mkdir -p /usr/src/app
WORKDIR /usr/src/app

# install app dependencies
COPY package.json /usr/src/app/
RUN npm install

# bundle app source
COPY . /usr/src/app/

# expose port 80, same port app is listening on
EXPOSE 80

# start app
CMD ["npm", "start"]