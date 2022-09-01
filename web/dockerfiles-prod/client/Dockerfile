# base image
FROM node:16.13.0
ARG PROJECT=frontend
ENV PROJECT_DIR=/var/www/${PROJECT}
RUN mkdir -p ${PROJECT_DIR}
WORKDIR ${PROJECT_DIR}


# replace shell with bash so we can source files
RUN rm /bin/sh && ln -s /bin/bash /bin/sh && \
    apt update && apt-get update && \
    apt install apt-transport-https ca-certificates curl software-properties-common -y && \
    curl -fsSL https://download.docker.com/linux/ubuntu/gpg | apt-key add - && \
    add-apt-repository "deb [arch=amd64] https://download.docker.com/linux/ubuntu focal stable" && \
    echo "deb https://apt.dockerproject.org/repo ubuntu-focal main" | tee /etc/apt/sources.list.d/docker.list && \
    apt update && apt-get update

# Get additional repositories for Ubuntu
ENV DEBIAN_FRONTEND=noninteractive

#RUN apt-get install tzdata -y
RUN apt-get install nano -y \
    iputils-ping -y \
    wget -y \
    curl -y \
    gnupg2 -y \
    software-properties-common -y \
    build-essential -y \
    libssl-dev -y \
    git -y \
    nodejs -y \
    gcc g++ make -y \
    nocache -y && \
    wget -q -O - https://dl-ssl.google.com/linux/linux_signing_key.pub | apt-key add - && \
    sh -c 'echo "deb [arch=amd64] http://dl.google.com/linux/chrome/deb/ stable main" >> /etc/apt/sources.list.d/google.list' && \
    apt-get update && apt-get install -yq google-chrome-stable
    # install chrome for protractor tests

# install chrome
#RUN mkdir /etc/apk && touch /etc/apk/repositories
#RUN apt install \
#    chromium@edge \
#    harfbuzz@edge \
#    nss@edge \
#    && rm -rf /var/cache/* \
#    && mkdir /var/cache/apt

RUN mkdir -p /usr/src/app

# set working directory
WORKDIR /usr/src/app

# add `/usr/src/app/node_modules/.bin` to $PATH
ENV PATH /usr/src/app/node_modules/.bin:$PATH

# install app dependencies
#WORKDIR $PROJECT_DIR/educationMain
#RUN cp $PROJECT_DIR/educationMain/package.json /usr/src/app/package.json
#COPY ~/education/frontend/educationMain/package-lock.json /usr/src/app/package-lock.json



# copy the client directory into the container
COPY . /usr/src/app

WORKDIR $PROJECT_DIR


RUN npm i -g @angular/cli@latest && \
    npm i -g har-validator@latest && \
    npm i -g uuid@latest && \
    npm i -g ngx-device-detector@latest --save

# RUN npm install

# RUN npm install && \
#     i -g @angular/cli@latest && \
#     npm install --save-dev @angular-devkit/build-angular@latest




RUN mkdir -p /usr/startup
WORKDIR /usr/startup

# Run the entrypoint script
COPY entrypoint-frontend.sh /sbin/entrypoint-frontend.sh
RUN chmod 755 /sbin/entrypoint-frontend.sh

WORKDIR ${PROJECT_DIR}
