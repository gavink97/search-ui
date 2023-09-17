FROM ubuntu:latest 
USER root

ENV PYTHONUNBUFFERED=1
RUN mkdir -p app && touch startup.sh
ENV STARTUPDIR /app
ENV HOME /home/default
ARG DEBIAN_FRONTEND=noninteractive
ENV TZ=Asia/Jakarta
WORKDIR $HOME

RUN apt update -y && apt install sudo -y
RUN su - && usermod -aG sudo root

RUN apt-get update

# Won't RUN if connected to VPN in Singapore
RUN apt install -y wget build-essential libncursesw5-dev libssl-dev \
libsqlite3-dev tk-dev libgdbm-dev libc6-dev libbz2-dev libffi-dev zlib1g-dev

RUN sh -c 'echo "deb [arch=amd64] http://dl.google.com/linux/chrome/deb/ stable main" >> /etc/apt/sources.list.d/google-chrome.list'
RUN wget -q -O - https://dl.google.com/linux/linux_signing_key.pub | sudo apt-key add -
RUN apt-get install -y software-properties-common && apt-get update
RUN apt-get install -y google-chrome-stable 

RUN add-apt-repository ppa:deadsnakes/ppa
RUN apt install -y python3.11
RUN apt install -y python3-pip

COPY requirements.txt .

RUN pip install --no-cache-dir -r requirements.txt

RUN apt-get update && apt-get install -y netcat

RUN echo "#!/bin/bash" > $STARTUPDIR/startup.sh \
    && echo "/usr/bin/python3 -u /pyapp/launcher.py" >> $STARTUPDIR/startup.sh \
    && chmod +x $STARTUPDIR/startup.sh

RUN sudo deluser root sudo
RUN export SUDO_FORCE_REMOVE=yes && apt remove sudo -y

RUN chown 1000:0 $HOME
ENV HOME /home/user
WORKDIR $HOME
RUN mkdir -p $HOME && chown -R 1000:0 $HOME

USER 1000

ENTRYPOINT [ "/app/startup.sh" ]
