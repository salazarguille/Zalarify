FROM node:10-alpine

# File Author / Maintainer
LABEL authors="Guillermo Salazar"

# Update & install required packages
RUN apk update && apk add --no-cache make gcc g++ python git
RUN npm install -g node-gyp


# Install app dependencies
RUN mkdir -p /usr/src/app
# Set work directory to /usr/src/app
WORKDIR /usr/src/app
# RUN cd /usr/src/app
COPY package.json /usr/src/app/
COPY package-lock.json /usr/src/app/

RUN npm install

# Copy app source
# COPY . /usr/src/app
COPY . /usr/src/app

# set your port
ENV PORT 8080

# Entrypoint script
# RUN cp docker-entrypoint.sh /usr/local/bin/ && \
#     chmod +x /usr/local/bin/docker-entrypoint.sh

# start command as per package.json
CMD ["npm", "run", "start"]

# expose the port to outside world
EXPOSE  8080

# ENTRYPOINT ["/usr/local/bin/docker-entrypoint.sh"]
