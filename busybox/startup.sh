#!/bin/sh

exec > /tmp/startup.log 2>&1

echo "Starting the cron service..."
/usr/sbin/crond -f -l 8

echo "Setting up crontab..."
crontab /app/crontab.txt

echo "Crontab has been set up."
