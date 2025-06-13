#!/bin/sh

docker run -itd -p 8000:8000 amazon/dynamodb-local:2.6.1
cd ./dev/py && uv run src/dynamodb_local_dev.py -a setup
