#!/bin/bash

# Change ownership of the mounted /app directory
chown -R 1000:0 /pyapp

# Execute the CMD (Python application)
exec "$@"
