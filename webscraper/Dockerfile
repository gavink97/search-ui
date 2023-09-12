FROM kasmweb/core-ubuntu-focal:1.14.0 
USER root

ENV PYTHONUNBUFFERED=1
ENV HOME /home/kasm-default-profile
ENV STARTUPDIR /dockerstartup

ENV INST_SCRIPTS $STARTUPDIR/install
WORKDIR $HOME

######### Customize Container Here ###########

RUN apt-get update && apt-get install -y firefox

RUN sh -c 'echo "deb [arch=amd64] http://dl.google.com/linux/chrome/deb/ stable main" >> /etc/apt/sources.list.d/google-chrome.list'
RUN wget -q -O - https://dl.google.com/linux/linux_signing_key.pub | sudo apt-key add -
RUN apt-get update
RUN apt-get install -y google-chrome-stable 

# Won't RUN if connected to VPN in Singapore
RUN apt install -y wget build-essential libncursesw5-dev libssl-dev \
libsqlite3-dev tk-dev libgdbm-dev libc6-dev libbz2-dev libffi-dev zlib1g-dev
RUN add-apt-repository ppa:deadsnakes/ppa
RUN apt install -y python3.11
RUN apt install -y python3-pip

COPY requirements.txt .

RUN pip install --no-cache-dir -r requirements.txt

RUN apt-get update && apt-get install -y netcat

RUN echo "#!/bin/bash" > $STARTUPDIR/custom_startup.sh \
    && echo "/usr/bin/python3 -u /pyapp/launcher.py" >> $STARTUPDIR/custom_startup.sh \
    && chmod +x $STARTUPDIR/custom_startup.sh

######### End Customizations ###########

RUN chown 1000:0 $HOME
RUN $STARTUPDIR/set_user_permission.sh $HOME
ENV HOME /home/kasm-user
WORKDIR $HOME
RUN mkdir -p $HOME && chown -R 1000:0 $HOME

USER 1000
