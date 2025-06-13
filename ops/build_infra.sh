#!/bin/sh

rm -rf ./artifacts/lambda/*.zip && \
tofu fmt && \
cd ./dev && \
tofu plan && \
tofu apply
