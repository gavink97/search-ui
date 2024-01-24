FROM python:3.12.0-alpine3.18

ENV LANG=C.UTF-8

USER root

ENV PYTHONUNBUFFERED=1

RUN mkdir -p app && touch startup.sh

ENV STARTUPDIR /app

ENV HOME /home/default

ARG DEBIAN_FRONTEND=noninteractive

ENV TZ=US/Central

WORKDIR $HOME

RUN : \
&& apk update \
&& apk --no-cache --virtual build-dependencies add g++\
&& apk --no-cache add firefox bash openblas openblas-dev busybox-openrc \
&& :

COPY --link requirements.txt .

RUN : \
&& pip install wheel setuptools pip --upgrade \
&& pip install --no-cache-dir -r requirements.txt \
&& apk del build-dependencies py-pip \
&& rm -f /sbin/apk \
&& rm -rf /etc/apk \
&& rm -rf /lib/apk \
&& rm -rf /usr/share/apk \
&& rm -rf /var/lib/apk \
&& :

WORKDIR $STARTUPDIR

COPY crontab /etc/cron.d/rpst-cron

RUN : \
# && adduser \
# --disabled-password \
# -u 1001 user \
&& chmod 0755 /etc/cron.d/ \
&& crontab /etc/cron.d/rpst-cron \
&& crontab -u root /etc/cron.d/rpst-cron \
&& chmod u+s /usr/sbin/crond \
&& touch /var/log/cron.log \
&& chmod u+rwx /var/log/cron.log \
&& chown root:0 $HOME \
&& :

ENV HOME /home/user

WORKDIR $HOME

RUN mkdir -p $HOME && chown -R root:0 $HOME

# USER user

# CMD crond && tail -f /var/log/cron.log

ENTRYPOINT ["/usr/sbin/crond", "-f", "6"]
