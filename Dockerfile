FROM node:6.10.0

MAINTAINER xiz-tky

RUN useradd --user-group --create-home --shell /bin/false xiz

ENV HOME=/home/xiz

COPY package.json $HOME/app/
RUN chown -R xiz:xiz $HOME/*

USER xiz
WORKDIR $HOME/app
RUN npm install && npm cache clean
