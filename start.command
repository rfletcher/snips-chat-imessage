#!/usr/bin/env bash

DIR=$(dirname "$0")

cd "$DIR"
node --experimental-modules index.js | pino-pretty -i pid,hostname -t "SYS:HH:MM:ss"
