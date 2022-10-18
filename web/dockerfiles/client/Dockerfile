# base image

# FROM node:16.13.0
FROM node:14.20.1
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

# RUN npm install @angular/cli@12.2.16
# COPY package*.json ./

# RUN npm install --force

# COPY . .

# RUN npm run build --force

# RUN npm uninstall typescript --force && \
#     npm uninstall -g typescript --force && \
#     npm uninstall -g @angular/cli && \
#     npm uninstall @angular/cli && \
#     npm uninstall @angular-extensions/model --force

# RUN npm install -g typescript && \
#     npm i -g @angular/cli && \
#     npm i @angular/cli && \
#     npm i && \
#     npm install -g @angular/core && \
#     npm i && \
#     npm install --save-dev @angular-devkit/build-angular --force --legacy-peer-deps && \
# 	  npm i && \
#     npm install webpack-dev-server --force --legacy-peer-deps && \
# 	  npm i && \
#     npm install @angular-extensions/model@latest --legacy-peer-deps --force && \
#     npm i && \
#     npm install @angular/compiler-cli --force --legacy-peer-deps  && \
#     npm i && \
#     npm install @angular/material --force --legacy-peer-deps --save && \
#     npm i




# RUN ng update @angular/compiler-cli --force
# RUN npm install -g npm@7.5.6

	
# RUN npm install typescript@4.3.5 && \
# 	npm install -g @angular/cli@12.2.16 && \
# 	# npm install @angular/cli@12.2.16 && \
# 	npm install -g @angular/core@12.2.16 && \
# 	npm install --save-dev @angular-devkit/build-angular@12.2.17 && \
# 	npm install webpack-dev-server
	# npm install @angular-extensions/model@latest --legacy-peer-deps --force

WORKDIR /var/www/frontend/projects/angular-ngrx-material-starter
RUN npm install -g @angular/cli@12.2.18
RUN npm install -g @angular/cli@13.3.9


# RUN npm i -g har-validator && \
#     npm i -g uuid && \
#     npm i -g ngx-device-detector --save && \
#     npm install n && \
#     npm i && \
#     npm install immer && \
#     npm install ngx-uploadcare-widget && \
#     npm install pdfmake && \
#     npm install jspdf && \
#     npm install html-to-pdfmake

# RUN npm audit fix

# COPY . /usr/src/app

# WORKDIR $PROJECT_DIR/app

RUN mkdir -p /usr/startup
WORKDIR /usr/startup

# Run the entrypoint script
COPY entrypoint-frontend.sh /sbin/entrypoint-frontend.sh
RUN chmod 755 /sbin/entrypoint-frontend.sh

WORKDIR ${PROJECT_DIR}
