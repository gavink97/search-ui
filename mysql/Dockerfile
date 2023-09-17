FROM mysql:latest
USER root

COPY docker-healthcheck /usr/local/bin/

RUN mkdir -p /var/run/mysqld-process/
RUN chown mysql:mysql /var/run/mysqld-process/
RUN chmod 750 /var/run/mysqld-process/

#HEALTHCHECK CMD ["docker-healthcheck"]
