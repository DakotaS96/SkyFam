#!/bin/bash

find /opt/familychat/static/uploads -type f -mtime +30 -delete
