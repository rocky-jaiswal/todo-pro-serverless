#!/bin/sh

docker run -itd -p 8000:8000 amazon/dynamodb-local:2.6.1
cd ops-tf/dev/py
uv run src/dynamodb_local_dev_setup.py -a setup
