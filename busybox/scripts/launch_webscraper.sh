#!/bin/sh

docker stop gluetun pyapp

# Start the containers
docker start gluetun
docker start pyapp
