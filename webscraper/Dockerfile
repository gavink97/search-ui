FROM kasmweb/core-ubuntu-focal:1.13.0
USER root

ENV HOME /home/kasm-default-profile
ENV STARTUPDIR /dockerstartup
ENV INST_SCRIPTS $STARTUPDIR/install
WORKDIR $HOME

######### Customize Container Here ###########

# Installing Firefox
RUN apt-get update && apt-get install -y firefox

# Installing python, pip, and libraries
RUN apt-get update
RUN apt install -y wget build-essential libncursesw5-dev libssl-dev \
libsqlite3-dev tk-dev libgdbm-dev libc6-dev libbz2-dev libffi-dev zlib1g-dev
RUN add-apt-repository ppa:deadsnakes/ppa
RUN apt install -y python3.11
RUN apt install -y python3-pip

RUN mkdir -p /webscraper && chown -R 1000:0 /webscraper

RUN chown -R 1000:0 /app

COPY requirements.txt .

RUN pip install --no-cache-dir -r requirements.txt

COPY . ./pyapp

# Running the python script on startup
RUN echo "/usr/bin/python3 -u /pyapp/launcher.py" > $STARTUPDIR/custom_startup.sh \
&& chmod +x $STARTUPDIR/custom_startup.sh

######### End Customizations ###########

USER 1000
